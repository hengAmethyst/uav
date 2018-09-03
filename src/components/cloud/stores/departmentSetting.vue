<template>
  <div>
    <div style="margin-bottom: 16px;overflow: hidden">
      <div style="float: right;margin-left:16px">
        <button class="delAll" @click="removeAll">批量删除({{getNum}})</button>
      </div>
      <div style="float: right;">
        <button class="add" @click="add">+新建</button>
      </div>
    </div>
    <Table
      @on-selection-change="handleSelection"
      ref="tableData"
      stripe
      :columns="departmentColumns"
      :data="departmentData"
      no-data-text="没有相关数据"></Table>

    <div style="overflow: hidden;margin-top: 32px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal
      v-model="editModal"
      title="编辑部门"
      :loading="loading"
      @on-ok="asyncOK">
      <h4 class="modal-title"><b style="color: #ff4949;margin-right: 5px;">*</b>部门名称</h4>
      <Input v-model="departmentName" placeholder="请输入部门名称"></Input>
    </Modal>

    <Modal
      v-model="addModal"
      title="新建部门"
      :loading="loading"
      @on-ok="asyncOK">
      <h4 class="modal-title"><b style="color: #ff4949;margin-right: 5px;">*</b>部门名称</h4>
      <Input v-model="departmentName" placeholder="请输入部门名称"></Input>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';

  const PAGESIZE = 10;

  export default {
    data() {
      return {
        departmentData: [],
        departmentColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '部门名称',
            key: 'name'
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
        editModal: false,
        addModal: false,
        departmentName: '',
        loading: true,
        selectedItemId: '',
        type: '',
        modalTitle: '',
        selection: [],
        totalResult: 0,
        currentPage: 1,
        delId: []
      };
    },
    computed: {
      getNum() {
        if (this.selection.length > 0) {
          return this.selection.length;
        }
        return 0
      }
    },
    created() {
      this.getDepartmentData();
    },
    methods: {
      getDepartmentData() {
        this.$http.post(api.MERCHANT + 'getDepartmentList',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              if (response.data.list) {
                this.departmentData = response.data.list;
                this.$store.dispatch('department',this.departmentData)
              } else {
                this.departmentData = [];
              }
              this.totalResult = response.data.totalResult;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      addData() {
        if (!this.departmentName) {
          this.$Message.error('必填信息不能为空');
          this.loading = false;
        } else {
          this.$http.post(api.MERCHANT + 'insertOrUpdateDepartmentInfo',
            JSON.stringify(this.getParam('add')))
            .then(res => {
              let response = res.body;
              if (response.code === 0) {
                this.loading = false;
                this.$Message.success('创建成功');
                this.addModal = false;
                this.getDepartmentData();
              } else if (response.code === 11007) {
                this.$Message.error('部门名称重复');
                this.loading = false;
              } else {
                this.$Message.error(response.msg);
                this.loading = false;
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      editData() {
        if (!this.departmentName) {
          this.$Message.error('必填信息不能为空');
          this.loading = false;
        } else {
          this.$http.post(api.MERCHANT + 'insertOrUpdateDepartmentInfo',
            JSON.stringify(this.getParam('edit')))
            .then(res => {
              let response = res.body;
              if (response.code === 0) {
                this.loading = false;
                this.$Message.success('修改成功');
                this.editModal = false;
                this.getDepartmentData();
              } else if (response.code === 11007) {
                this.$Message.error('部门名称重复');
                this.loading = false;
              } else {
                this.$Message.error(response.msg);
                this.loading = false;
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      delData() {
        this.$http.post(api.MERCHANT + 'deleteDepartments',
          JSON.stringify(this.getParam('del')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.loading = false;
              this.getDepartmentData();
              this.$Message.success('删除成功');
            } else {
              this.loading = false;
              this.selection = [];
              this.$Message.error('删除失败');
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      changePage(page){
        this.currentPage = page;
        this.selection = [];
        this.getDepartmentData();
      },
      handleSelection(selection){
        this.selection = selection;
        this.delId = [];
        for (let i = 0; i < this.selection.length; i++) {
          this.delId.push(this.selection[i].departmentId);
        }
      },
      edit(index) {
        this.type = 'edit';
        this.selectedItemId = this.departmentData[index].departmentId;
        this.departmentName = this.departmentData[index].name;
        this.editModal = true;
      },
      add() {
        this.type = 'add';
        this.departmentName = '';
        this.addModal = true;
      },
      remove(index) {
        this.$Modal.confirm({
          title: '删除',
          content: '此操作将删除该部门，是否继续？',
          loading: true,
          onOk: () => {
            this.delId = [];
            this.delId.push(this.departmentData[index].departmentId);
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
      removeAll() {
        if (this.selection.length > 0) {
          this.$Modal.confirm({
            title: '删除',
            content: '此操作将批量删除部门，是否继续？',
            loading: true,
            onOk: () => {
              setTimeout(() => {
                this.delData();
                this.selection = []; //批量删除后，重置选中数量
                this.$Modal.remove();
              }, 1000);
            },
            onCancel: () => {
              this.loading = false;
              this.$Modal.remove();
            }
          });
        } else {
          this.$Message.error('请选择删除项')
        }
      },
      asyncOK() {
        if (this.type === 'edit') {
          this.editData();
        } else {
          this.addData();
        }
      },
      getParam(name) {
        if (name === 'get') {
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
              page: {
                pageSize: PAGESIZE,
                currentPage: this.currentPage
              },
              id: localStorage.currentMerchantId
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
              name: this.departmentName
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
              departmentId: this.selectedItemId,
              merchantId: localStorage.currentMerchantId,
              name: this.departmentName
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
            param: this.delId
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
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

  .delAll {
    width: 88px;
    height: 36px;
    border-radius: 2px;
    background-color: #ffffff;
    border: solid 1px #c0ccda;
    font-size: 14px;
    color: #475669;
    cursor: pointer;
    &:hover {
      opacity: .9;
    }
  }

  .modal-title {
    margin-bottom: 5px;
    font-size: 14px;
  }
</style>
