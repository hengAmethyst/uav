<template>
  <div>
    <div class="clearfix chose-department">
      <div style="float: right;">
        <button class="add" @click="add">+新建</button>
      </div>
    </div>
    <Table ref="tableData" stripe :columns="columns" :data="data" no-data-text="没有相关数据"></Table>

    <div style="overflow: hidden;margin-top: 32px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal class="modal-wrapper" v-model="positionInfo" :title="modalTitle" :loading="loading" @on-ok="asyncOK"
           width="400px">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="岗位名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入岗位名称" type="text" style="width:240px"></Input>
        </Form-item>
        <Form-item label="所属部门" prop="departmentId">
          <Select v-model="formValidate.departmentId" style="width:240px">
            <Option v-for="item in departmentList" :value="item.departmentId" :key="item.departmentId">{{ item.name }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="直属上级岗位">
          <Select v-model="formValidate.parentId" style="width:240px">
            <Option v-for="item in data" :value="item.id" :key="item.parentId">{{ item.name }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="单品让价额度" prop="maxSingleDiscountRate">
          <Input v-model="formValidate.maxSingleDiscountRate" placeholder="请输入额度" type="text" :maxlength="maxlength"
                 number style="width:240px">
          <span slot="append">%</span>
          </Input>
        </Form-item>
        <Form-item label="整单让价额度" prop="maxGroupDiscountRate">
          <Input v-model="formValidate.maxGroupDiscountRate" placeholder="请输入额度" type="text" :maxlength="maxlength"
                 number style="width:240px">
          <span slot="append">%</span>
          </Input>
        </Form-item>
        <Form-item label="抹零额度" prop="maxPreferentialAmount">
          <Input v-model="formValidate.maxPreferentialAmount" placeholder="请输入金额" type="text" number
                 style="width:240px">
          <span slot="append">元</span>
          </Input>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';

  export default {
    data() {
      return {
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '岗位名称',
            key: 'name'
          },
          {
            title: '所属部门',
            key: 'departmentId',
            render: (h, params) => {
              let _this = this;
              return h('span', _this.filterDepartment(params.row.departmentId))
            }
          },
          {
            title: '单品让价额度',
            key: 'singleDiscount',
            width:120,
            render: (h, params) => {
              return h('span', params.row.singleDiscount + '%')
            }
          },
          {
            title: '整单让价额度',
            key: 'discount',
            width:120,
            render: (h, params) => {
              return h('span', params.row.discount + '%')
            }
          },
          {
            title: '抹零额度',
            key: 'erase',
            render: (h, params) => {
              return h('span', (Number(params.row.erase) / 100).toFixed(2))
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  style: {
                    padding: '0',
                    marginRight: '32px',
                    width: '40px',
                    height: '24px',
                    borderRadius: '2px',
                    border: '1px solid #20a0ff',
                    lineHeight: '24px',
                    textAlign: 'center',
                    color: '#20a0ff',
                    fontSize: '13px',
                    background: '#fff',
                    verticalAlign: 'top'
                  },
                  on: {
                    click: () => {
                      this.edit(params.index)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  style: {
                    padding: '0',
                    width: '40px',
                    height: '24px',
                    borderRadius: '2px',
                    border: '1px solid #ff4949',
                    lineHeight: '24px',
                    textAlign: 'center',
                    color: '#ff4949',
                    fontSize: '13px',
                    background: '#fff'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        data: [],
        formValidate: {
          departmentId: '',
          name: '',
          parentId: '',
          maxGroupDiscountRate: '',
          maxSingleDiscountRate: '',
          maxPreferentialAmount: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '岗位名称不能为空', trigger: 'blur'}
          ],
          departmentId: [
            {required: true, message: '请选择部门', trigger: 'change', type: 'number'}
          ],
          parentId: [
            {required: true, message: '请选择直属上级岗位', trigger: 'change', type: 'number'}
          ],
          maxSingleDiscountRate: [
            {required: true, message: '请输入正确的额度', trigger: 'blur', type: 'number'},
            { type: 'number',max:100,min:0,message:'不能大于100%',trigger: 'blur'}
          ],
          maxGroupDiscountRate: [
            {required: true, message: '请输入正确的额度', trigger: 'blur', type: 'number'},
            { type: 'number',max:100,min:0,message:'不能大于100%',trigger: 'blur'}
          ],
          maxPreferentialAmount: [
            {required: true, message: '请输入正确的额度', trigger: 'blur', type: 'number'}
          ]
        },
        departmentList: [],
        maxlength: 3,
        totalResult: 0,
        currentPage: 1,
        type: '',
        modalTitle: '',
        selectedId: '',
        loading: true,
        positionInfo: false
      }
    },
    created() {
      this.getPosition();
    },
    mounted() {
      this.$nextTick(() => {
        this.getDepartment();
      })
    },
    computed: {
      getNewDepartment(){
        return this.$store.getters['department']
      }
    },
    watch: {
      getNewDepartment(){
        this.getDepartment()
      }
    },
    methods: {
      getPosition() {
        this.$http.post(api.POSITION + 'queryAllPosition',
          JSON.stringify(this.getParam('position')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.data = response.data.acctUserPositionList;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getDepartment() {
        this.$http.post(api.DEPARTMENT + 'queryAllDepartment',
          JSON.stringify(this.getParam('department')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.departmentList = response.data.departmentList;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      filterDepartment(id){
        for (let i = 0; i < this.departmentList.length; i++) {
          if (this.departmentList[i].departmentId === id) {
            return this.departmentList[i].name
          }
        }

      },
      addData(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.POSITION + 'insertPosition',
              JSON.stringify(this.getParam('add')))
              .then(res => {
                // console.log(res);
                let response = res.body;
                if (response.code === 0) {
                  this.loading = false;
                  this.$Message.success('新增成功');
                  this.positionInfo = false;
                  this.getPosition()
                } else {
                  this.$Message.error('新增失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      editData(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.POSITION + 'updatePosition',
              JSON.stringify(this.getParam('edit')))
              .then(res => {
                // console.log(res);
                let response = res.body;
                if (response.code === 0) {
                  this.loading = false;
                  this.$Message.success('修改成功');
                  this.positionInfo = false;
                  this.getPosition()
                } else {
                  this.$Message.error('修改失败')
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
      delData() {
        this.$http.post(api.POSITION + 'deletePosition',
          JSON.stringify(this.getParam('del')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.loading = false;
              this.getPosition();
              this.$Message.success('删除成功');
            } else {
              this.loading = false;
              this.$Message.error('删除失败');
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      add() {
        this.type = 'add';
        this.formValidate = {
          departmentId: '',
          name: '',
          parentId: '',
          maxGroupDiscountRate: '',
          maxSingleDiscountRate: '',
          maxPreferentialAmount: ''
        };
        this.positionInfo = true;
        this.modalTitle = '新建岗位';
      },
      edit(index) {
        this.selectedId = this.data[index].id;
        this.formValidate = {
          departmentId: this.data[index].departmentId,
          name: this.data[index].name,
          parentId: this.data[index].parentId,
          maxGroupDiscountRate: this.data[index].discount,
          maxSingleDiscountRate: this.data[index].singleDiscount,
          maxPreferentialAmount: Number(this.data[index].erase) / 100
        };
        this.type = 'edit';
        this.positionInfo = true;
        this.modalTitle = '编辑岗位'
      },
      remove(index){ // 删除逻辑
        this.$Modal.confirm({
          title: '删除',
          content: '此操作将删除该岗位，是否继续？',
          loading: true,
          onOk: () => {
            this.selectedId = this.data[index].id;
            setTimeout(() => {
              this.delData();
              this.$Modal.remove();
            }, 1000);
          },
          onCancel: () => {
            this.loading = false;
            this.$Modal.remove();
          }
        });
      },
      asyncOK() {
        if (this.type === 'add') {
          this.addData('formValidate');
        } else {
          this.editData('formValidate');
        }
      },
      changePage(page) {
        this.currentPage = page;
      },
      getParam(name) {
        if (name === 'position') {
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
            }
          }
        } else if (name === 'department') {
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
              departmentId: this.formValidate.departmentId,
              name: this.formValidate.name,
              parentId: this.formValidate.parentId ? this.formValidate.parentId : 0,
              merchantId: localStorage.currentMerchantId,
              maxGroupDiscountRate: this.formValidate.maxGroupDiscountRate,
              maxSingleDiscountRate: this.formValidate.maxSingleDiscountRate,
              maxPreferentialAmount: Number(this.formValidate.maxPreferentialAmount) * 100
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
              id: this.selectedId,
              departmentId: this.formValidate.departmentId,
              name: this.formValidate.name,
              parentId: this.formValidate.parentId ? this.formValidate.parentId : 0,
              merchantId: localStorage.currentMerchantId,
              maxGroupDiscountRate: this.formValidate.maxGroupDiscountRate,
              maxSingleDiscountRate: this.formValidate.maxSingleDiscountRate,
              maxPreferentialAmount: Number(this.formValidate.maxPreferentialAmount) * 100
            }
          }
        } else if (name === 'del') {
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
              id: this.selectedId,
            }
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .chose-department {
    margin-bottom: 16px;
    .add {
      width: 88px;
      height: 36px;
      border-radius: 2px;
      background-color: #20a0ff;
      color: #fff;
      font-size: 14px;
      border: none;
      outline: none;
      cursor: pointer;
      &:hover {
        opacity: .9;
      }
    }
  }

  .modal-wrapper .ivu-select-dropdown {
    left: 0 !important;
    top: 33px !important;
  }
</style>
