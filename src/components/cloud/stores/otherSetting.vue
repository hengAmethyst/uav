<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
    <div class="section">
      <div class="shift-wrapper">
        <h2 class="shift-title">强制交接班</h2>
        <p class="shift-desc">说明：开启后将强制交接班，开班弹窗不能关闭，并在登录和退出时有交接班提醒</p>
        <i-switch v-model="switchControl" @on-change="change" class="switch-control"></i-switch>
      </div>
      <Form-item label="每日关账时间">
        <TimePicker type="time" format="HH:mm" placeholder="选择时间" style="width: 152px" :value="formValidate.time"
                    @on-change="handleTime"></TimePicker>
      </Form-item>
      <Form-item label="单据头内容" style="margin-bottom:0;">
        <Input style="width:300px;" v-model="formValidate.bills" placeholder="请输入单据头内容"></Input>
      </Form-item>
    </div>

    <div class="line"></div>

    <div class="section">
      <h2 class="title">门店WIFI设置</h2>
      <Form-item label="本店WIFI账户">
        <Input style="width:300px;" v-model="formValidate.wifi" placeholder="请输入wifi账户"></Input>
      </Form-item>
      <Form-item label="本店WIFI密码">
        <Input style="width:300px;" v-model="formValidate.pwd" placeholder="请输入wifi密码"></Input>
      </Form-item>
    </div>

    <div class="line"></div>

    <div class="section">
      <h2 class="title">门店二维码</h2>
      <Row>
        <Col span="8">
        <Form-item label="点餐码">
          <qrcanvas :options="{data:merchantQrCode,size:180}"></qrcanvas>
        </Form-item>
        </Col>
        <!-- <Col span="8">
        <Form-item label="会员码">
          <qrcanvas :options="{data:vipQrCode,size:180}"></qrcanvas>
        </Form-item>
        </Col> -->
      </Row>
    </div>
    <Form-item class="btn-group">
      <!--<Button type="ghost" @click="cancel" class="reset">取消</Button>-->
      <Button type="primary" @click="submit" class="submit">提交</Button>
    </Form-item>
  </Form>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';
  import Qrcanvas from 'qrcanvas-vue';

  export default {
    data() {
      return {
        qrCode: false,
        merchantQrCode: '',
        vipQrCode: '',
        switchControl: false,
        basicSettingId: null,
        formValidate: {
          time: '',
          bills: '',
          wifi: '',
          pwd: ''
        },
        ruleValidate: {}
      }
    },
    created() {
      this.getData();
      this.getQrCode();
      // this.getVipCode();
    },
    methods: {
      getData() {
        this.$http.post(api.MERCHANT + 'queryMcntOtherInfo',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.basicSettingId = response.data.basicSettingId;
              if (response.data.billTitleContent) {
                this.formValidate.bills = response.data.billTitleContent
              }
              if (response.data.closeAccountTime) {
                this.formValidate.time = response.data.closeAccountTime;
              }
              if (response.data.wifiAccount) {
                this.formValidate.wifi = response.data.wifiAccount;
              }
              if (response.data.wifiPassword) {
                this.formValidate.pwd = response.data.wifiPassword;
              }
              if (response.data.basicSettingStatus === 0) {
                this.switchControl = true;
              } else {
                this.switchControl = false;
              }
            } else {
              this.$Message.error('初始化信息失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getQrCode() {
        this.$http.post(api.MERCHANTIDQRCODE,
          JSON.stringify(this.getParam('qrcode')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.merchantQrCode = response.data.url;
              this.qrCode = true;
            } else {
              this.qrCode = false;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getVipCode() {
        this.$http.post(api.MERCHANTIDQRCODE,
          JSON.stringify(this.getParam('vip')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.vipQrCode = response.data.url;
              this.qrCode = true;
            } else {
              this.qrCode = false;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleTime(value) {
        this.formValidate.time = value;
      },
      change(status) {
        // console.log(status)
        this.switchControl = status;
      },
      submit() {
        this.$http.post(api.MERCHANT + 'modifyMcntOtherInfo',
          JSON.stringify(this.getParam('edit')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.$Message.success('提交成功')
            } else {
              this.$Message.error('提交失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      cancel() {
      },
      getParam(name) {
        if (name === 'qrcode') {
          return {
            lng: "",
            channel: 4,
            lat: "",
            merchantId: "1053",
            token: localStorage.getItem('token'),
            reqId: 1505130051,
            signType: "RSA",
            ver: "1.0",
            model: "PC",
            os: "Windows 10",
            param: {
              type: 4,
              merchantId: localStorage.currentMerchantId
            },
            sign: "42D50B2DBA2B79F3"
          }
        } else if (name === 'vip') {
          return {
            lng: "",
            channel: 4,
            lat: "",
            merchantId: "",
            token: localStorage.getItem('token'),
            reqId: 1505130051,
            signType: "RSA",
            ver: "1.0",
            model: "PC",
            os: "Windows 10",
            param: {
              type: 5,
              merchantId: localStorage.currentMerchantId
            },
            sign: "42D50B2DBA2B79F3"
          }
        } else if (name === 'get') {
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
              merchantId: localStorage.currentMerchantId
            }
          }
        } else if (name === 'edit') {
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
              basicSettingId: this.basicSettingId,
              basicSettingStatus: this.switchControl ? 0 : 1,
              closeAccountTime: this.formValidate.time,
              billTitleContent: this.formValidate.bills,
              wifiAccount: this.formValidate.wifi,
              wifiPassword: this.formValidate.pwd
            }
          }
        }
      }
    },
    components: {
      Qrcanvas
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .section {
    padding-bottom: 24px;
    .title {
      position: relative;
      margin-bottom: 24px;
      padding-left: 16px;
      height: 25px;
      line-height: 25px;
      font-size: 18px;
      color: #1f2d3d;
      font-weight: normal;
      &:before {
        display: block;
        position: absolute;
        content: "";
        width: 4px;
        height: 18px;
        left: 0;
        top: 3px;
        background: #ff4949;
        z-index: 10;
      }
    }
  }

  .shift-wrapper {
    position: relative;
    margin-bottom: 32px;
    width: 100%;
    padding: 16px 24px;
    border: 1px solid #e5e9f2;
    .shift-title {
      margin-bottom: 12px;
      height: 22px;
      line-height: 22px;
      color: #475669;
      font-size: 16px;
      font-weight: normal;
    }
    .shift-desc {
      height: 14px;
      line-height: 14px;
      font-size: 14px;
      color: #99a9bf;
    }
    .switch-control {
      position: absolute;
      right: 24px;
      top: 50%;
      margin-top: -12px;
      z-index: 10;
    }
  }

  .line {
    margin-bottom: 24px;
    width: 100%;
    height: 2px;
    border: 1px solid #e5e9f2;
  }

  .qrCode-wrapper {
    width: 300px !important;
    .ivu-modal-body {
      text-align: center;
    }
  }

  .btn-group {
    text-align: center;
    .reset {
      width: 144px;
      height: 36px;
      border-radius: 2px;
      background-color: #ffffff;
      border: solid 1px #c0ccda;
      color: #475669;
      font-size: 14px;
      &:hover {
        opacity: .9;
      }
    }

    .submit {
      margin-left: 12px;
      width: 144px;
      height: 36px;
      border-radius: 2px;
      background-color: #ff4949;
      font-size: 14px;
      &:hover {
        opacity: .9;
      }
    }
  }
</style>
