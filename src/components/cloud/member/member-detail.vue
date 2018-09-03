<template>
  <div class="member-detail titled-content">
    <p class="title">{{title}}</p>
    <div class="content">
      <Form ref="form" :model="value" :rules="rules" :label-width="80">
        <Form-item label="姓名" required prop="name">
          <i-input v-model="value.name" placeholder="请输入会员姓名"></i-input>
        </Form-item>
        <Form-item label="性别">
          <i-select v-model="value.gender">
            <i-option :value="1">男</i-option>
            <i-option :value="0">女</i-option>
          </i-select>
        </Form-item>
        <Form-item class="phone" label="手机号" required prop="phone">
          <i-input v-model="value.phone" :maxlength="11" placeholder="请输入会员手机号（默认密码为手机号码后六位）"></i-input>
          <!-- <Button class="send-btn" @click="onClickGetValidationCode" :disabled="this.timeLeft > 0">{{getValidationCodeStr}}</Button> -->
        </Form-item>
        <!-- <Form-item label="验证码" required prop="verificationCode"> -->
          <!-- <i-input v-model="value.verificationCode" :maxlength="6" placeholder="请输入验证码"></i-input> -->
        <!-- </Form-item> -->
        <Form-item label="余额" prop="balance">
          <i-input :disabled="true" v-model="value.balance" placeholder="请输入余额"></i-input>
        </Form-item>
        <Form-item label="每月挂账额" prop="paymentAmount">
          <i-input v-model="value.paymentAmount" placeholder="请输入挂账额度"></i-input>
        </Form-item>
        <Form-item label="身份证号码" prop="idCardNo">
          <i-input v-model="value.idCardNo" placeholder="请输入身份证号码"></i-input>
        </Form-item>
        <Form-item label="生日">
          <DatePicker v-model="value.birthday" type="date" :options="dateOptions" placeholder="选择日期"></DatePicker>
        </Form-item>
        <Form-item class="address" label="地址">
          <i-select :value="value.provinceId" @on-change="selectProvince" placeholder="省">
            <i-option v-for="item in value.provinceList" :value="item.id" :key="item.id">{{item.name}}</i-option>
          </i-select>
          <i-select :value="value.cityId" :disabled="!value.provinceId" @on-change="selectCity" placeholder="市">
            <i-option v-for="item in value.cityList" :value="item.id" :key="item.id">{{item.name}}</i-option>
          </i-select>
          <i-select :value="value.areaId" :disabled="!value.cityId" @on-change="selectArea" placeholder="区">
            <i-option v-for="item in value.areaList" :value="item.id" :key="item.id">{{item.name}}</i-option>
          </i-select>
          <i-input v-model="value.address"></i-input>
        </Form-item>
        <Form-item class="remark" label="备注">
          <i-input type="textarea" v-model="value.remark" placeholder="请输入备注信息"></i-input>
        </Form-item>
        <Form-item class="action">
          <Button @click="onClickCancel">取消</Button>
          <Button type="primary" @click="onClickSubmit">提交</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';

/** 接口地址 */
const SvcUrl = {
  Create: API.MEMBER + 'addMember',
  Update: API.MEMBER + 'updateMember',
  SendMessage: API.MEMBER + 'sendMessage',
  CheckSmsCode: API.LOGIN + 'exitSmsCodeByPhone'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiCreateItem(item) {
      let param = {
        merchantId: this.getMerchantId(),
        ...item
      };
      return this.request(SvcUrl.Create, param);
    },
    apiUpdateItem(item) {
      let param = {
        merchantId: this.getMerchantId(),
        ...item
      };
      return this.request(SvcUrl.Update, param);
    },
    apiSendMessage(phone) {
      let param = {
        phone,
        merchantId: this.getMerchantId(),
        type: 1,
        childType: 11
      };
      return this.request(SvcUrl.SendMessage, param);
    },
    apiCheckSmsCode(phone, smsCode) {
      let param = {
        phone,
        smsCode
      };
      return this.request(SvcUrl.CheckSmsCode, param);
    }
  }
};

const DefaultValue = {
  id: undefined,
  name: '',
  gender: '',
  phone: '',
  verificationCode: '',
  balance: 0,
  paymentAmount: '',
  weixin: '',
  alipay: '',
  idCardNo: '',
  birthday: null,
  provinceId: undefined,
  provinceName: '',
  cityId: undefined,
  cityName: '',
  areaId: undefined,
  areaName: '',
  address: '',
  remark: '',

  provinceList: [],
  cityList: [],
  areaList: []
};
const generateDefaultValue = () => {
  let value = { ...DefaultValue };
  value.provinceList = [];
  value.cityList = [];
  value.areaList = [];
  return value;
};

const ValueConvertor = {
  toLocal(item) {
    let value = {
      id: item.id,
      name: item.name,
      gender: item.sex,
      phone: item.phone,
      verificationCode: '',
      balance: item.balance,
      paymentAmount: item.quota,
      weixin: '',
      alipay: '',
      idCardNo: item.idCard,
      birthday: undefined,
      provinceId: null,
      provinceName: '',
      cityId: null,
      cityName: '',
      areaId: null,
      areaName: '',
      address: item.address,
      remark: item.remark,

      provinceList: [],
      cityList: [],
      areaList: []
    };
    if (value.paymentAmount) {
      value.paymentAmount /= 100;
    }
    if (value.balance) {
      value.balance /= 100;
    }
    if (item.birthday) {
      value.birthday = new Date(item.birthday);
    }
    if (item.region) {
      let arr = item.region.split(' ');
      if (arr.length > 0) {
        value.provinceName = arr[0];
      }
      if (arr.length > 1) {
        value.cityName = arr[1];
      }
      if (arr.length > 2) {
        value.areaName = arr[2];
      }
    }
    return value;
  },
  toRemote(value) {
    let item = {
      id: value.id,
      phone: value.phone,
      name: value.name,
      // pwd: value.verificationCode,
      quota: value.paymentAmount,
      remark: value.remark,
      balance: value.balance || 0,
      birthday: undefined,
      sex: value.gender,
      idCard: value.idCardNo,
      region: (value.provinceName || '') + ' ' + (value.cityName || '') + ' ' + (value.areaName || ''),
      address: value.address || ''
    };
    if (item.quota) {
      item.quota = Number(item.quota) * 10 * 10;
    }
    if (item.balance) {
      item.balance = Number(item.balance) * 10 * 10;
    }
    if (value.birthday) {
      item.birthday = value.birthday.toISOString();
    }
    return item;
  }
};

export default {
  mixins: [SvcApi, Tool.RegionApiMixin],

  data() {
    return {
      // 当前编辑模式
      editType: Tool.EditTypeEnum.Create,
      initializing: false,

      value: { ...generateDefaultValue() },

      timeLeft: 0,
      sentValidationCodeTime: 0,
      timer: null,

      dateOptions: {
        disabledDate: (date) => {
          return date > new Date();
        }
      },

      rules: {
        name: [{ required: true, message: '必填' }, { max: 10, message: '小于等于 10 字' }],
        phone: [{ required: true, pattern: /^1\d{10}$/, message: '不正确的手机号', trigger: 'blur' }],
        verificationCode: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('验证码不正确'));
              return;
            }
            this.apiCheckSmsCode(this.value.phone ,value)
              .then(data => {
                callback();
              }, err => {
                callback(new Error('验证码不正确'));
              });
          },
          trigger: 'blur'
        }],
        balance: [{ pattern: /^\d+(?:.\d*)?$/, message: '不是有效数字' }],
        paymentAmount: [{ pattern: /^\d+(?:.\d*)?$/, message: '不是有效数字' }],
        idCardNo: [{ pattern: /^\d{17}(\d|X|x)$/, message: '不是有效身份证号' }]
      }
    };
  },

  computed: {
    title() {
      if (this.editType === Tool.EditTypeEnum.Create) {
        return '添加会员';
      } else if (this.editType === Tool.EditTypeEnum.Modify) {
        return '编辑会员';
      }
    },
    getValidationCodeStr() {
      if (this.sentValidationCodeTime === 0 && this.timeLeft === 0) {
        return '获取验证码'
      }
      if (this.timeLeft > 0) {
        return '重新获取(' + this.timeLeft + ')';
      } else if (this.timeLeft <= 0) {
        return '重新获取';
      }
    }
  },

  methods: {
    create() {
      this.editType = Tool.EditTypeEnum.Create;
      this.$refs.form.resetFields();

      let value = { ...generateDefaultValue() };
      this.getProvinceFromCache()
        .then((provinceList) => {
          value.provinceList = provinceList;
          this.value = value;
        }, () => {
          this.value = value;
        });
    },
    modify(item) {
      this.editType = Tool.EditTypeEnum.Modify;
      this.$refs.form.resetFields();

      let value = ValueConvertor.toLocal(item);
      this.initializing = true;
      this.decodeRegion(item.region)
        .then(region => {
          if (region.province) {
            value.provinceId = region.province.id;
            value.provinceName = region.province.name;
          }
          if (region.city) {
            value.cityId = region.city.id;
            value.cityName = region.city.name;
          }
          if (region.area) {
            value.areaId = region.area.id;
            value.areaName = region.area.name;
          }

          value.provinceList = region.provinceList;
          value.cityList = region.cityList;
          value.areaList = region.areaList;

          this.value = value;
        }, err => {
          this.value = value;
        })
        .then(() => this.initializing = false, () => this.initializing = false);
    },

    getProvince() {
      this.getProvinceFromCache()
        .then(data => {
          this.value.provinceList = data;
        }, err => {
          this.$Message.error('初始化地址信息失败,请检查网络');
        });
    },
    getCity(provinceId) {
      this.getCityFromCache(provinceId)
        .then(data => {
          this.value.cityList = data;
        }, err => {
          this.$Message.error('初始化地址信息失败,请检查网络');
        });
    },
    getArea(cityId) {
      this.getAreaFromCache(cityId)
        .then(data => {
          this.value.areaList = data;
        }, err => {
          this.$Message.error('初始化地址信息失败,请检查网络');
        });
    },

    onClickGetValidationCode() {
      if (!this.timer) {
        this.sentValidationCodeTime++;
        this.timeLeft = 60;
        this.timer = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
        this.apiSendMessage(this.value.phone);
      }
    },
    onClickCancel() {
      this.$emit('cancel');
    },
    onClickSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let item = ValueConvertor.toRemote(this.value);
          if (this.editType === Tool.EditTypeEnum.Create) {
            this.apiCreateItem(item)
              .then(data => {
                this.$emit('submit');
              }, err => {
                this.$Message.error(err.message);
              });

          } else if (this.editType === Tool.EditTypeEnum.Modify) {
            this.apiUpdateItem(item)
              .then(data => {
                this.$emit('submit');
              }, err => {
                this.$Message.error(err.message);
              });
          }

        }
      })
    },

    selectProvince(value) {
      if (this.editType === Tool.EditTypeEnum.Modify && this.initializing) {
        return;
      }

      if (!value) {
        return;
      }

      this.value.provinceId = value;
      this.value.cityId = null;
      this.value.areaId = null;

      let provinceItem = this.value.provinceList.find(it => it.id === value);
      this.value.provinceName = provinceItem ? provinceItem.name : '';
      this.value.cityName = '';
      this.value.areaName = '';

      if (this.value.cityList.length) {
        this.value.cityList = [];
      }
      this.getCity(this.value.provinceId);
    },
    selectCity(value) {
      if (this.editType === Tool.EditTypeEnum.Modify && this.initializing) {
        return;
      }

      if (!value) {
        return;
      }

      this.value.cityId = value;
      this.value.areaId = null;

      let cityItem = this.value.cityList.find(it => it.id === value);
      this.value.cityName = cityItem ? cityItem.name : '';
      this.value.areaName = '';

      if (this.value.areaList.length) {
        this.value.areaList = [];
      }
      this.getArea(this.value.cityId);
    },
    selectArea(value) {
      if (this.editType === Tool.EditTypeEnum.Modify && this.initializing) {
        return;
      }

      if (!value) {
        return;
      }

      this.value.areaId = value;

      let areaItem = this.value.areaList.find(it => it.id === value);
      this.value.areaName = areaItem ? areaItem.name : '';
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.titled-content {
  background-color: #eff2f7;
  p.title {
    font-size: 16px;
    color: #1f2d3d;
    height: 40px;
    line-height: 40px;
    border-bottom: solid 1px #d3dce6;
    padding: 0 24px;
  }

  .content {
    background-color: #fff;
    padding: 22px 24px 40px 24px;
  }
}

.member-detail.titled-content .ivu-form {
  .ivu-input {
    width: 640px;
    height: 36px;
  }
  .ivu-select {
    width: 640px;
    height: 36px;
  }
  .ivu-btn {
    height: 36px;
  }

  .ivu-form-item {
    display: inline-block;
  }

  // .phone {
  //   .ivu-input-wrapper {
  //     width: 540px;
  //     margin-right: 5px;
  //     .ivu-input {
  //       width: 540px;
  //     }
  //   }
  // }
  .send-btn {
    color: #ff4949;
    border: solid 1px #ff4949;
  }
  .address {
    .ivu-select {
      width: 106px;
    }
    .ivu-input-wrapper {
      width: auto;
      .ivu-input {
        width: 1032px;
      }
    }
  }
  .remark {
    .ivu-input {
      height: 168px;
      width: 1360px;
    }
  }
  .action {
    display: block;
    width: 316px;
    margin: 209px auto 40px;

    .ivu-btn {
      width: 144px;
      height: 36px;
      margin: 0 6px;
    }

    .ivu-form-item-content {
      margin-left: 0 !important;
    }
  }
}
</style>
