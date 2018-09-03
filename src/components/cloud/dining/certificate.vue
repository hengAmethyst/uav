<template>
  <div class="payment-wrapper">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <h2 class="title">商户证照信息</h2>
      <Row>
        <Col :md="24" :lg="16">
        <Form-item label="营业执照状态" prop="licenseStatus">
          <RadioGroup v-model="formValidate.licenseStatus">
            <Radio label="正常"></Radio>
            <Radio label="办理中"></Radio>
          </RadioGroup>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16" v-if="formValidate.licenseStatus === '正常'">
        <Form-item label="营业执照类型" prop="licenseType">
          <RadioGroup v-model="formValidate.licenseType" @on-change="changeLicenseType">
            <Radio label="营业执照"></Radio>
            <Radio label="三证合一"></Radio>
          </RadioGroup>
          <Checkbox v-model="formValidate.licenseOneCode" v-if="formValidate.licenseType === '三证合一'"
                    @on-change="handleLicenseOneCode">一证一码
          </Checkbox>
        </Form-item>
        </Col>
      </Row>
      <Row v-if="formValidate.licenseStatus === '正常'">
        <Col :md="24" :lg="16" v-if="!formValidate.licenseOneCode">
        <Form-item label="注册号" prop="registCode">
          <Input v-model="formValidate.registCode" placeholder="请输入注册号"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16" v-if="!formValidate.licenseOneCode">
        <Form-item label="组织机构代码" prop="organizationCode">
          <Input v-model="formValidate.organizationCode" placeholder="请输入组织机构代码"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="名称" prop="storeName">
          <Input v-model="formValidate.storeName" placeholder="请输入名称"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="住所" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入住所"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16" v-if="formValidate.licenseType === '三证合一' && formValidate.licenseOneCode">
        <Form-item label="统一社会信用代码" prop="creditCode">
          <Input v-model="formValidate.creditCode" placeholder="请输入统一社会信用代码"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="营业期限">
          <Row>
            <Col span="18" v-if="!longTime">
            <Form-item prop="licenseEndDate">
              <DatePicker type="date" placeholder="选择日期" format="yyyy-MM-dd" :value="formValidate.licenseEndDate"
                          @on-change="handleTimeLimit" style="width:100%;"></DatePicker>
            </Form-item>
            </Col>
            <Col span="2">
            <span>&nbsp;</span>
            </Col>
            <Col span="4">
            <Form-item>
              <Checkbox v-model="longTime" @on-change="handleLongTime">长期</Checkbox>
            </Form-item>
            </Col>
          </Row>
        </Form-item>
        </Col>
      </Row>
      <Row v-if="formValidate.licenseStatus === '正常'">
        <Col :md="24" :lg="16">
        <Form-item label="营业执照" prop="businessLicense">
          <Input type="text" v-model="formValidate.businessLicense" style="display:none"></Input>
          <div v-if="formValidate.businessLicense" class="payment-upload">
            <img class="img" :src="formValidate.businessLicense" width="320" height="240">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.businessLicense)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('businessLicense')"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="businessLicense"
                  :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize" :action="resourceUrl">
            <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
              <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16" v-if="formValidate.licenseType === '营业执照'">
        <Form-item label="组织机构代码证" prop="organizationLicense">
          <Input type="text" v-model="formValidate.organizationLicense" style="display:none"></Input>
          <div v-if="formValidate.organizationLicense" class="payment-upload">
            <img class="img" :src="formValidate.organizationLicense" width="320" height="240">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.organizationLicense)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('organizationLicense')"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="organizationLicense"
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
      <Row>
        <Col :md="24" :lg="16">
        <Form-item label="餐饮许可证状态" prop="cateringServiceLicenseStatus">
          <RadioGroup v-model="formValidate.cateringServiceLicenseStatus">
            <Radio label="正常"></Radio>
            <Radio label="办理中"></Radio>
          </RadioGroup>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col :md="24" :lg="16" v-if="formValidate.cateringServiceLicenseStatus === '正常'">
        <Form-item label="餐饮许可证" prop="cateringServiceLicense">
          <Input type="text" v-model="formValidate.cateringServiceLicense" style="display:none"></Input>
          <div v-if="formValidate.cateringServiceLicense" class="payment-upload">
            <img class="img" :src="formValidate.cateringServiceLicense" width="320" height="240">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.cateringServiceLicense)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('cateringServiceLicense')"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false"
                  :on-success="cateringServiceLicense" :format="['jpg','jpeg','png']" :max-size="5120"
                  :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="resourceUrl">
            <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
              <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </Form-item>
        </Col>
      </Row>

      <!-- 法人信息代表 -->

      <h2 class="title">法人代表信息</h2>
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
          <DatePicker type="date" placeholder="开始日期" format="yyyy-MM-dd" :value="formValidate.idCardStartTime"
                      @on-change="handleStartTime" style="width: 100%;"></DatePicker>
        </Form-item>
        </Col>
        <Col :md="12" :lg="8">
        <Form-item prop="idCardEndTime" :label-width="20">
          <DatePicker type="date" placeholder="到期日期" format="yyyy-MM-dd" :value="formValidate.idCardEndTime"
                      @on-change="handleEndTime" style="width: 100%;"></DatePicker>
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
        <Col s:md="24" :lg="16">
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
      <Form-item class="btn-group">
        <button type="ghost" @click="handleReset" class="reset">上一步</Button>
        <button type="primary" @click="submit('formValidate')" class="submit">下一步</Button>
      </Form-item>
    </Form>

    <Modal title="查看图片" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
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
      };

      return {
        longTime: false,
        formValidate: {
          licenseStatus: '正常',
          licenseType: '营业执照',
          licenseOneCode: false,
          registCode: '',
          organizationCode: '',
          storeName: '',
          address: '',
          creditCode: '',
          licenseEndDate: '',
          businessLicense: '',
          organizationLicense: '',
          cateringServiceLicenseStatus: '正常',
          cateringServiceLicense: '',
          name: '',
          idCard: '',
          mobile: '',
          idCardStartTime: '',
          idCardEndTime: '',
          idCardFront: '',
          idCardBack: ''
        },
        ruleValidate: {
          licenseStatus: [
            {required: true, trigger: 'change'}
          ],
          licenseType: [
            {required: true, trigger: 'change'}
          ],
          registCode: [
            {required: true, message: '请填写注册码', trigger: 'blur'}
          ],
          organizationCode: [
            {required: true, message: '请填写组织机构代码', trigger: 'blur'}
          ],
          storeName: [
            {required: true, message: '请填写执照名称', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请填写住所', trigger: 'blur'}
          ],
          licenseEndDate: [
            {message: '请选择期限', trigger: 'change', type: 'string'}
          ],
          businessLicense: [
            {required: true, message: '请上传营业执照图片'}
          ],
          organizationLicense: [
            {required: true, message: '请上传组织机构代码证图片'}
          ],
          cateringServiceLicenseStatus: [
            {required: true, trigger: 'change'}
          ],
          cateringServiceLicense: [
            {required: true, message: '请上传餐饮许可证图片'}
          ],
          name: [
            {required: true, message: '请填写法人姓名', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请填写法人身份证', trigger: 'blur'}
          ],
          idCardStartTime: [
            {required: true, trigger: 'change', message: '请选择开始时间'}
          ],
          idCardEndTime: [
            {required: true, trigger: 'change', message: '请选择结束时间'},
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
          ]
        },
        resourceUrl: api.RESOURCE,
        imgName: '',
        visible: false,
      }
    },
    created() {
      if (this.info) {
        this.requireInfo(this.info);
      }
    },
    methods: {
      handleReset() {
        this.$emit('prevstep', 'prev')
      },
      handleLongTime(value) {
        if (value) {
          this.formValidate.licenseEndDate = '9999-12-31';
        } else {
          this.formValidate.licenseEndDate = "";
        }
      },
      changeLicenseType(value) {
        if (value === '营业执照') {
          this.formValidate.licenseOneCode = false;
        }
      },
      handleLicenseOneCode(value) {
        // console.log(value)
      },
      handleTimeLimit(value) {
        this.formValidate.licenseEndDate = value;
      },
      handleIdCardTimeLimit(value) {
        // console.log(value);
      },
      handleStartTime(time) {
        this.formValidate.idCardStartTime = time;
      },
      handleEndTime(time) {
        this.formValidate.idCardEndTime = time;
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
                  if (this.formValidate.licenseStatus === "办理中" || this.formValidate.cateringServiceLicenseStatus === "办理中") {
                    sessionStorage.licenseStatus = "false";
                  }else{
                    sessionStorage.licenseStatus = "true";
                  }
                  this.$Message.success('商户证照提交成功');
                  this.$emit('nextstep', 'finish');
                } else {
                  this.$Message.error('商户证照提交失败');
                }
              })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      businessLicense(res, file) {
        if (res.code === 0) {
          this.formValidate.businessLicense = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
      },
      organizationLicense(res, file) {
        if (res.code === 0) {
          this.formValidate.organizationLicense = res.data.fullFilename
        } else {
          this.$Message.error('上传失败')
        }
      },
      cateringServiceLicense(res, file) {
        if (res.code === 0) {
          this.formValidate.cateringServiceLicense = res.data.fullFilename
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
      getBusinessLicenseType() {
        if (this.formValidate.licenseType === '营业执照') {
          return 1
        } else {
          if (this.formValidate.licenseOneCode) {
            return 3
          }
          return 2
        }
      },
      requireInfo(data) {
        this.formValidate.licenseStatus = data.businessLicenseStatus === 0 ? '正常' : '办理中';
        if (data.businessLicenseType === 1) {
          this.formValidate.licenseType = '营业执照'
        } else if (data.businessLicenseType === 2) {
          this.formValidate.licenseType = '三证合一'
        } else if (data.businessLicenseType === 3) {
          this.formValidate.licenseType = '三证合一';
          this.formValidate.licenseOneCode = true;
        }
        if (data.registerCode) {
          this.formValidate.registCode = data.registerCode;
        }
        if (data.organizationalStructureCode) {
          this.formValidate.organizationCode = data.organizationalStructureCode;
        }
        if (data.socialCreditCode) {
          this.formValidate.creditCode = data.socialCreditCode;
        }
        this.formValidate.storeName = data.licenseName;
        this.formValidate.address = data.licenseAddress;
        this.formValidate.licenseEndDate = data.licenseEndTime;
        if (data.licenseEndTime === '9999-12-31') {
          this.longTime = true;
        }
        this.formValidate.businessLicense = data.licensePicture;
        this.formValidate.organizationLicense = data.organizationalStructurePicture;
        this.formValidate.cateringServiceLicenseStatus = data.restaurantPermitLicenseStatus === 0 ? '正常' : '办理中';
        this.formValidate.cateringServiceLicense = data.restaurantPermitLicensePicture;
        this.formValidate.name = data.legalRepresentativeName;
        this.formValidate.idCard = data.legalRepresentativeIdcard;
        this.formValidate.idCardStartTime = data.legalRepresentativeBeginDate;
        this.formValidate.idCardEndTime = data.legalRepresentativeExpirationDate;
        this.formValidate.mobile = data.legalRepresentativeMobile;
        this.formValidate.idCardFront = data.legalRepresentativeIdcardPictureFront;
        this.formValidate.idCardBack = data.legalRepresentativeIdcardPictureBack;
      },
      getParam(name) {
        if (name === 'submit') {
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
              businessLicenseStatus: this.formValidate.licenseStatus === '正常' ? 0 : 1,
              businessLicenseType: this.getBusinessLicenseType(),
              registerCode: !this.formValidate.licenseOneCode ? this.formValidate.registCode : '',
              organizationalStructureCode: !this.formValidate.licenseOneCode ? this.formValidate.organizationCode : '',
              socialCreditCode: this.formValidate.licenseOneCode ? this.formValidate.creditCode : '',
              licenseName: this.formValidate.storeName,
              licenseAddress: this.formValidate.address,
              licenseEndTime: this.formValidate.licenseEndDate,
              licensePicture: this.formValidate.businessLicense,
              organizationalStructurePicture: this.formValidate.organizationLicense,
              restaurantPermitLicenseStatus: this.formValidate.cateringServiceLicenseStatus === '正常' ? 0 : 1,
              restaurantPermitLicensePicture: this.formValidate.cateringServiceLicense,
              legalRepresentativeName: this.formValidate.name,
              legalRepresentativeIdcard: this.formValidate.idCard,
              legalRepresentativeBeginDate: this.formValidate.idCardStartTime,
              legalRepresentativeExpirationDate: this.formValidate.idCardEndTime,
              legalRepresentativeMobile: this.formValidate.mobile,
              legalRepresentativeIdcardPictureFront: this.formValidate.idCardFront,
              legalRepresentativeIdcardPictureBack: this.formValidate.idCardBack,
              step: 2
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
