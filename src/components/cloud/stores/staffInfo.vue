<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
    <Row :gutter="80">
      <Col :md="24">
      <div class="closing-content" style="padding:0;">
        <h2 class="content-title">基本信息</h2>
      </div>
      <Row :gutter="80">
        <Col :md="24" :lg="16">
        <Form-item label="工号" prop="code">
          <Input v-model="formValidate.code" placeholder="请输入员工工号"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入员工姓名"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="性别" prop="sex">
          <RadioGroup v-model="formValidate.sex">
            <Radio label="1">男</Radio>
            <Radio label="0">女</Radio>
          </RadioGroup>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="手机号" prop="mobile">
          <Input v-model="formValidate.mobile" placeholder="请输入员工手机号" :maxlength="11" :minlength="11"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="身份证号码" prop="idCard">
          <Input v-model="formValidate.idCard" placeholder="请输入员工身份证" :maxlength="18" :minlength="18"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="住址" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入员工住址"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="紧急联系人" prop="contact">
          <Input v-model="formValidate.contact" placeholder="请输入紧急联系人"></Input>
        </Form-item>
        </Col>
        <Col :md="24" :lg="16">
        <Form-item label="紧急联系人手机" prop="contactPhone">
          <Input v-model="formValidate.contactPhone" placeholder="请输入紧急联系人手机"></Input>
        </Form-item>
        </Col>
      </Row>
      </Col>
      <Col :md="24">
      <Form-item label="上传头像">
        <div v-if="formValidate.headImagePath" class="staff-upload">
          <img class="img" :src="formValidate.headImagePath" width="240" height="240">
          <div class="store-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(formValidate.headImagePath)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
          </div>
        </div>

        <Upload v-else style="width: 240px;" type="drag" :show-upload-list="false" :on-success="face"
                :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize" :action="resourceUrl">
          <div style="width: 240px;height: 240px;margin:0 auto;padding-top: 50px;">
            <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </Form-item>
      </Col>
    </Row>
    <div class="line"></div>
    <div class="closing-content">
      <h2 class="content-title">工作信息
        <span class="sub"></span>
      </h2>
    </div>
    <Row :gutter="80">
      <Col span="24">
      <Row :gutter="80">
        <Col span="16">
        <Form-item label="部门" prop="department">
          <Select v-model="formValidate.department">
            <Option v-for="item in departmentList" :value="item.departmentId" :key="item.departmentId">{{ item.name }}
            </Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="16">
        <Form-item label="岗位" prop="position">
          <Select v-model="formValidate.position">
            <Option v-for="item in positionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="16">
        <Form-item label="角色" prop="role">
          <Select v-model="formValidate.role">
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.name }}</Option>
          </Select>
        </Form-item>
        </Col>
      </Row>
      </Col>
    </Row>

    <Form-item class="btn-group" v-if="loading">
      <Button type="ghost" class="reset">取消</Button>
      <Button type="primary" v-if="staffInfo" class="submit">保存</Button>
      <Button type="primary" v-else class="submit">新建</Button>
    </Form-item>
    <Form-item class="btn-group" v-else>
      <Button type="ghost" @click="cancel" class="reset">取消</Button>
      <Button type="primary" v-if="staffInfo" @click="editSubmit('formValidate')" class="submit">保存</Button>
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
      staffInfo: {
        type: Object
      }
    },
    data() {
      return {
        formValidate: {
          name: '',
          code: '',
          address: '',
          mobile: '',
          idCard: '',
          sex: '',
          contact: '',
          contactPhone: '',
          department: '',
          position: '',
          role: '',
          headImagePath: ''
        },
        ruleValidate: {
          code: [
            {required: true, message: '员工编号不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '商户名不能为空', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请填写具体地址', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请填写身份证号', trigger: 'blur'},
            {min: 18, max: 18, message: '请填写正确的身份证号'}
          ],
          mobile: [
            {required: true, message: '请填写身手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '请填写正确的手机号'}
          ],
          sex: [
            {required: true, message: '请选择性别'}
          ],
          contact: [
            {required: true, message: '请输入紧急联系人', trigger: 'blur'}
          ],
          contactPhone: [
            {required: true, message: '请填写身手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '请填写正确的手机号'}
          ],
          department: [
            {required: true, message: '请选择部门', trigger: 'change', type: 'number'}
          ],
          position: [
            {required: true, message: '请选择岗位', trigger: 'change', type: 'number'}
          ],
          role: [
            {required: true, message: '请选择角色', trigger: 'change', type: 'number'}
          ]
        },
        roleList: JSON.parse(localStorage.roleList),
        departmentList: JSON.parse(localStorage.departmentList),
        positionList: JSON.parse(localStorage.positionList),
        resourceUrl: api.RESOURCE,
        // 所有图片的flag
        photos: [],
        facePhoto: {}, // 员工头像
        imgName: '',
        visible: false,
        loading:false
      }
    },
    created() {
      if (this.staffInfo) {
        this.requireData(this.staffInfo);
      }
    },
    methods: {
      cancel() {
        this.$router.go(-1);
      },
      addSubmit(name) {
        this.$refs[name].validate((val) => {
          if (val) {
            this.loading = true;
            this.$http.post(api.EMPLOYEE + 'createEmployee',
              JSON.stringify(this.getParam('add')))
              .then(res => {
                  // console.log(res)
                  this.loading = false;
                  let response = res.body;
                  if (response.code === 0) {
                    this.$Message.success('创建成功');
                    this.$router.go(-1);
                  } else {
                    this.$Message.error(response.msg);
                  }
                }
              )
              .catch(err => {
                  console.log(err);
                }
              )
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      editSubmit(name) {
        this.$refs[name].validate((val) => {
          if (val) {
            this.loading = true;
            this.$http.post(api.EMPLOYEE + 'updateEmployee',
              JSON.stringify(this.getParam('edit')))
              .then(res => {
                  this.loading = false;
                  // console.log(res)
                  let response = res.body;
                  if (response.code === 0) {
                    this.$Message.success('更新成功');
                    this.$router.go(-1);
                  } else {
                    this.$Message.error(response.msg);
                  }
                }
              )
              .catch(err => {
                  console.log(err)
                }
              )
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      face(res, file) { // 员工照
        if (res.code === 0) {
          this.formValidate.headImagePath = res.data.fullFilename
        } else {
          this.$Message.error('网络异常，请重新上传')
        }
      },
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove() {
        this.formValidate.headImagePath = '';
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
        this.formValidate.code = data.employeeNo;
        this.formValidate.name = data.userName;
        this.formValidate.sex = data.sex;
        this.formValidate.mobile = data.mobile;
        this.formValidate.idCard = data.idNumber;
        this.formValidate.address = data.contactAddress;
        this.formValidate.headImagePath = data.headImagePath;
        this.formValidate.department = data.departmentId;
        this.formValidate.position = data.positionId;
        this.formValidate.role = data.roleId;
        this.formValidate.contact = data.urgentName;
        this.formValidate.contactPhone = data.urgentPhone;
      },
      getPhotos() {
        this.photos = [];
        this.photos.push(this.facePhoto);
        for (let i = 0; i < this.storePhotoList.length; i++) {
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
        if (name === 'edit') {
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
              id: this.staffInfo.id,
              merchantId: localStorage.currentMerchantId,
              employeeNo: this.formValidate.code,
              userName: this.formValidate.name,
              sex: this.formValidate.sex,
              mobile: this.formValidate.mobile,
              idNumber: this.formValidate.idCard,
              contactAddress: this.formValidate.address,
              headImagePath: this.formValidate.headImagePath,
              departmentId: this.formValidate.department,
              positionId: this.formValidate.position,
              roleId: this.formValidate.role,
              urgentName: this.formValidate.contact,
              urgentPhone: this.formValidate.contactPhone
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
              merchantId: localStorage.currentMerchantId,
              employeeNo: this.formValidate.code,
              userName: this.formValidate.name,
              sex: this.formValidate.sex,
              mobile: this.formValidate.mobile,
              idNumber: this.formValidate.idCard,
              contactAddress: this.formValidate.address,
              headImagePath: this.formValidate.headImagePath,
              departmentId: this.formValidate.department,
              positionId: this.formValidate.position,
              roleId: this.formValidate.role,
              urgentName: this.formValidate.contact,
              urgentPhone: this.formValidate.contactPhone
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .staff-upload {
    display: inline-block;
    width: 240px;
    height: 240px;
    text-align: center;
    line-height: 240px;
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
