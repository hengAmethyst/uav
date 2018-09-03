<template>
  <div class="payment">
    <div class="module-title clearfix">
      <h2 class="title">快捷支付</h2>
    </div>

    <div class="content" style="width: 100%;background-color: #FFFFFF;border: 1px solid #d3dce6;" v-if="loading">
      初始化数据中...
    </div>
    <div class="content" style="width: 100%;background-color: #FFFFFF;border: 1px solid #d3dce6;" v-else>
      <div class="step-wrapper">
        <Steps :current="currentStep">
          <Step title="商户基础信息" :status="status1"></Step>
          <Step title="商户证照信息" :status="status2"></Step>
          <Step title="银行账户信息" :status="status3"></Step>
          <Step title="经营场所图片" :status="status4"></Step>
        </Steps>
      </div>

      <div class="line"></div>

      <div class="check-info" v-if="checking">
        <h2 class="check-title">审核信息</h2>
        <div class="check-wrapper" v-if="checkStatus === 1 || checkStatus === 2">
          <Row>
            <Col span="2">
            <span class="check-label">审核结果:</span>
            </Col>
            <Col span="22">
            <span class="check-result">暂无</span>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <div class="no-detail">审核中...</div>
            </Col>
          </Row>
        </div>
        <div class="check-wrapper" v-else-if="checkStatus === 4">
          <Row class="check-row">
            <Col span="2">
            <span class="check-label">审核结果:</span>
            </Col>
            <Col span="22">
            <span class="check-result">审核通过</span>
            </Col>
          </Row>
          <Row class="check-row">
            <Col span="2">
            <span class="check-label">办理人:</span>
            </Col>
            <Col span="22">
            <span class="check-result">晶汉运营部</span>
            </Col>
          </Row>
          <Row class="check-row">
            <Col span="2">
            <span class="check-label">办理时间:</span>
            </Col>
            <Col span="22">
            <span class="check-result">{{info.updateTime}}</span>
            </Col>
          </Row>
        </div>
        <div class="check-wrapper" v-else-if="checkStatus === 3">
          <Row class="check-row">
            <Col span="2">
            <span class="check-label">审核结果:</span>
            </Col>
            <Col span="22">
            <span class="check-result" style="color: #ff4949;">审核未通过</span>
            </Col>
          </Row>
          <Row class="check-row">
            <Col span="2">
            <span class="check-label">审核意见:</span>
            </Col>
            <Col span="22">
            <span class="check-result">{{info.suggestion}}</span>
            </Col>
          </Row>
          <Row class="check-row">
            <Col span="2">
            <span class="check-label">办理人:</span>
            </Col>
            <Col span="22">
            <span class="check-result">晶汉运营部</span>
            </Col>
          </Row>
          <Row class="check-row">
            <Col span="2">
            <span class="check-label">办理时间:</span>
            </Col>
            <Col span="22">
            <span class="check-result">{{info.updateTime}}</span>
            </Col>
          </Row>

          <button class="re-upload" @click="reUpload">重新提交</button>
        </div>
      </div>

      <div class="step-item" v-else>
        <BaseInfo v-if="currentStep === 0" :info="info" @nextstep="addStep"></BaseInfo>
        <Certificate v-else-if="currentStep === 1" :info="info" @nextstep="addStep" @prevstep="prevStep"></Certificate>
        <BankAccount v-else-if="currentStep === 2" :info="info" @nextstep="addStep" @prevstep="prevStep"></BankAccount>
        <ManageLocation v-else :info="info" @prevstep="prevStep" @nextstep="addStep"></ManageLocation>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';
  import BaseInfo from './baseInfo.vue';
  import Certificate from './certificate.vue';
  import BankAccount from './bankAccount.vue';
  import ManageLocation from './manageLocation.vue';

  export default {
    data() {
      return {
        currentStep: 0,
        info: null,
        loading: true,
        status1: 'process',
        status2: 'wait',
        status3: 'wait',
        status4: 'wait',
        checking: false,
        checkStatus: 1,
      }
    },
    mounted() {
      this.getInfo();
    },
    methods: {
      addStep(value) {
        if (value === 'finish') {
          if (this.currentStep < 3) {
            this.currentStep += 1;
          } else {
            this.getInfo();
          }
        }
      },
      prevStep(value) {
        if (value === 'prev') {
          if (this.currentStep > 0) {

            this.$http.post(api.PAYMENT_MERCHANT + 'quickpayment/query',
              JSON.stringify(this.getParam('query')))
              .then(res => {
                console.log(res)
                let response = res.body;
                if (response.code === 0) {
                  this.info = response.data;
                  this.currentStep -= 1;
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      },
      getInfo() {
        this.$http.post(api.PAYMENT_MERCHANT + 'quickpayment/query',
          JSON.stringify(this.getParam('query')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              if (response.data.status) {
                if (response.data.status === 0) {
                  if (response.data.step === 1) {
                    this.currentStep = 0;
                  } else if (response.data.step === 2) {
                    this.info = response.data;
                    this.currentStep = 1;
                    this.status1 = 'finish';
                    this.status2 = 'process';
                  } else if (response.data.step === 3) {
                    this.info = response.data;
                    this.currentStep = 2;
                    this.status1 = 'finish';
                    this.status2 = 'finish';
                    this.status3 = 'process';
                  } else if (response.data.step === 4) {
                    this.info = response.data;
                    this.currentStep = 3;
                    this.status1 = 'finish';
                    this.status2 = 'finish';
                    this.status3 = 'finish';
                    this.status4 = 'process';
                  } else if (response.data.step === 5) {
                    this.info = response.data;
                    this.status1 = 'finish';
                    this.status2 = 'finish';
                    this.status3 = 'finish';
                    this.status4 = 'finish';
                    this.currentStep = 3;
                  } else {
                    this.info = {}
                  }
                } else if (response.data.status === 1) {
                  this.info = response.data;
                  this.checking = true;
                  this.checkStatus = 1;
                  this.status1 = 'finish';
                  this.status2 = 'finish';
                  this.status3 = 'finish';
                  this.status4 = 'finish';
                } else if (response.data.status === 2) {
                  this.info = response.data;
                  this.checking = true;
                  this.checkStatus = 2;
                  this.status1 = 'finish';
                  this.status2 = 'finish';
                  this.status3 = 'finish';
                  this.status4 = 'finish';
                } else if (response.data.status === 3){
                  this.info = response.data;
                  this.checking = true;
                  this.checkStatus = 3;
                  this.status1 = 'finish';
                  this.status2 = 'finish';
                  this.status3 = 'finish';
                  this.status4 = 'finish';
                }else {
                  this.info = response.data;
                  this.checking = true;
                  this.checkStatus = 4;
                  this.status1 = 'finish';
                  this.status2 = 'finish';
                  this.status3 = 'finish';
                  this.status4 = 'finish';
                }
              } else {
                if (response.data.step === 1) {
                  this.currentStep = 0;
                } else if (response.data.step === 2) {
                  this.info = response.data;
                  this.currentStep = 1;
                  this.status1 = 'finish';
                  this.status2 = 'process';
                } else if (response.data.step === 3) {
                  this.info = response.data;
                  this.currentStep = 2;
                  this.status1 = 'finish';
                  this.status2 = 'finish';
                  this.status3 = 'process';
                } else if (response.data.step === 4) {
                  this.info = response.data;
                  this.currentStep = 3;
                  this.status1 = 'finish';
                  this.status2 = 'finish';
                  this.status3 = 'finish';
                  this.status4 = 'process';
                } else if (response.data.step === 5) {
                  this.info = response.data;
                  this.currentStep = 3;
                  this.status1 = 'finish';
                  this.status2 = 'finish';
                  this.status3 = 'finish';
                  this.status4 = 'finish';
                } else {
                  this.info = {}
                }
              }
              this.loading = false
            }
          })
      },
      reUpload(){
        this.$http.post(api.PAYMENT_MERCHANT + 'quickpayment/commit',
          JSON.stringify(this.getParam('reUpload')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.checking = false;
              this.currentStep = 0;
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      getParam(name) {
        if (name === 'query') {
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
        } else if (name === 'reUpload') {
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
              status: 0,
              step:1
            }
          }
        }
      }
    },
    components: {
      BaseInfo,
      Certificate,
      BankAccount,
      ManageLocation
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .check-info {
    .check-title {
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
    .check-wrapper {
      .check-row {
        margin-bottom: 20px;
        .check-result, .check-label {
          font-size: 14px;
          color: #1f2d3d;
        }
        .check-label {
          padding-left: 20px;
        }
      }
      .no-detail {
        height: 300px;
        line-height: 300px;
        font-size: 26px;
        text-align: center;
        font-weight: 500;
        color: #ff4949;
      }
      .re-upload {
        display: block;
        margin: 200px auto 20px;
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

  .module-title {
    margin: 14px 0;
    .title {
      font-size: 20px;
      width: 200px;
      height: 32px;
      line-height: 32px;
      color: #1f2d3d;
      font-weight: normal;
    }
  }

  .payment {
    .content {
      padding: 24px;
      .line {
        margin-bottom: 24px;
        width: 100%;
        height: 1px;
        background: #e0e6ed;
      }
      .step-wrapper {
        margin: 0 auto;
        padding-top: 24px;
        width: 600px;
        height: 94px;
        .ivu-steps {
          .ivu-steps-main {
            display: block;
            margin-left: -29px;
          }
        }
      }
    }
  }
</style>
