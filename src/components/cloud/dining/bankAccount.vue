<template>
  <div class="payment-wrapper">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <h2 class="title">账户类型
        <span class="sub">组织性质为“企业法人”，只能选择机构账户；组织性质为“个体工商户”，可以选择机构账户或个人账户。请根据实际情况选择，否则审核无法通过审核。</span>
      </h2>
      <Row>
        <Col :md="24" :lg="16">
        <Form-item label="账户类型选择" prop="accountType">
          <RadioGroup v-model="formValidate.accountType">
            <Radio label="机构账户" :disabled="disabled"></Radio>
            <Radio label="个人账户"></Radio>
          </RadioGroup>
        </Form-item>
        </Col>
      </Row>

      <div class="line"></div>

      <div v-if="formValidate.accountType === '个人账户'">
        <h2 class="title">入账人信息</h2>
        <Row>
          <Col :md="24" :lg="16">
          <Form-item label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
          </Form-item>
          </Col>
          <Col :md="24" :lg="16">
          <Form-item label="身份证号" prop="idCard">
            <Input v-model="formValidate.idCard" placeholder="请输入身份证号"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col :md="12" :lg="8">
          <Form-item label="身份证有效期" prop="idCardStartTime">
            <DatePicker type="date" placeholder="开始日期" :value="formValidate.idCardStartTime" format="yyyy-MM-dd"
                        @on-change="handleStartTime" style="width: 100%"></DatePicker>
          </Form-item>
          </Col>
          <Col :md="12" :lg="8">
          <Form-item prop="idCardEndTime" :label-width="20">
            <DatePicker type="date" placeholder="到期日期" :value="formValidate.idCardEndTime" format="yyyy-MM-dd"
                        @on-change="handleEndTime" style="width: 100%"></DatePicker>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col :md="24" :lg="16">
          <Form-item label="手机号" prop="mobile">
            <Input v-model="formValidate.mobile" placeholder="请输入手机号"></Input>
          </Form-item>
          </Col>
        </Row>

        <Row>
          <Col :md="24" :lg="16">
          <Form-item label="身份证正面" prop="idCardFront">
            <Input type="text" v-model="formValidate.idCardFront" style="display:none"></Input>
            <div v-if="formValidate.idCardFront" class="payment-upload">
              <img class="img" :src="formValidate.idCardFront" width="320" height="240">
              <div class="store-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(formValidate.idCardFront)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove('idCardFront')"></Icon>
              </div>
            </div>

            <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="idCardFront"
                    :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize" :action="resourceUrl">
              <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
                <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </Form-item>
          </Col>
          <Col :md="24" :lg="16">
          <Form-item label="身份证背面" prop="idCardBack">
            <Input type="text" v-model="formValidate.idCardBack" style="display:none"></Input>
            <div v-if="formValidate.idCardBack" class="payment-upload">
              <img class="img" :src="formValidate.idCardBack" width="320" height="240">
              <div class="store-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(formValidate.idCardBack)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove('idCardBack')"></Icon>
              </div>
            </div>

            <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="idCardBack"
                    :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize" :action="resourceUrl">
              <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
                <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </Form-item>
          </Col>
        </Row>
      </div>

      <div>
        <h2 class="title">银行账户信息</h2>
        <Row>
          <Col :md="24" :lg="16">
          <Form-item label="开户银行" prop="bank">
            <Input v-model="formValidate.bank" placeholder="请输入开户行(如：工商银行)"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col :md="7" :lg="5">
          <Form-item label="省" >
            <Input v-model="province" placeholder="省/直辖市"></Input>
          </Form-item>
          </Col>
          <Col :md="7" :lg="5">
          <Form-item label="市" >
            <Input v-model="city" placeholder="市"></Input>
          </Form-item>
          </Col>
          <Col :md="7" :lg="5">
          <Form-item label="关键字" >
            <Input v-model="keyWords" placeholder="请输入关键字"></Input>
          </Form-item>
          </Col>
          <Col :md="3" :lg="1" style="padding-left:20px;">
          <Button @click="searchOpeningBankNo">查询</Button>
          </Col>
        </Row>
        <Row>
          <Col :md="24" :lg="16">
          <Form-item label="开户网点" >
            <Select v-model="branch" placeholder="请选择开户网点" @on-change="selectBranch" :disabled="!branchList.length>0">
              <Option v-for="(item,index) in branchList" :value="item.bankCode" :key="index">{{item.lName}}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col :md="24" :lg="16">
          <Form-item label="联行号" prop="openingBankNo">
            <Input v-model="formValidate.openingBankNo" placeholder="请输入联行号"></Input>
          </Form-item>
          </Col>
          <!-- <Col span="8">
          <Form-item label="开户网点" prop="branch">
            <Input v-model="formValidate.branch" placeholder="请输入开户网点"></Input>
          </Form-item>
          </Col> -->
          <Col :md="24" :lg="16">
          <Form-item label="开户名" prop="branchName">
            <Input v-model="formValidate.branchName" placeholder="请输入开户名"></Input>
          </Form-item>
          </Col>
          <Col :md="24" :lg="16">
          <Form-item label="账号" prop="branchAccount">
            <Input v-model="formValidate.branchAccount" placeholder="请输入账号"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col :md="24" :lg="16" v-if="formValidate.accountType === '个人账户'">
          <Form-item label="银行卡正面" prop="bankCard">
            <Input type="text" v-model="formValidate.bankCard" style="display:none"></Input>
            <div v-if="formValidate.bankCard" class="payment-upload">
              <img class="img" :src="formValidate.bankCard" width="320" height="240">
              <div class="store-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(formValidate.bankCard)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove('bankCard')"></Icon>
              </div>
            </div>

            <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="bankCard"
                    :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize" :action="resourceUrl">
              <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
                <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </Form-item>
          </Col>
          <Col :md="24" :lg="16" v-if="formValidate.accountType === '机构账户'">
          <Form-item label="开户许可证" prop="openAccount">
            <Input type="text" v-model="formValidate.openAccount" style="display:none"></Input>
            <div v-if="formValidate.openAccount" class="payment-upload">
              <img class="img" :src="formValidate.openAccount" width="320" height="240">
              <div class="store-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(formValidate.openAccount)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove('openAccount')"></Icon>
              </div>
            </div>

            <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="openAccount"
                    :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize" :action="resourceUrl">
              <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
                <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
              </div>
            </Upload>
          </Form-item>
          </Col>
        </Row>
      </div>

      <div v-if="formValidate.accountType === '机构账户'">
        <div class="line"></div>
        <h2 class="title">后台联系信息
          <span class="sub">无法接通将导致申请失败。如使用固定电话，请注意输入区号。</span>
        </h2>
        <Row>
          <Col :md="24" :lg="16">
          <Form-item label="客服电话" prop="servicesPhone">
            <Input v-model="formValidate.servicesPhone" placeholder="请输入客户电话"></Input>
          </Form-item>
          </Col>
        </Row>
      </div>

      <Form-item class="btn-group">
        <button type="ghost" @click="handleReset" class="reset">上一步</Button>
        <button type="primary" @click="submit('formValidate')" class="submit">下一步</Button>
      </Form-item>

      <Modal title="查看图片" v-model="visible">
        <img :src="imgName" v-if="visible" style="width: 100%">
      </Modal>
    </Form>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api'
  import {timeToUnix} from '../../../common/tool'

  export default {
    props: {
      info: {
        type: Object
      }
    },
    data() {
      const isGtStartDate = (rule, value, callback) => {
        if (new Date(value).getTime() <= timeToUnix(this.formValidate.idCardStartTime + ':000')) {
          callback(new Error());
        } else {
          callback();
        }
      }
      return {
        formValidate: {
          accountType: '机构账户',
          // 入账人
          name: '',
          idCard: '',
          idCardStartTime: '',
          idCardEndTime: '',
          mobile: '',
          idCardFront: '',
          idCardBack: '',
          bank: '',
          // province: '',
          // city: '',
          // branch: '',
          openingBankNo: '',
          branchName: '',
          branchAccount: '',
          servicesPhone: '',
          openAccount: '',
          bankCard: ''
        },
        ruleValidate: {
          accountType: [
            {required: true, message: '请选择账户类型', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请填写法人姓名', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请填写法人身份证', trigger: 'blur'}
          ],
          idCardStartTime: [
            {required: true, type: 'string', trigger: 'change', message: '请选择开始时间'}
          ],
          idCardEndTime: [
            {required: true, type: 'string', trigger: 'change', message: '请选择结束时间'},
            {trigger: 'change', message: '结束时间要大于开始时间', validator: isGtStartDate}
          ],
          mobile: [
            {required: true, message: '请填写法人手机号', trigger: 'blur'}
          ],
          idCardFront: [
            {required: true, message: '请上传身份证正面图片'}
          ],
          idCardBack: [
            {required: true, message: '请上传身份证背面图片'}
          ],
          bank: [
            {required: true, message: '请填写开户行', trigger: 'blur'}
          ],
          openingBankNo: [
            {required: true, message: '请填写联行号', trigger: 'blur'}
          ],
          servicesPhone: [
            {required: true, message: '请填客服电话', trigger: 'blur'}
          ],
          branchAccount: [
            {required: true, message: '请填写开户账号', trigger: 'blur'}
          ],
          branchName: [
            {required: true, message: '请填写开户名称', trigger: 'blur'}
          ],
          openAccount: [
            {required: true, message: '请上传许可证图片', trigger: 'blur'}
          ],
          bankCard: [
            {required: true, message: '请上传银行卡图片', trigger: 'blur'}
          ]
        },
        resourceUrl: api.RESOURCE,
        bank: '',
        province: '',
        city: '',
        keyWords: '',
        branch: '',
        branchList: [],
        provinceList: [],
        cityList: [],
        bankName: '',
        provinceName: '',
        cityName: '',
        branchName: '',
        imgName: '',
        visible: false,
        disabled: false
      }
    },
    created() {
      if (sessionStorage.licenseStatus === "false") {
        this.disabled = true;
        this.accountType = "个人账户"
      } else {
        this.disabled = false;
      }
      if (this.info) {
        this.requireInfo(this.info)
      }
    },
    mounted() {

    },
    methods: {
      handleReset() {
        this.$emit('prevstep', 'prev')
      },
      handleStartTime(time) {
        this.formValidate.idCardStartTime = time;
      },
      handleEndTime(time) {
        this.formValidate.idCardEndTime = time;
      },
      searchOpeningBankNo() {
        this.$http.post(api.PAYMENT_MERCHANT + 'merchant/bankNo/infos',
          JSON.stringify(this.getParam('bankInfo')))
          .then(res => {
            let response = JSON.parse(res.body.data);
            if (response.code === '10000') {
              this.branchList = response.result.data.record;
            } else if (response.code === '11010') {
              this.$Message.error('商家接口调用异常，请稍后再试')
            } else if (response.code === '10003') {
              this.$Message.error('不存在相应的数据信息')
            } else if (response.code === '10010') {
              this.$Message.error('接口服务过期，请联系客服人员')
            }
          }, res => {
            console.log(res)
          })
      },
      selectBranch(value) {
        this.formValidate.openingBankNo = value;
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.PAYMENT_MERCHANT + 'quickpayment/commit',
              JSON.stringify(this.getParam('submit')))
              .then(res => {
                let response = res.body;
                if (response.code === 0) {
                  this.$Message.success('银行账户信息提交成功');
                  this.$emit('nextstep', 'finish');
                } else {
                  this.$Message.error('银行账户信息提交失败');
                }
              })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      bankCard(res, file) {
        if (res.code === 0) {
          this.formValidate.bankCard = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
      },
      openAccount(res, file) {
        if (res.code === 0) {
          this.formValidate.openAccount = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
      },
      idCardFront(res, file) {
        if (res.code === 0) {
          this.formValidate.idCardFront = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
      },
      idCardBack(res, file) {
        if (res.code === 0) {
          this.formValidate.idCardBack = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
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
        this.formValidate.accountType = data.accountType === 0 ? '机构账户' : '个人账户';
        this.formValidate.name = data.accountHolderName;
        this.formValidate.idCard = data.accountHolderIdcard;
        this.formValidate.idCardStartTime = data.accountHolderBeginDate;
        this.formValidate.idCardEndTime = data.accountHolderExpirationDate;
        this.formValidate.mobile = data.accountHolderMobile;
        this.formValidate.idCardFront = data.accountHolderIdcardPictureFront;
        this.formValidate.idCardBack = data.accountHolderIdcardPictureBack;
        this.formValidate.bank = data.openingBank;
        this.formValidate.openingBankNo = data.openingBankNo;
        this.formValidate.branch = data.openingBankLocation;
        this.formValidate.branchName = data.accountName;
        this.formValidate.branchAccount = data.openingBanckAccount;
        this.formValidate.servicesPhone = data.serviceTelephone;
        this.formValidate.bankCard = data.bankCardPictureFront;
        this.formValidate.openAccount = data.openingBankAccountPicture;
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
              provinceId: this.formValidate.province
            },
            sign: "F540413C4DB26B4D"
          }
        } else if (name === 'branch') {
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
              lbnk_nm: this.bankName
            }
          }
        } else if (name === 'bankInfo') {
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
              bank: this.formValidate.bank,
              province: this.province,
              city: this.city,
              key: this.keyWords
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
              accountType: this.formValidate.accountType === '机构账户' ? 0 : 1,
              // 入账人
              accountHolderName: this.formValidate.name,
              accountHolderIdcard: this.formValidate.idCard,
              accountHolderBeginDate: this.formValidate.idCardStartTime,
              accountHolderExpirationDate: this.formValidate.idCardEndTime,
              accountHolderMobile: this.formValidate.mobile,
              accountHolderIdcardPictureFront: this.formValidate.idCardFront,
              accountHolderIdcardPictureBack: this.formValidate.idCardBack,
              openingBankNo: this.formValidate.openingBankNo,
              openingBank: this.formValidate.bank,
              openingBankLocation: this.formValidate.branch,
              accountName: this.formValidate.branchName,
              openingBanckAccount: this.formValidate.branchAccount,
              serviceTelephone: this.formValidate.servicesPhone,
              openingBankAccountPicture: this.formValidate.openAccount,
              bankCardPictureFront: this.formValidate.bankCard,
              step: 3
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .payment-upload {
    display: inline-block;
    width: 320px;
    height: 240px;
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
      .sub {
        padding-left: 12px;
        font-size: 12px;
        color: #8492a6;
      }
    }

    .desc-p {
      line-height: 2;
    }

    .btn-group {
      margin-top: 20px;
      text-align: center;
      .reset {
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
        margin-left: 12px;
        width: 144px;
        height: 36px;
        border-radius: 2px;
        background-color: #ff4949;
        font-size: 14px;
        border: none;
        outline: none;
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: .9;
        }
      }
    }
  }
</style>
