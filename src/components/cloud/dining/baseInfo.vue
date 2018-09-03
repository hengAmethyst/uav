<template>
  <div class="payment-wrapper">
    <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <!--<h2 class="title">上传现有收款码</h2>-->
      <!--<Row>-->
        <!--<Col span="8">-->
        <!--<Form-item label="支付宝收款码">-->
          <!--<div v-if="formValidate.aliPay" class="qrcode-upload">-->
            <!--<img class="img" :src="formValidate.aliPay" width="180" height="180">-->
            <!--<div class="store-upload-list-cover">-->
              <!--<Icon type="ios-eye-outline" @click.native="handleView(formValidate.aliPay)"></Icon>-->
              <!--<Icon type="ios-trash-outline" @click.native="handleRemove('aliPay')"></Icon>-->
            <!--</div>-->
          <!--</div>-->

          <!--<Upload v-else style="width: 180px;" type="drag" :show-upload-list="false" :on-success="aliPay"-->
                  <!--:format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"-->
                  <!--:on-exceeded-size="handleMaxSize" :action="resourceUrl">-->
            <!--<div style="width: 180px;height: 180px;margin:0 auto;padding-top: 50px;">-->
              <!--<Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>-->
              <!--<p>点击或将文件拖拽到这里上传</p>-->
            <!--</div>-->
          <!--</Upload>-->
        <!--</Form-item>-->
        <!--</Col>-->
        <!--<Col span="8">-->
        <!--<Form-item label="微信收款码">-->
          <!--<div v-if="formValidate.weChat" class="qrcode-upload">-->
            <!--<img class="img" :src="formValidate.weChat" width="180" height="180">-->
            <!--<div class="store-upload-list-cover">-->
              <!--<Icon type="ios-eye-outline" @click.native="handleView(formValidate.weChat)"></Icon>-->
              <!--<Icon type="ios-trash-outline" @click.native="handleRemove('weChat')"></Icon>-->
            <!--</div>-->
          <!--</div>-->

          <!--<Upload v-else style="width: 180px;" type="drag" :show-upload-list="false" :on-success="weChat"-->
                  <!--:format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"-->
                  <!--:on-exceeded-size="handleMaxSize" :action="resourceUrl">-->
            <!--<div style="width: 180px;height: 180px;margin:0 auto;padding-top: 50px;">-->
              <!--<Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>-->
              <!--<p>点击或将文件拖拽到这里上传</p>-->
            <!--</div>-->
          <!--</Upload>-->
        <!--</Form-item>-->
        <!--</Col>-->
      <!--</Row>-->

      <!--<Form-item label="说明：">-->
        <!--<p class="desc-p">1、聚合码同时支持微信、支付宝扫码支付，一码多扫，扫码更方便，收银更简单；</p>-->
        <!--<p class="desc-p">2、如果未开通收款码，点击“下一步”，填写申请信息，以开通收款码；</p>-->
        <!--<p class="desc-p">3、如果已开通，同一种收款方式不能再次申请。请上传现有支付码，以生成聚合码。</p>-->
      <!--</Form-item>-->

      <!--<div class="line"></div>-->

      <h2 class="title">基本信息</h2>

      <Row>
        <Col :md="24" :lg="16">
        <Form-item label="商户门头名称" prop="storeName">
          <Input type="text" v-model="formValidate.storeName" placeholder="请输入商户门头名称"></Input>
        </Form-item>
        </Col>

        <Col :md="24" :lg="16">
        <Form-item label="商户简称" prop="short">
          <Input type="text" v-model="formValidate.short" placeholder="请输入商户简称"></Input>
        </Form-item>
        </Col>

        <Col :md="24" :lg="16">
        <Form-item label="商户类型" prop="type">
          <Select v-model="formValidate.type" placeholder="请选择商户类型">
            <Option v-for="item in typeList" :value="item.mcc_cd" :key="item.mcc_cd">{{item.mcc_nm}}</Option>
          </Select>
        </Form-item>
        </Col>

        <Col :md="24" :lg="16">
          <Row>
            <Col :md="8" :lg="8">
            <Form-item label="地址" prop="provinceName" style="margin-right:5px;">
              <Select v-model="formValidate.provinceName" placeholder="省" @on-change="selectProvince">
                <Option v-for="item in provinceList" :value="item.name" :key="item.id"></Option>
              </Select>
            </Form-item>
            </Col>
            <Col :md="4" :lg="5">
            <Form-item prop="cityName" style="margin-right:5px;" class="address-select">
              <Select v-model="formValidate.cityName" placeholder="市" @on-change="selectCity"
                      :disabled="!formValidate.provinceName">
                <Option v-for="item in cityList" :value="item.name" :key="item.id"></Option>
              </Select>
            </Form-item>
            </Col>
            <Col :md="4" :lg="5">
            <Form-item prop="areaName" style="margin-right:5px;" class="address-select">
              <Select v-model="formValidate.areaName" placeholder="区/县" @on-change="selectArea"
                      :disabled="!formValidate.cityName">
                <Option v-for="item in areaList" :value="item.merc_area" :key="item.area_nm">{{item.area_nm}}</Option>
              </Select>
            </Form-item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col :md="24" :lg="16">
        <Form-item label="具体地址" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入具体地址"></Input>
        </Form-item>
        </Col>
      </Row>

      <div class="line"></div>

      <h2 class="title">商户负责人信息</h2>

      <Row>
        <Col :md="24" :lg="16">
        <Form-item label="姓名" prop="name">
          <Input v-model="formValidate.name" type="text" placeholder="请输入负责人姓名"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="手机号" prop="mobile">
          <Input v-model="formValidate.mobile" type="text" placeholder="请输入负责人手机号"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="邮箱" prop="email">
          <Input v-model="formValidate.email" type="text" placeholder="请输入负责人邮箱"></Input>
        </Form-item>
        </Col>
      </Row>

      <Form-item class="btn-group">
        <button type="primary" @click="submit('formValidate')" class="submit" style="margin-left:-120px;">下一步</Button>
      </Form-item>
    </Form>
    <Modal title="查看图片" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api'

  export default {
    props: {
      info: {
        type: Object
      }
    },
    data() {
      return {
        // spinShow: true,
        formValidate: {
          aliPay: '',
          weChat: '',
          storeName: '',
          short: '',
          provinceId: null,
          provinceName: '',
          type: '',
          cityId: null,
          cityName: '',
          areaId: '',
          areaName: '',
          address: '',
          name: '',
          mobile: '',
          email: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '商户负责人姓名不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '商户负责人手机不能为空', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '商户负责人邮箱不能为空', trigger: 'blur'},
            {type: 'email', message: '邮箱格式错误'}
          ],
          storeName: [
            {required: true, message: '商户名称不能为空', trigger: 'blur'}
          ],
          short: [
            {required: true, message: '商户简称不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择商户分类', trigger: 'change'}
          ],
          address: [
            {required: true, message: '商户地址不能为空', trigger: 'blur'}
          ],
          provinceName: [
            {required: true, type: 'string', message: '请选择省份', trigger: 'change'}
          ],
          cityName: [
            {required: true, type: 'string', message: '请选择城市', trigger: 'change'}
          ],
          areaName: [
            {required: true, type: 'string', message: '请选择区/县', trigger: 'change'}
          ]
        },
        provinceName: [],
        cityName: [],
        typeList: [
          {
            mcc_cd: '5812',
            mcc_nm: '就餐场所和餐馆，不包括营业面积100平方米(含)以下的餐饮服务'
          },
          {
            mcc_cd: '5814',
            mcc_nm: '快餐店，专指营业面积100平方米(含)以下的就餐场所和餐馆'
          },
          {
            mcc_cd: '5451',
            mcc_nm: '乳制品店、冷饮店，不包括以提供饮品的休闲娱乐场所'
          },
          {
            mcc_cd: '5462',
            mcc_nm: '面包房、糕点商店，店后加工生产，店前销售面包店、糕点店。不包括以提供饮品的休闲娱乐场所'
          },
          {
            mcc_cd: '5813',
            mcc_nm: '饮酒场所(酒吧、酒馆、夜总会、鸡尾酒大厅，迪斯科舞厅)'
          },
          {
            mcc_cd: '5811',
            mcc_nm: '包办伙食，宴会承包商'
          },
          {
            mcc_cd: '9703',
            mcc_nm: '县乡优惠 - 宾馆餐饮类'
          }
        ],
        addressList: [],
        provinceList: [],
        cityList: [],
        areaList: [],
        resourceUrl: api.RESOURCE,
        imgName: '',
        visible: false
      }
    },
    created() {
      this.getProvince();

    },
    mounted() {

    },
    methods: {
      aliPay(res, file) {
        console.log(res)
        if (res.code === 0) {
          this.formValidate.aliPay = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
      },
      weChat(res, file) {
        if (res.code === 0) {
          this.formValidate.weChat = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
      },
      handleReset() {

      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.PAYMENT_MERCHANT + 'quickpayment/commit',
              JSON.stringify(this.getParam('submit')))
              .then(res => {
                // console.log(res)
                let response = res.body;
                if (response.code === 0) {
                  this.$Message.success('基础信息提交成功');
                  this.$emit('nextstep', 'finish');
                } else {
                  this.$Message.error('基础信息提交失败');
                }
              })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      selectProvince(value) {
        if (!value) {
          return;
        }

        let provinceItem = this.provinceList.find(it => it.name === value);
        this.formValidate.provinceId = provinceItem ? provinceItem.id : null;
        this.formValidate.cityId = null;
        this.formValidate.areaId = '';

        this.getCity();
      },
      selectCity(value) {
        if (!value) {
          return;
        }

        let cityItem = this.cityList.find(it => it.name === value);
        this.formValidate.cityId = cityItem ? cityItem.id : null;
        this.formValidate.areaId = '';

        this.getArea();
      },
      selectArea(value) {
        if (!value) {
          return;
        }

        let areaItem = this.areaList.find(it => it.merc_area === value);
        this.formValidate.areaId = areaItem ? areaItem.area_nm : '';
      },
      getProvince() {
        this.$http.post(api.PROVINCE,
          JSON.stringify(this.getParam('province')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.provinceList = response.data;
              if (this.info) {
                this.requireInfo(this.info)
              }
            } else {
              this.$Message.error('初始化地址信息失败,请检查网络')
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      getCity() {
        this.$http.post(api.CITY,
          JSON.stringify(this.getParam('city')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.cityList = response.data;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getArea() {
        this.$http.post(api.PAYMENT_MERCHANT + 'merchant/area/codes',
          JSON.stringify(this.getParam('area')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.areaList = JSON.parse(response.data);
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove(name) {
        this.formValidate[name] = '';
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 5M。'
        });
      },
      requireInfo(data) {
        this.formValidate.weChat = data.wechatReceiptUrl;
        this.formValidate.aliPay = data.aliReceiptUrl;
        this.formValidate.storeName = data.merchantName;
        this.formValidate.short = data.merchantNickname;
        this.formValidate.type = data.merchantType + '';
        this.formValidate.provinceName = data.province;
        this.formValidate.cityName = data.city;
        this.formValidate.areaName = data.areaCode;
        this.formValidate.address = data.detailAddress;
        this.formValidate.name = data.responsiblePersonName;
        this.formValidate.mobile = data.responsiblePersonMobile;
        this.formValidate.email = data.responsiblePersonEmail;
      },
      getParam(name) {
        if (name === 'province') {
          return {
            lng: "string",
            channel: 4,
            lat: "string",
            token: localStorage.getItem('token'),
            reqId: 1504748042,
            signType: "RSA",
            ver: "2.0",
            model: "PC",
            os: "Windows 10",
            merchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId,
            param: {
              merchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId
            },
            sign: "BFC60141CBCD41E1"
          }
        } else if (name === 'city') {
          return {
            lng: "string",
            channel: 4,
            lat: "string",
            token: localStorage.getItem('token'),
            reqId: 1504748042,
            signType: "RSA",
            ver: "1.0",
            model: "PC",
            os: "Windows 10",
            merchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId,
            param: {
              merchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId,
              provinceId: this.formValidate.provinceId
            },
            sign: "F540413C4DB26B4D"
          }
        } else if (name === 'area') {
          return {
            reqId: 0,
            channel: 0,
            os: "web",
            ver: "v2",
            appVer: "v2",
            model: "string",
            lng: "0",
            lat: "0",
            signType: "string",
            sign: "string",
            token: localStorage.getItem('token'),
            param: {
              prov_nm: this.formValidate.provinceName,
              city_nm: this.formValidate.cityName
            }
          }
        } else if (name === 'submit') {
          return {
            reqId: 0,
            channel: 0,
            os: "web",
            ver: "v2",
            appVer: "v2",
            model: "string",
            lng: "0",
            lat: "0",
            signType: "string",
            sign: "string",
            token: localStorage.getItem('token'),
            param: {
              merchantId: localStorage.currentMerchantId,
              wechatReceiptUrl: this.formValidate.weChat,
              aliReceiptUrl: this.formValidate.aliPay,
              merchantName: this.formValidate.storeName,
              merchantNickname: this.formValidate.short,
              merchantType: this.formValidate.type,
              merchantTypeName: this.formValidate.typeName,
              province: this.formValidate.provinceName,
              city: this.formValidate.cityName,
              areaCode: this.formValidate.areaName,
              area:this.formValidate.areaId,
              detailAddress: this.formValidate.address,
              responsiblePersonName: this.formValidate.name,
              responsiblePersonMobile: this.formValidate.mobile,
              responsiblePersonEmail: this.formValidate.email,
              step: 1
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .qrcode-upload {
    display: inline-block;
    width: 180px;
    height: 180px;
    text-align: center;
    line-height: 180px;
    border: 1px solid transparent;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 40px;
    img {
      width: 100%;
      height: 100%;
    }
    &:hover {
      .store-upload-list-cover {
        display: block;
      }
    }
    .store-upload-list-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, .6);
      i {
        color: #fff;
        font-size: 50px;
        cursor: pointer;
        margin: 0 20px;
      }
    }
  }

  .payment-wrapper {
    position: relative;
    z-index: 10;
    .title {
      position: relative;
      margin-bottom: 32px;
      padding-left: 16px;
      height: 25px;
      line-height: 25px;
      font-size: 20px;
      font-weight: normal;
      z-index: 1;
      color: #1f2d3d;
      &::before {
        position: absolute;
        display: block;
        content: "";
        width: 4px;
        height: 18px;
        left: 0;
        top: 3px;
        z-index: 10;
        background: #ff4949;
      }
    }

    .desc-p {
      line-height: 2;
    }

    .address-select {
      .ivu-form-item-content {
        margin-left: 0 !important;
      }
    }

    .btn-group {
      margin-top: 20px;
      text-align: center;
      .reset {
        margin-left:-120px;
        margin-right: 12px;
        width: 144px;
        height: 36px;
        border-radius: 2px;
        background-color: #ffffff;
        border: solid 1px #c0ccda;
        color: #475669;
        font-size: 14px;
        outline: none;
        cursor: pointer;
        &:hover {
          opacity: .9;
        }
      }

      .submit {
        width: 144px;
        height: 36px;
        border-radius: 2px;
        background-color: #ff4949;
        font-size: 14px;
        color: #fff;
        border: none;
        outline: none;
        cursor: pointer;
        &:hover {
          opacity: .9;
        }
      }
    }
  }
</style>
