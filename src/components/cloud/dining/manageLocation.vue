<template>
  <div class="payment-wrapper">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <h2 class="title">经营场所图片</h2>
      <Row>
        <Col :md="24" :lg="16">
        <Form-item label="商户招牌" prop="face">
          <Input type="text" v-model="formValidate.face" style="display:none"></Input>
          <div v-if="formValidate.face" class="payment-upload">
            <img class="img" :src="formValidate.face" width="320" height="240">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.face)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('face')"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="face" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="resourceUrl">
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
        <Form-item label="商户内景1" prop="storePic1">
          <Input type="text" v-model="formValidate.storePic1" style="display:none"></Input>
          <div v-if="formValidate.storePic1" class="payment-upload">
            <img class="img" :src="formValidate.storePic1" width="320" height="240">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.storePic1)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('storePic1')"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="storePic1" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="resourceUrl">
            <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
              <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="商户内景2" prop="storePic2">
          <Input type="text" v-model="formValidate.storePic2" style="display:none"></Input>
          <div v-if="formValidate.storePic2" class="payment-upload">
            <img class="img" :src="formValidate.storePic2" width="320" height="240">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.storePic2)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('storePic2')"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="storePic2" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="resourceUrl">
            <div style="width: 320px;height: 240px;margin:0 auto;padding-top: 50px;">
              <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="商户内景3" prop="storePic3">
          <Input type="text" v-model="formValidate.storePic3" style="display:none"></Input>
          <div v-if="formValidate.storePic3" class="payment-upload">
            <img class="img" :src="formValidate.storePic3" width="320" height="240">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.storePic3)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove('storePic3')"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 320px;" type="drag" :show-upload-list="false" :on-success="storePic3" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="resourceUrl">
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
        <button type="primary" @click="submit('formValidate')" class="submit">完成</Button>
      </Form-item>

      <Modal title="查看图片" v-model="visible">
        <img :src="imgName" v-if="visible" style="width: 100%">
      </Modal>
    </Form>
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
      formValidate: {
        face: '',
        storePic1: '',
        storePic2: '',
        storePic3: ''
      },
      ruleValidate: {
        face: [
          { required: true, message: '请上传商户招牌图片', trigger: 'blur' }
        ],
        storePic1: [
          { required: true, message: '请上传商户内景图片', trigger: 'blur' }
        ],
        storePic2: [
          { required: true, message: '请上传商户内景图片', trigger: 'blur' }
        ],
        storePic3: [
          { required: true, message: '请上传商户内景图片', trigger: 'blur' }
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
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(api.PAYMENT_MERCHANT + 'quickpayment/commit',
            JSON.stringify(this.getParam('submit')))
            .then(res => {
              // console.log(res)
              let response = res.body;
              if (response.code === 0) {
                this.$Message.success('办理成功');
                this.$emit('nextstep', 'finish');
              } else {
                this.$Message.error('经营场所图片提交失败');
              }
            })
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    face(res, file) {
      if (res.code === 0) {
        this.formValidate.face = res.data.fullFilename
      } else {
        this.$Message.error('上传失败')
      }
    },
    storePic1(res, file) {
      if (res.code === 0) {
        this.formValidate.storePic1 = res.data.fullFilename
      } else {
        this.$Message.error('上传失败')
      }
    },
    storePic2(res, file) {
      if (res.code === 0) {
        this.formValidate.storePic2 = res.data.fullFilename
      } else {
        this.$Message.error('上传失败')
      }
    },
    storePic3(res, file) {
      if (res.code === 0) {
        this.formValidate.storePic3 = res.data.fullFilename
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
      this.formValidate.face = data.merchantRecruitPicture;
      this.formValidate.storePic1 = data.merchantInteriorPicture1;
      this.formValidate.storePic2 = data.merchantInteriorPicture2;
      this.formValidate.storePic3 = data.merchantInteriorPicture3;
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
            merchantRecruitPicture: this.formValidate.face,
            merchantInteriorPicture1: this.formValidate.storePic1,
            merchantInteriorPicture2: this.formValidate.storePic2,
            merchantInteriorPicture3: this.formValidate.storePic3,
            step: 4
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
      color: #fff;
      border:none;
      outline: none;
      &:hover {
        opacity: .9;
      }
    }
  }
}
</style>
