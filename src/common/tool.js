import * as API from '../vuex/api';

/** 启用禁用枚举 */
export const SwitchStatusEnum = {
  /** 启用 */
  On: 0,
  /** 禁用 */
  Off: 1
};
SwitchStatusEnum[SwitchStatusEnum.On] = '启用';
SwitchStatusEnum[SwitchStatusEnum.Off] = '禁用';

/** 编辑状态枚举 */
export const EditTypeEnum = {
  /** 新建 */
  Create: 'create',
  /** 修改 */
  Modify: 'modify'
};

/**
 * 把 100 以内的正整数转为字符串，并保证2位，缺的前面加 '0'
 * @param s 值为 0 到 99
 * @returns '00' 到 '99'
 */
export function padSecond(s) {
  return ('0' + s).substr(String(s).length - 1);
}

/**
 * 把时间戳转为 'yyyy-MM-DD HH:mm:ss'
 * @param {number|Date} ts 时间戳或者 Date 对象
 * @param {boolean} options.yyyyMMDD 只返回 yyyy-MM-DD
 * @param {boolean} options.HHmmss 只返回 HH:mm:ss
 */
export function formatDate(ts, options) {
  options = options || {};
  let date = ts;
  if (typeof ts === 'number') {
    date = new Date(ts);
  } else if (!ts) {
    return '';
  }
  let yyyyMMDD = date.getFullYear()
    + '-'
    + padSecond(date.getMonth() + 1)
    + '-'
    + padSecond(date.getDate());

  let HHmmss = padSecond(date.getHours())
    + ':'
    + padSecond(date.getMinutes())
    + ':'
    + padSecond(date.getSeconds());

  if (options.yyyyMMDD) {
    return yyyyMMDD;
  } else if (options.HHmmss) {
    return HHmmss;
  } else {
    return yyyyMMDD + ' ' + HHmmss;
  }
}

/**
 * 把时间戳转为 'MM-DD'
 * @param {*} ts 时间戳
 */
export function formatMonthDay(ts) {
  let date = new Date(ts);
  return padSecond(date.getMonth() + 1) + '-' + padSecond(date.getDate());
}

/**
 * 格式化金额
 * @param {number} amount 金额，单位：分
 * @param {number|object} digits 可选，小数位数
 * @return string
 */
export function formatMoney(amount, digits) {
  if (typeof amount !== 'number' && !amount) {
    return ''
  }

  let options = {};
  if (typeof digits === 'number') {
    options.digits = digits;
  } else if (digits) {
    options = digits;
  }
  if (typeof options.digits !== 'number') {
    options.digits = 2;
  }
  let realAmount = amount / 100;

  if (
    options.digits === 0
    && options.ensureLessThenOne
    && realAmount > -1
    && realAmount < 1) {
    options.digits = 2;
  }

  return realAmount.toFixed(options.digits)
}

export const ApiMethods = {
  getToken() {
    // return '0fa008c3ce284cd9b884b0ab57dd74b1';
    // return '586a5f371a5d40bb8aec7aed63ed5c90'; // user
    return localStorage.getItem('token');
  },
  getMerchantId() {
    // return 117;
    return localStorage.currentMerchantId;
  },
  getBrandId() {
    return JSON.parse(localStorage.getItem('userInfo')).userData.brandId;
  },
  getUserId() {
    // return 0;
    return JSON.parse(localStorage.getItem('userInfo')).userData.userDetail.userId;
  },
  getUserAccount() {
    // return '13111111111';
    return localStorage.getItem('account');
  },
  generateBody(param) {
    let body = {
      reqId: 0,
      channel: 10,
      os: '',
      ver: '',
      appVer: '',
      model: '',
      lng: '',
      lat: '',
      signType: '',
      sign: '',
      token: this.getToken(),
      param
    };
    return JSON.stringify(body);
  },
  request(url, param) {
    let options = {
      headers: {
        'content-type': 'application/json'
      }
    };

    let body = this.generateBody(param);

    return this.$http.post(url, body, options)
      .then(res => {
        let body = res.body;
        if (body.code !== 0) {
          let err = new Error(body.showMsg);
          throw err;
        }
        return body.data;
      }, res => {
        let err = new Error('网络存在问题');
        throw err;
      });
  }
};

const RegionCache = {
  province: null,
  city: {},
  area: {},

  provinceMap: {},
  cityMap: {},
  areaMap: {},

  provinceNameDict: {},
  cityNameDict: {},
  areaNameDict: {}
};
export const RegionApiMixin = {
  methods: {
    apiGetProvince() {
      let param = {
        merchantId: this.getMerchantId()
      };
      return this.request(API.PROVINCE, param);
    },
    apiGetCity(provinceId) {
      let param = {
        merchantId: this.getMerchantId(),
        provinceId
      };
      return this.request(API.CITY, param);
    },
    apiGetArea(cityId) {
      let param = {
        merchantId: this.getMerchantId(),
        cityId
      };
      return this.request(API.AREA, param);
    },
    getProvinceFromCache() {
      if (RegionCache.province) {
        return Promise.resolve(RegionCache.province);
      } else {
        return this.apiGetProvince()
          .then(data => {
            RegionCache.province = data;

            for (let it of RegionCache.province) {
              RegionCache.provinceMap[it.id] = it;
              RegionCache.provinceNameDict[it.mergeName] = it;
            }

            return RegionCache.province;
          });
      }
    },
    getCityFromCache(provinceId) {
      if (RegionCache.city[provinceId]) {
        return Promise.resolve(RegionCache.city[provinceId]);
      } else {
        return this.apiGetCity(provinceId)
          .then(data => {
            RegionCache.city[provinceId] = data;

            for (let it of RegionCache.city[provinceId]) {
              RegionCache.cityMap[it.id] = it;
              RegionCache.cityNameDict[it.mergeName] = it;
            }

            return RegionCache.city[provinceId];
          });
      }
    },
    getAreaFromCache(cityId) {
      if (RegionCache.area[cityId]) {
        return Promise.resolve(RegionCache.area[cityId]);
      } else {
        return this.apiGetArea(cityId)
          .then(data => {
            RegionCache.area[cityId] = data;

            for (let it of RegionCache.area[cityId]) {
              RegionCache.areaMap[it.id] = it;
              RegionCache.areaNameDict[it.mergeName] = it;
            }

            return RegionCache.area[cityId];
          });
      }
    },
    decodeRegion(region) {
      let result = {
        province: undefined,
        city: undefined,
        area: undefined,

        provinceList: [],
        cityList: [],
        areaList: []
      };

      return this.getProvinceFromCache()
        .then((provinceList) => {
          result.provinceList = provinceList;

          if (!region) {
            return;
          }

          let arr = region.split(' ');

          result.province = RegionCache.provinceNameDict['中国,' + arr[0]];
          if (!result.province) {
            return;
          }

          return this.getCityFromCache(result.province.id)
            .then((cityList) => {
              result.cityList = cityList;

              if (arr.length === 1) {
                return;
              }

              result.city = RegionCache.cityNameDict['中国,' + arr[0] + ',' + arr[1]];
              if (!result.city) {
                return;
              }

              return this.getAreaFromCache(result.city.id)
                .then((areaList) => {
                  result.areaList = areaList;

                  if (arr.length > 2) {
                    result.area = RegionCache.areaNameDict['中国,' + arr[0] + ',' + arr[1] + ',' + arr[2]];
                  }
                })
            })
        })
        .then(() => result);
    }
  }
};

export function timeToUnix(date) {
  var time = Date.parse(new Date(date));
  return time = time / 1000;
}

