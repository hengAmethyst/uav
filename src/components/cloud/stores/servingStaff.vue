<template>
  <div>
    <div style="overflow: hidden">
      <div style="float: left;" class="search-wrapper">
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">部门</span>
          <Select v-model="departmentId" style="width:168px" placeholder="全部" class="search-item"
                  @on-change="handleDepartment">
            <Option v-for="item in departmentList" :value="item.departmentId" :key="item.departmentId">{{ item.name }}
            </Option>
          </Select>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">性别</span>
          <Select v-model="sex" style="width:120px" placeholder="全部" class="search-item">
            <Option value="1" key="1">男</Option>
            <Option value="0" key="0">女</Option>
          </Select>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">姓名/手机号</span>
          <Input v-model="searchContent" placeholder="请输入内容" style="width: 200px" class="search-item"></Input>
        </div>
        <div style="display: inline-block;vertical-align: top;">
          <button class="search" @click="getData">搜索</button>
          <button class="reset" @click="resetQuery">重置</button>
        </div>
      </div>
    </div>
    <div style="margin-bottom:16px;overflow: hidden">
      <div style="float: right;">
        <button class="add" @click="add">+新建</button>
      </div>
    </div>
    <Table ref="tableData" :width="width" stripe :columns="servingColumns" :data="servingData"
           no-data-text="没有相关数据"></Table>
    <div style="overflow: hidden;margin-top: 32px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal v-model="staffDetail" title="员工详情">
      <StaffDetail :staffInfo="staffDetailInfo" type="serving"></StaffDetail>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api'
  import StaffDetail from './staffDetail.vue';

  const PAGESIZE = 10;

  export default {
    data() {
      return {
        servingColumns: [
          {
            title: '姓名',
            key: 'userName',
            width: 0
          },
          {
            title: '员工头像',
            key: 'headPortrait',
            width: 0,
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.headImagePath,
                    width: '90',
                    height: '90'
                  },
                  style: {
                    display: 'block',
                    padding: '10px'
                  }
                })
              ])
            }
          },
          {
            title: '性别',
            key: 'sex',
            width: 0,
            render: (h, params) => {
              return h('span', params.row.sex === 0 ? '女' : '男')
            }
          },
          {
            title: '手机号',
            key: 'mobile',
            width: 0
          },
          {
            title: '职务',
            key: 'roleName',
            width: 0
          },
          {
            title: '部门',
            key: 'departmentName',
            width: 0
          },
          {
            title: '工号',
            key: 'employeeNo',
            width: 0
          },
          {
            title: '操作',
            key: 'action',
            width: 350,
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  style: {
                    padding: '0',
                    marginRight: '24px',
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
                      this.edit(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  style: {
                    padding: '0',
                    marginRight: '24px',
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
                      this.detail(params.row)
                    }
                  }
                }, '详情'),
                h('Button', {
                  style: {
                    padding: '0',
                    marginRight: '24px',
                    width: '80px',
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
                      this.reset(params.row.id)
                    }
                  }
                }, '重置密码'),
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
                      this.remove(params.row.id)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        servingData: [],
        sex: '',
        searchContent: '',
        currentPage: 1,
        totalResult: 0,
        loading: true,
        delIds: [],
        resetId: '',
        // 部门、职位、角色
        departmentList: [],
        departmentId: '',
        acctUserPositionList: [],
        roleList: [],
        staffDetail: false,
        staffDetailInfo: {},
        width:0
      }
    },
    created() {
      this.getData();
    },
    mounted() {
      this.width = this.$refs.tableData.$el.clientWidth;
      if (window.outerWidth < 1440) {
        this.servingColumns[0].width = this.width / 8;
        this.servingColumns[1].width = this.width / 5;
        this.servingColumns[2].width = this.width / 10;
        this.servingColumns[3].width = this.width / 6;
        this.servingColumns[4].width = this.width / 8;
        this.servingColumns[5].width = this.width / 9;
        this.servingColumns[6].width = this.width / 8;
      }
      this.getPosition();
      this.getDepartment();
      this.getRoles();

    },
    methods: {
      getData() {
        this.$http.post(api.EMPLOYEE + 'getEmployeeList',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.servingData = response.data.list;
              this.$store.dispatch('serving', response.data.list.length);
            } else if (response.code === 1) {
              this.servingData = [];
              this.$store.dispatch('serving', 0);
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getPosition() {
        this.$http.post(api.POSITION + 'queryAllPosition',
          JSON.stringify(this.getParam('position')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.acctUserPositionList = response.data.acctUserPositionList;
              localStorage.setItem('positionList', JSON.stringify(response.data.acctUserPositionList));
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
              localStorage.setItem('departmentList', JSON.stringify(response.data.departmentList));
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getRoles() {
        this.$http.post(api.ROLES + 'roles',
          JSON.stringify(this.getParam('roles')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.roleList = response.data.roleList;
              localStorage.setItem('roleList', JSON.stringify(response.data.roleList));
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      resetQuery() {
        this.sex = '';
        this.searchContent = '';
        this.departmentId = '';
        this.getData();
      },
      delData() {
        this.$http.post(api.EMPLOYEE + 'deleteEmloyees',
          JSON.stringify(this.getParam('del')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.loading = false;
              this.getData();
              this.$Message.success('删除成功');
            } else {
              this.loading = false;
              this.$Message.error('删除失败');
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      resetPwd() {
        this.$http.post(api.EMPLOYEE + 'resetPassword',
          JSON.stringify(this.getParam('reset')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.loading = false;
              this.$Message.success('重置成功');
            } else {
              this.loading = false;
              this.$Message.error('重置失败');
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      handleDepartment(value) {
        this.departmentId = value;
      },
      add() {
        this.$router.push('/cloud/addStaff')
      },
      edit(staff) {
        this.$store.dispatch('staffInfo', staff);
        this.$router.push('/cloud/editStaff');
      },
      detail(staff) {
        this.staffDetail = true;
        this.staffDetailInfo = staff;
      },
      reset(id) {
        this.$Modal.confirm({
          title: '删除',
          content: '此操作将重置该员工的密码，是否继续？',
          loading: true,
          onOk: () => {
            this.resetId = id;
            setTimeout(() => {
              this.resetPwd();
              this.$Modal.remove();
            }, 1000);
          },
          onCancel: () => {
            this.loading = false;
            this.$Modal.remove();
          }
        });
      },
      remove(id) {
        this.$Modal.confirm({
          title: '删除',
          content: '此操作将该员工移至离职列表，是否继续？',
          loading: true,
          onOk: () => {
            this.delIds = [];
            this.delIds.push(id);
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
      changePage(page) {
        this.currentPage = page;
        this.getData();
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
              merchantId: localStorage.currentMerchantId,
              sex: this.sex ? Number(this.sex) : '',
              searchCode: this.searchContent,
              departmentId: this.departmentId ? Number(this.departmentId) : ''
            }
          }
        } else if (name === 'position') {
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
        } else if (name === 'roles') {
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
              token: localStorage.getItem('token')
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
            param: this.delIds
          }
        } else if (name === 'reset') {
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
            param: this.resetId
          }
        }
      }
    },
    components: {
      StaffDetail
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .add,
  .search,
  .reset {
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

  .search {
    margin-right: 16px;
    background: #ff4949;
  }

  .reset {
    background: #fff;
    border: 1px solid #ff4949;
    color: #ff4949;
  }

  .search-wrapper {
    font-size: 0;
    .search-title {
      display: inline-block;
      margin-top: 2px;
      margin-right: 12px;
      vertical-align: top;
      width: 80px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background: #f2f4f8;
      font-size: 14px;
      color: #1f2d3d;
    }
    .search-item {
      vertical-align: top;
      margin-top: 2px;
      margin-right: 24px;
    }
  }
</style>
