<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
    <FormItem label="品牌名称" prop="name">
      <Input v-model="formValidate.name" placeholder="请输入品牌名称" style="width:360px;"></Input>
    </FormItem>
    <Form-item label="品牌LOGO">
      <div v-if="formValidate.brandLogo" class="brand-upload">
        <img class="img" :src="formValidate.brandLogo" width="180" height="180">
        <div class="store-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(formValidate.brandLogo)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
        </div>
      </div>

      <Upload v-else style="width: 180px;" type="drag" :show-upload-list="false" :on-success="brand" :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="resourceUrl">
        <div style="width: 180px;height: 180px;margin:0 auto;padding-top: 50px;">
          <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
          <p>点击或将文件拖拽到这里上传</p>
        </div>
      </Upload>
    </Form-item>
    <Form-item class="btn-group">
      <!--<Button type="ghost" @click="cancel" class="reset">取消</Button>-->
      <Button type="primary" @click="submit('formValidate')" class="submit">提交</Button>
    </Form-item>

    <Modal title="查看图片" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </Form>
</template>

<script type="text/ecmascript-6">
import * as api from '../../../vuex/api';

export default {
  data() {
    return {
      formValidate: {
        name: '',
        brandLogo: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '品牌名称不能为空', trigger: 'blur' }
        ]
      },
      brandPhoto: {
        typeCode: 11,
        name: '',
        pictureFilePath: '',
        picUrl: ''
      },
      brandId: '',
      resourceUrl: api.RESOURCE,
      imgName: '',
      visible: false,
    }
  },
  created() {
    this.getBrandInfo();
  },
  methods: {
    brand(res, file) {
      if (res.code === 0) {
        this.brandPhoto.name = res.data.filename;
        this.brandPhoto.pictureFilePath = res.data.fullFilename;
        this.brandPhoto.picUrl = res.data.serverFilename;
        this.formValidate.brandLogo = res.data.fullFilename;
      } else {
        this.$Message.error('网络异常，请重新上传')
      }
    },
    getBrandInfo() {
      this.$http.post(api.MERCHANT + 'getBrandInfo',
        JSON.stringify(this.getParam('brand')))
        .then(res => {
          // console.log(res)
          let response = res.body;
          if (response.code === 0) {
            if (response.data) {
              this.formValidate.brandLogo = response.data.brandLogo;
              this.formValidate.name = response.data.brandName;
              this.brandId = response.data.id;
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancel() {

    },
    submit(name) {
       this.$refs[name].validate((val) => {
         if (val) {
           this.$http.post(api.MERCHANT + 'saveBrandInfo',
             JSON.stringify(this.getParam('save')))
             .then(res => {
               console.log(res)
               let response = res.body;
               if (response.code === 0) {
                 this.$Message.success('保存成功')
               } else {
                 this.$Message.error(response.msg);
               }
             })
             .catch(err => {
               console.log(err)
             })
         } else {
           this.$Message.error('表单验证失败!')
         }
       })
//      this.$http.post(api.MERCHANT + 'saveBrandInfo',
//        JSON.stringify(this.getParam('save')))
//        .then(res => {
//          // console.log(res)
//          let response = res.body;
//          if (response.code === 0) {
//            this.$Message.success('保存成功')
//          } else {
//            this.$Message.error('保存失败')
//          }
//        })
//        .catch(err => {
//          console.log(err)
//        })
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove() {
      this.formValidate.brandLogo = '';
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
    getParam(name) {
      if (name === 'save') {
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
            id: this.brandId,
            brandName: this.formValidate.name,
            brandLogo: this.formValidate.brandLogo,
            picture: this.brandPhoto
          }
        }
      } else if (name === 'brand') {
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
            brandId: JSON.parse(localStorage.getItem('userInfo')).userData.brandId
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.brand-upload {
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
