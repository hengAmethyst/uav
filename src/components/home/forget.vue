<template>
  <div class="login">
    <div class="login-panel clearfix">
      <div class="left">
        <img src="../../assets/image/logo_b.png" width="136" height="136">
        <p class="logo-desc">晶蝶云平台</p>
        <p class="phone-desc">免费服务热线：400-685-8188</p>
      </div>
      <div class="right">
        <h2 class="title">
          <i class="return" @click="$router.go(-1)">
            <Icon type="ios-arrow-left"></Icon>
          </i>
          找回密码
        </h2>

        <Steps :current="currentStep">
          <Step :title="step1 === 0?'进行中':'已完成'" :status="step1 === 0?'process':'finish'"></Step>
          <Step :title="step2 === 0?'未进行':'进行中'" :status="step2 === 0?'wait':'process'"></Step>
        </Steps>

        <Form class="form" ref="formForget" :model="formForget" :rules="ruleForget" v-if="step1 === 0">
          <Form-item prop="account">
            <Input type="text" class="phone" v-model="formForget.account" placeholder="请输入手机号">
            </Input>
            <button class="get-code" @click="getCode" v-if="!sendCode">获取验证码</button>
            <button class="get-code" v-else>{{timeOut}}S</button>
          </Form-item>
          <Form-item prop="code">
            <Input type="text" class="code" v-model="formForget.code" placeholder="请输入验证码">
            </Input>
          </Form-item>
        </Form>

        <Form class="form" ref="formNewPwd" :model="formNewPwd" :rules="ruleNewPwd" v-else>
          <Form-item prop="pwd">
            <Input type="text" class="pwd" v-model="formNewPwd.pwd" placeholder="请输入新密码">
            </Input>
          </Form-item>
          <Form-item prop="confirm">
            <Input type="text" class="pwd" v-model="formNewPwd.confirm" placeholder="确认新密码">
            </Input>
          </Form-item>
        </Form>

        <div class="foot-btn clearfix">
          <button class="submit" @click="nextStep('formForget')" v-if="step1 === 0">下一步</button>
          <button class="submit" @click="handleSubmit('formNewPwd')" v-else>登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../vuex/api'

  export default {
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formNewPwd.confirm !== '') {
            // 对第二个密码框单独验证
            this.$refs.formNewPwd.validateField('confirm');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formNewPwd.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        formForget: {
          account: '',
          code: ''
        },
        formNewPwd: {
          pwd: '',
          confirm: ''
        },
        ruleForget: {
          account: [
            {required: true, message: '请填写手机号', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请填写验证码', trigger: 'blur'},
            {type: 'string', min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur'}
          ]
        },

        ruleNewPwd: {
          pwd: [
            {validator: validatePass, trigger: 'blur'}
          ],
          confirm: [
            {validator: validatePassCheck, trigger: 'blur'}
          ]
        },
        currentStep: 0,
        step1: 0,
        step2: 0,
        stepTitle: '',
        lookPwd: false,
        sendCode: false,
        timeOut: 60,
      }
    },
    methods: {
      getCode(){
        if (!this.formForget.account) {
          this.$Message.error('请填写正确的手机号');
          return false;
        } else {
          this.$http.post(api.LOGIN + 'sendSmsCodeByMerchant',
            JSON.stringify(this.getParam('code')))
            .then(res => {
              console.log(res);
              let response = res.body;
              if (response.code === 0) {
                this.sendCode = true;
                this.setTimeOut();
                this.$Message.success('验证码已发送');
              }
            })
            .catch(err => {
              console.log(err);
            })
        }
      },
      nextStep(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.LOGIN + 'resetPwd',
              JSON.stringify(this.getParam('check')))
              .then(res => {
                console.log(res);
                let response = res.body;
                if (response.code === 0) {
                  this.currentStep += 1;
                  this.step1 = 1;
                  this.step2 = 1;
                }
              })
              .catch(err => {
                console.log(err);
              })
          }
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.LOGIN + 'updatePwd',
              JSON.stringify(this.getParam('update')))
              .then(res => {
                let response = res.body;
                console.log(response);
                if (response.code === 0) {
                  this.$Message.success('修改成功');
                  setTimeout(() => {
                    this.$router.replace('/login');
                  }, 1000);
                }
              })
              .catch(err => {
                console.log(err);
              })
          } else {
            this.$Message.error('请填写正确的密码!');
          }
        })
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
              phone: this.formForget.account,
              type: 1,
              childType: 18
            }
          }
        } else if (name === 'check') {
          return {
            param: {
              account: this.formForget.account,
              smsCode: this.formForget.code
            }
          }
        } else if (name === 'update') {
          return {
            param: {
              account: this.formForget.account,
              smsCode: this.formForget.code,
              newPwd: this.formNewPwd.pwd
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .login {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background: url(../../assets/image/login_bg.png) no-repeat;
    background-size: 100% 100%;
  }

  .login-panel {
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
      .title {
        position: relative;
        margin-bottom: 50px;
        text-align: center;
        line-height: 28px;
        .return {
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: 28px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
        }
      }
      .ivu-steps {
        margin-bottom: 35px;
        padding-left: 140px;
        .ivu-steps-item {
          .ivu-steps-main {
            display: block;
            margin-left: -7px;
          }
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
        .checkbox {
          display: block;
          float: left;
        }
        .submit, .forget {
          display: block;
          float: right;
        }
        .checkbox {
          display: block;
          width: 80px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          font-size: 14px;
          color: #ff4949;
        }
        .forget {
          display: block;
          width: 80px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          font-size: 16px;
          color: #ff4949;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
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
