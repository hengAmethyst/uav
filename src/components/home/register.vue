<template>
  <div class="register">
    <div class="register-panel clearfix">
      <div class="left">
        <img src="../../assets/image/logo_b.png" width="136" height="136">
        <p class="logo-desc">晶蝶云平台</p>
        <p class="phone-desc">免费服务热线：400-685-8188</p>
      </div>
      <div class="right">
        <div class="top-btn clearfix">
          <a href="javascript:void(0);" class="back" @click="goBack">
            <Icon type="chevron-left" size="16"></Icon>
            登录</a>
          <h2 class="title">用户注册</h2>
        </div>
        <Form class="form" ref="form" :model="form" :rules="rule">
          <Form-item prop="account">
            <Input type="text" class="phone" v-model="form.account" placeholder="请输入手机号">
            </Input>
          </Form-item>
          <Form-item prop="password">
            <Input type="text" class="phone" v-model="form.password" placeholder="设置登录密码(6-16位)">
            </Input>
          </Form-item>
          <Form-item prop="code">
            <Input type="text" class="code" v-model="form.code" placeholder="请输入验证码">
            </Input>
            <button class="get-code" @click="getCode" v-if="!sendCode">获取验证码</button>
            <button class="get-code" v-else>{{timeOut}}S</button>
          </Form-item>
        </Form>
        <div class="foot-btn clearfix">
          <Checkbox v-model="agreement" class="agreement" @on-change="handleChange">已阅读<a href="javascript:void(0)"
                                                                                          @click="model = true">晶汉服务协议</a>
          </Checkbox>
          <button class="submit" @click="handleSubmit('form')">注册</button>
        </div>
      </div>
    </div>

    <Modal
      v-model="model"
      title="晶汉服务协议"
      @on-ok="ok"
      width="500">
      <div style="text-align:center;height: 500px;overflow: scroll;">
        <p v-html="contractInfo"></p>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../vuex/api'

  export default {
    data () {
      return {
        form: {
          account: '',
          password: '',
          code: ''
        },
        rule: {
          account: [
            {required: true, message: '请填写手机号', pattern: /^1\d{10}$/, trigger: 'blur', type: 'string', min: 11, max: 11}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请填写验证码', trigger: 'blur'},
            {type: 'string', min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur'}
          ]
        },
        agreement: false, // 阅读协议
        contractInfo: '',
        contractId: '',
        sendCode: false,
        timeOut: 60,
        model: false
      }
    },
    mounted() {
      let _this = this;
      document.onkeydown = function (e) {
        if (e.keyCode == 13) {
          _this.handleSubmit('form');
        }
      }
    },
    created() {
      this.getContract();
    },
    methods: {
      ok() {
        this.agreement = true;
      },
      getContract() {
        this.$http.post(api.REGISTER,
          JSON.stringify(this.getParam('contract')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.contractId = response.data.id;
              this.contractInfo = response.data.content;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getCode(){
        if (!this.form.account) {
          this.$Message.error('请填写正确的手机号');
          return false;
        } else {
          this.$http.post(api.LOGIN + 'sendSmsCodeByMerchant',
            JSON.stringify(this.getParam('code')))
            .then(res => {
              // console.log(res);
              let response = res.body;
              if (response.code === 0) {
                this.sendCode = true;
                this.setTimeOut();
                this.$Message.success('验证码已发送');
              }else{
                  this.$Message.error('验证码发送失败')
              }
            })
            .catch(err => {
              console.log(err);
            })
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      handleSubmit(name) {
        if (this.agreement) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.$http.post(api.MERCHANT + 'platformRegisterMerchant',
                JSON.stringify(this.getParam('register')))
                .then(res => {
                  let response = res.body;
                  if (response.code === 0) {
                    this.$Message.success('注册成功');
                    this.$router.go(-1);
                  } else {
                    this.$Message.error(response.showMsg);
                  }
                })
                .catch(err => {
                  console.log(err);
                })
            } else {
              this.$Message.error('表单验证失败!');
            }
          })
        } else {
          this.$Message.error('请阅读用户协议');
        }
      },
      handleChange(value) {
        this.agreement = value;
      },
      setTimeOut () {
        let timer = setTimeout(() => {
          this.setTimeOut();
          if (this.timeOut > 0) {
            this.timeOut--
          }
        }, 1000);
        if (this.timeOut <= 0) {
          this.sendCode = false;
          this.timeOut = 60;
          clearTimeout(timer)
        }
      },
      getParam(name) {
        if (name === 'code') {
          return {
            reqId: 1,
            param: {
              phone: this.form.account,
              type: 1,
              childType: 18
            }
          }
        } else if (name === 'register') {
          return {
            param: {
              mobile: this.form.account,
              verificationCode: this.form.code,
              password: this.form.password,
              contractId: this.contractId
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .register {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background: url(../../assets/image/login_bg.png) no-repeat;
    background-size: 100% 100%;
  }

  .register-panel {
    position: fixed;
    margin: -228px 0 0 -440px;
    left: 50%;
    top: 50%;
    z-index: 10;
    width: 880px;
    height: 456px;
    border-radius: 2px;
    background-color: #ffffff;
    .left {
      float: left;
      padding-top: 100px;
      width: 320px;
      height: 456px;
      background: url(../../assets/image/login_bg_red.png) no-repeat;
      img {
        display: block;
        margin: 0 auto 10px;
      }
      .logo-desc {
        margin-bottom: 100px;
        font-size: 24px;
        text-align: center;
        color: #fff;
      }
      .phone-desc {
        font-size: 20px;
        text-align: center;
        color: #fff;
      }
    }
    .right {
      float: right;
      padding: 24px 40px;
      width: 560px;
      height: 456px;
      .top-btn {
        margin-bottom: 60px;
        position: relative;
        .title {
          text-align: center;
          line-height: 28px;
          font-weight: normal;
          font-size: 20px;
        }
        .back {
          position: absolute;
          left: 0;
          top: 4px;
          color: #1f2d3d;
          font-size: 14px;
        }
      }
      .form {
        margin-bottom: 44px;
        .phone, .pwd, .code {
          input {
            padding: 0;
            height: 38px;
            border: none;
            border-radius: 0;
            border-bottom: 1px solid #e5e9f2;
            padding-left: 20px;
            font-size: 22px;
            &:focus {
              box-shadow: none;
              border-bottom: 1px solid #ff4949;
            }
          }
        }
        .ivu-form-item {
          margin-bottom: 50px;
          &:last-child {
            margin-bottom: 0;
          }
          .ivu-form-item-content {
            position: relative;
            .icon {
              display: block;
              position: absolute;
              right: 0;
              top: 7px;
              width: 24px;
              height: 24px;
              z-index: 10;
              cursor: pointer;
              background: url(../../assets/image/pwd.png) no-repeat;
              &.active {
                background: url(../../assets/image/pwd_d.png) no-repeat;
              }
            }
            .get-code {
              display: block;
              position: absolute;
              right: 0;
              top: -7px;
              width: 88px;
              height: 36px;
              border-radius: 2px;
              border: solid 1px #ff4949;
              outline: none;
              background: transparent;
              color: #ff4949;
              font-size: 14px;
              z-index: 10;
              cursor: pointer;
              &:hover {
                opacity: .9;
              }
            }
          }
        }
      }
      .foot-btn {
        .agreement {
          display: block;
          float: left;
        }
        .submit, .forget {
          display: block;
          float: right;
        }
        .agreement {
          display: block;
          width: 200px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          font-size: 14px;
          color: #1f2d3d;
          a {
            color: #ff4949;
          }
        }
        .forget {
          display: block;
          width: 80px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          font-size: 16px;
          color: #1f2d3d;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            color: #ff4949;
          }
        }
        .submit {
          margin-left: 20px;
          width: 144px;
          height: 36px;
          border-radius: 2px;
          background-color: #ff4949;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            opacity: .9;
          }
        }
      }
    }
  }
</style>
