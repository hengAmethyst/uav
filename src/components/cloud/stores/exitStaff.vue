<template>
  <div>
    <div style="overflow: hidden">
      <div style="float: left" class="search-wrapper">
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">性别</span>
          <Select v-model="sex" style="width:120px" placeholder="全部" class="search-item">
            <Option value="1" key="1">男</Option>
            <Option value="0" key="0">女</Option>
          </Select>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">离职日期</span>
          <DatePicker type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px;font-size:12px;"
                      class="search-item" format="yyyy-MM-dd" :value="dateRange" @on-change="handleDate"></DatePicker>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">姓名/手机号</span>
          <Input v-model="searchContent" placeholder="请输入内容" style="width: 200px" class="search-item"></Input>
        </div>
        <div style="display: inline-block;vertical-align: top;">
          <button class="search" @click="getData">搜索</button>
          <button class="reset" @click="reset">重置</button>
        </div>
      </div>
    </div>

    <Table ref="tableData" :width="width" stripe :columns="exitColumns" :data="exitData" no-data-text="没有相关数据"></Table>

    <div style="overflow: hidden;margin-top: 32px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal v-model="staffDetail" title="员工详情">
      <StaffDetail :staffInfo="staffDetailInfo" type="exit"></StaffDetail>
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
        exitColumns: [
          {
            title: '姓名',
            key: 'name',
            fixed:'left',
            width:0
          },
          {
            title: '员工头像',
            key: 'headPortrait',
            width:0,
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.headPortrait,
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
            width:0,
            render: (h, params) => {
              return h('span', params.row.sex === 0 ? '女' : '男')
            }
          },
          {
            title: '手机号',
            key: 'phone',
            width:0
          },
          {
            title: '角色',
            key: 'positionName',
            width:0
          },
          {
            title: '部门',
            key: 'departmentName',
            width:0
          },
          {
            title: '工号',
            key: 'employeeNo',
            width:0
          },
          {
            title: '离职日期',
            key: 'endTime',
            width:0
          },
          {
            title: '操作',
            key: 'action',
            fixed:'right',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h('Button', {
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
              }, '详情');
            }
          }
        ],
        exitData: [],
        sex: '',
        searchContent: '',
        totalResult: 0,
        currentPage: 1,
        dateRange: [],
        startDate: '',
        endDate: '',
        staffDetail: false,
        staffDetailInfo: {},
        width:0
      }
    },
    mounted() {
      this.width = this.$refs.tableData.$el.clientWidth;
      if (window.outerWidth < 1440) {
        this.exitColumns[0].width = this.width / 8;
        this.exitColumns[1].width = this.width / 5;
        this.exitColumns[2].width = this.width / 10;
        this.exitColumns[3].width = this.width / 6;
        this.exitColumns[4].width = this.width / 6;
        this.exitColumns[5].width = this.width / 9;
        this.exitColumns[6].width = this.width / 8;
        this.exitColumns[7].width = this.width / 7;
      }
    },
    created() {
      this.getData();
    },
    computed: {
      getNewData() {
        return this.$store.getters['serving']
      }
    },
    watch: {
      getNewData() {
        this.getData();
      }
    },
    methods: {
      getData() {
        this.$http.post(api.QUITEMPLOYEE + 'getQuitEmployeeList',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.exitData = response.data.list;
              this.totalResult = response.data.totalResult;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleDate(value) {
        this.dateRange = value;
        this.startDate = value[0];
        this.endDate = value[1];
      },
      changePage(page) {
        this.currentPage = page;
        this.getData();
      },
      detail(staff) {
        this.staffDetail = true;
        this.staffDetailInfo = staff;
      },
      reset() {
        this.sex = '';
        this.searchContent = '';
        this.dateRange = [];
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
              //              merchantId: 123,
              merchantId: localStorage.currentMerchantId,
              sex: this.sex ? Number(this.sex) : '',
              searchCode: this.searchContent,
              startDate: this.startDate,
              endDate: this.endDate
            }
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
