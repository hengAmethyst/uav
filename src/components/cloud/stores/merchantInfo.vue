<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
    <Row :gutter="80">
      <Col :md="24">
      <Row :gutter="80">
        <Col :md="24" :lg="16">
        <Form-item label="商户名称" prop="merchantName">
          <Input v-model="formValidate.merchantName" placeholder="请输入商户名称"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="固定电话">
          <Input v-model="formValidate.phone" placeholder="请输入固定电话(如:021-88888888)"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col :md="8" :lg="5">
        <Form-item label="地址" prop="province" style="margin-right:5px;">
          <Select v-model="formValidate.province" placeholder="省" @on-change="selectProvince">
            <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </Form-item>
        </Col>
        <Col :md="4" :lg="3">
        <Form-item prop="city" style="margin-right:5px;" class="address-select">
          <Select v-model="formValidate.city" placeholder="市" @on-change="selectCity"
                  :disabled="!formValidate.province">
            <Option v-for="item in cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </Form-item>
        </Col>
        <Col :md="4" :lg="3">
        <Form-item prop="area" style="margin-right:5px;" class="address-select">
          <Select v-model="formValidate.area" placeholder="区/县" :disabled="!formValidate.city">
            <Option v-for="item in areaList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </Form-item>
        </Col>
      </Row>
      <Row :gutter="80">
        <Col :md="24" :lg="16">
        <Form-item label="具体地址" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入具体地址"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row :gutter="80">

        <Col :md="24" :lg="16">
        <Form-item label="负责人姓名" prop="managerName">
          <Input v-model="formValidate.managerName" placeholder="请输入负责人姓名"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="负责人电话" prop="managerMobile">
          <Input v-model="formValidate.managerMobile" placeholder="请输入负责人电话"></Input>
        </Form-item>
        </Col>
      </Row>
      </Col>

      <Col :md="24">
      <Form-item label="商户门头照">
        <div v-if="facePhoto.pictureFilePath" class="store-upload">
          <img class="img" :src="facePhoto.pictureFilePath" width="360" height="204">
          <div class="store-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(facePhoto.pictureFilePath)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemoveOne('facePhoto')"></Icon>
          </div>
        </div>
        <Upload v-else style="width: 360px;" type="drag" :show-upload-list="false" :on-success="face"
                :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize" :action="resourceUrl">
          <div style="width: 360px;height: 204px;margin:0 auto;padding-top: 50px;">
            <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </Form-item>
      </Col>
    </Row>
    <div class="line"></div>
    <div class="closing-content">
      <h2 class="content-title">店铺宣传图
        <span class="sub">说明：用于手机自助点餐的图片, 店铺宣传图片共3张，图片分辨率为750*418，图片大小请控制在5m内。</span>
      </h2>
      <Row :gutter="80">
        <Col span="24">
        <Form-item label="店铺宣传照">
          <div class="store-upload" v-for="item in storePhotoList">
            <template v-if="item.status === 'finished'">
              <img :src="item.response.data.fullFilename">
              <div class="store-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.response.data.fullFilename)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload v-show="storePhotoList.length<3" ref="storePhoto" :show-upload-list="false"
                  :default-file-list="defaultList" :on-success="storePhotos" :format="['jpg','jpeg','png']"
                  :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload" multiple type="drag" :action="resourceUrl"
                  style="display: inline-block;width:360px;">
            <div style="width: 360px; height: 200px; margin: 0px auto; padding-top: 50px;">
              <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </Form-item>
        </Col>
      </Row>
    </div>

    <Form-item class="btn-group" v-if="loading">
      <Button type="ghost" class="reset">取消</Button>
      <Button type="primary" v-if="id" class="submit">保存</Button>
      <Button type="primary" v-else class="submit">新建</Button>
    </Form-item>
    <Form-item class="btn-group" v-else>
      <Button type="ghost" @click="cancel" class="reset">取消</Button>
      <Button type="primary" v-if="id" @click="editSubmit('formValidate')" class="submit">保存</Button>
      <Button type="primary" v-else @click="addSubmit('formValidate')" class="submit">新建</Button>
    </Form-item>
    <Modal title="查看图片" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </Form>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';

  export default {
    props: {
      id: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        formValidate: {
          merchantName: '',
          province: '',
          city: '',
          area: '',
          address: '',
          phone: '',
          managerName: '',
          managerMobile: '',
        },
        ruleValidate: {
          merchantName: [
            {required: true, message: '商户名不能为空', trigger: 'blur'}
          ],
          province: [
            {required: true, type: 'number', message: '请选择省份', trigger: 'change'}
          ],
          city: [
            {required: true, type: 'number', message: '请选择城市', trigger: 'change'}
          ],
          area: [
            {required: true, type: 'number', message: '请选择区/县', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请填写具体地址', trigger: 'blur'}
          ],
          managerName: [
            {required: true, message: '请填写负责人姓名', trigger: 'blur'}
          ],
          managerMobile: [
            {
              required: true,
              message: '请填写负责人手机号',
              pattern: /^1\d{10}$/,
              trigger: 'blur',
              type: 'string',
              min: 11,
              max: 11
            }
          ]
        },
        provinceList: [],
        cityList: [],
        areaList: [],
        resourceUrl: api.RESOURCE,
        // 所有图片的flag
        photos: [],
        facePhoto: {}, // 门头
        defaultList: [],
        imgName: '',
        visible: false,
        storePhotoList: [],
        loading: false
      }
    },
    created() {
      this.getProvince();
      if (this.id) {
        this.getData()
      }
    },
    mounted() {
      // this.storePhotoList = this.$refs.storePhoto.fileList;
    },
    methods: {
      getData() {
        this.$http.post(api.MERCHANT + 'getMerchantInfo',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.requireData(response.data);
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      selectProvince(value) {
        this.formValidate.province = value;
        this.getCity();
      },
      selectCity(value) {
        this.formValidate.city = value;
        this.getArea();
      },
      selectArea(value) {
        this.formValidate.area = value;
      },
      getProvince() {
        this.$http.post(api.PROVINCE,
          JSON.stringify(this.getParam('province')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.provinceList = response.data;
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
              this.formValidate.city = this.cityList[0].id;
            } else {
              this.$Message.error('初始化地址信息失败,请检查网络')
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getArea() {
        this.$http.post(api.AREA,
          JSON.stringify(this.getParam('area')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.areaList = response.data;
              this.formValidate.area = this.areaList[0].id;
            } else {
              this.$Message.error('初始化地址信息失败,请检查网络')
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleReset() {
      },
      cancel() {
        this.$router.go(-1);
      },
      addSubmit(name) {
        this.$refs[name].validate((val) => {
          if (val) {
            this.loading = true;
            this.$http.post(api.MERCHANT + 'platformAddMcnt',
              JSON.stringify(this.getParam('add')))
              .then(res => {
                this.loading = false;
                // console.log(res)
                let response = res.body;
                if (response.code === 0) {
                  this.$Message.success('创建成功');
                  this.$router.go(-1);
                } else {
                  this.$Message.error(response.msg);
                }
              })
              .catch(err => {
                console.log(err);
              })
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      editSubmit(name) {
        this.$refs[name].validate((val) => {
          if (val) {
            this.loading = true;
            this.$http.post(api.MERCHANT + 'platformModifyMcnt',
              JSON.stringify(this.getParam('update')))
              .then(res => {
                this.loading = false;
                let response = res.body;
                if (response.code === 0) {
                  this.$Message.success('更新成功')
                  this.$router.go(-1);
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
      },
      face(res, file) { // 门头照
        console.log(res)
        if (res.code === 0) {
          this.facePhoto = {
            typeCode: 1,
            name: res.data.filename,
            pictureFilePath: res.data.fullFilename,
            picUrl: res.data.serverFilename
          };
        } else {
          this.$Message.error('网络异常，请重新上传')
        }
      },
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove(file) {
        // 从 upload 实例删除数据
        const fileList = this.storePhotoList;
        // if (file.id) {
        //   this.photos.push({
        //     id: file.id,
        //     typeCode: 12,
        //     name: null,
        //     pictureFilePath: null,
        //     picUrl: null
        //   })
        //   console.log(this.photos)
        // }
        this.storePhotoList.splice(fileList.indexOf(file), 1);
      },
      handleRemoveOne() {
        this.facePhoto = {};
        for (let i = 0; i < this.photos.length; i++) {
          if (this.photos[i].typeCode === 1) {
            this.photos.splice(i, 1);
          }
        }
      },
      storePhotos(res, file) {
        console.log(file)
        if (res.code === 0) {
          this.storePhotoList.push(file);
        } else {
          this.$Message.error('网络异常，请重新上传')
        }

      },
      handleBeforeUpload() {
        const check = this.storePhotoList.length < 3;
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传 3 张图片。'
          });
        }
        return check;
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
      requireData(data) {
        this.formValidate.merchantName = data.name;
        this.formValidate.managerName = data.contactPersonName;
        this.formValidate.managerMobile = data.contactPhone;
        this.formValidate.province = data.provinceId;
        this.formValidate.city = data.cityId;
        this.formValidate.area = data.areaId;
        this.formValidate.address = data.address;
        this.formValidate.phone = data.landlinePhone;
        for (let i = 0; i < data.pictureList.length; i++) {
          if (data.pictureList[i].typeCode === 1) {
            this.facePhoto = data.pictureList[i]
          } else {
            this.storePhotoList.push({
              // id: data.pictureList[i].id,
              typeCode: 12,
              status: 'finished',
              response: {
                data: {
                  fullFilename: data.pictureList[i].pictureFilePath,
                  filename: data.pictureList[i].name,
                  serverFilename: data.pictureList[i].picUrl
                }
              }
            });
          }

        }
      },
      getPhotos() {
        this.photos.push(this.facePhoto);
        for (let i = 0; i < this.storePhotoList.length; i++) {
          // if (this.storePhotoList[i].id) {
          //   this.photos.push({
          //     id: this.storePhotoList[i].id,
          //     typeCode: 12,
          //     name: this.storePhotoList[i].response.data.filename,
          //     pictureFilePath: this.storePhotoList[i].response.data.fullFilename,
          //     picUrl: this.storePhotoList[i].response.data.serverFilename
          //   })
          // } else {
          //   this.photos.push({
          //     typeCode: 12,
          //     name: this.storePhotoList[i].response.data.filename,
          //     pictureFilePath: this.storePhotoList[i].response.data.fullFilename,
          //     picUrl: this.storePhotoList[i].response.data.serverFilename
          //   })
          // }
          this.photos.push({
            typeCode: 12,
            name: this.storePhotoList[i].response.data.filename,
            pictureFilePath: this.storePhotoList[i].response.data.fullFilename,
            picUrl: this.storePhotoList[i].response.data.serverFilename
          })
        }
        return this.photos
      },
      getParam(name) {
        if (name === 'update') {
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
              id: this.id, // 商户ID
              name: this.formValidate.merchantName, // 商户名称
              contactPersonName: this.formValidate.managerName, // 负责人姓名
              contactPhone: this.formValidate.managerMobile, // 负责人电话
              provinceId: this.formValidate.province, // 省
              cityId: this.formValidate.city, // 市
              areaId: this.formValidate.area, // 区县
              address: this.formValidate.address, // 具体地址
              landlinePhone: this.formValidate.phone, // 固定电话
              picUrl: this.facePhoto.pictureFilePath, // 门头照完整地址
              pictureList: this.getPhotos(),
              brandId: JSON.parse(localStorage.userInfo).userData.brandId
              // pMerchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId
            }
          }
        } else if (name === 'add') {
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
              name: this.formValidate.merchantName, // 商户名称
              contactPersonName: this.formValidate.managerName, // 负责人姓名
              contactPhone: this.formValidate.managerMobile, // 负责人电话
              provinceId: this.formValidate.province, // 省
              cityId: this.formValidate.city, // 市
              areaId: this.formValidate.area, // 区县
              address: this.formValidate.address, // 具体地址
              landlinePhone: this.formValidate.phone, // 固定电话
              picUrl: this.facePhoto.pictureFilePath, // 门头照完整地址
              pictureList: this.getPhotos(),
              brandId: JSON.parse(localStorage.userInfo).userData.brandId
              // pMerchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId
            }
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
              merchantId: this.id
            }
          }
        } else if (name === 'province') {
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
        } else if (name === 'area') {
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
              cityId: this.formValidate.city
            },
            sign: "F540413C4DB26B4D"
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .store-upload {
    display: inline-block;
    width: 360px;
    height: 200px;
    text-align: center;
    line-height: 200px;
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

  .line {
    margin-bottom: 24px;
    width: 100%;
    height: 2px;
    border: 1px solid #e5e9f2;
  }

  .closing-content {
    padding-bottom: 24px;
    .content-title {
      margin-bottom: 24px;
      position: relative;
      padding-left: 16px;
      height: 25px;
      line-height: 25px;
      color: #1f2d3d;
      &:before {
        display: block;
        position: absolute;
        content: '';
        width: 4px;
        height: 18px;
        background: #ff4949;
        left: 0;
        top: 4px;
      }
      .sub {
        padding-left: 12px;
        font-size: 12px;
        color: #8492a6;
      }
    }
  }

  .img {
    display: block;
  }

  .address-select {
    .ivu-form-item-content {
      margin-left: 0 !important;
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
