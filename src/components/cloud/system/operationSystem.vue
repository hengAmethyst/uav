<template>
  <div>
    <div style="overflow: hidden">
      <div style="float: left;" class="search-wrapper">
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">操作描述</span>
          <Select v-model="codeModel" style="width:168px" placeholder="全部" class="search-item">
            <Option v-for="typeLog in handleType" :key="typeLog" :value="typeLog">{{typeLog}}</Option>
          </Select>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">操作员</span>
          <Input v-model="operationName" placeholder="根据操作人员搜索" style="width: 200px" class="search-item"></Input>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">日期</span>
          <DatePicker type="daterange" placeholder="选择日期" style="width: 200px;" class="search-item"
                      @on-change="handleDate"></DatePicker>
        </div>
        <div style="display: inline-block;vertical-align: top;">
          <button class="search" @click="searchLog">搜索</button>
          <button class="reset" @click="resetLog">重置</button>
        </div>
      </div>
    </div>
    <Table ref="tableData" stripe :columns="dictionariesSet" :data="shiftlogData" no-data-text="没有相关数据"></Table>
    <!--<div style="margin-top: 16PX;">-->
    <!--<button class="delAll">导出Excel</button>-->
    <!--</div>-->
    <div style="overflow: hidden;margin-top: 16px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';
  /**
   * 把 100 以内的正整数转为字符串，并保证2位，缺的前面加 '0'
   * @param s 值为 0 到 99
   * @returns '00' 到 '99'
   */
  const padSecond = s => ('0' + s).substr(String(s).length - 1);
  const PAGESIZE = 10;
  export default {
    data() {
      return {
        handleType: ['登录成功', '登录失败', '退出登录', '交班成功', '开班成功'],
        dictionariesSet: [
//          {
//            title: '序号',
//            type: 'index',
//            width: 60,
//            align: 'center'
//          },
          {
            title: '创建时间',
            render: (h, p) => {
              let createDate = new Date(p.row.createTime);
              let dateStr = createDate.getFullYear() + '-'
                + padSecond(createDate.getMonth() + 1)
                + '-'
                + padSecond(createDate.getDate())
                + ' '
                + padSecond(createDate.getHours())
                + ':'
                + padSecond(createDate.getMinutes());
              return h('span', dateStr);
            }
          },
          {
            title: '操作描述',
            key: 'operationTypeName',
          },
          {
            title: '操作员',
            key: 'operationUserName',
            width:80
          },
          {
            title: '部门',
            key: 'operationDeptName',
            width:80
          },
          {
            title: '操作员手机号',
            key: 'phoneNumber',
          },
          {
            title: '操作是否正常',
            key: 'status',
            render: (h, params) => {
              return h('span', params.row.status === 1 ? '正常' : '异常')
            }
          },

        ],
        loading: true,
        codeModel: '',//获取code
        type: '',
        shiftName: '',
        selectedLog: '',
        operationName: '',//操作员
        logstateTime: '',//开始时间
        logendTime: '',//结束时间
        addlog: false,
        editlog: false,
        statuse: false,
        //totalResult: 0,
        shiftlogData: [], //tabel数组
        currentPage: 1,
        totalResult: 0,
      };
    },
    created(){
      this.getlogData();
    },
    methods: {
      handleDate(value) {
        this.logstateTime = value[0];
        this.logendTime = value[1];
      },
      getlogData() {
        this.$http.post(api.HANDLELOG + 'list',
          JSON.stringify(this.getParam('getlog')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              if (response.data.logs) {
                this.shiftlogData = response.data.logs;
              }
              this.totalResult = response.data.request.page.totalResult;
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      changePage(page){
        this.currentPage = page;
        this.getlogData();
      },
      searchLog(){
        this.currentPage = 1;
        this.getlogData();
      },
      resetLog(){   //重置
        this.operationName = '';
        this.codeModel = '';
        this.logstateTime = '';
        this.logendTime = '';
//        this.getlogData();
      },
      getParam(name) {
        if (name === 'getlog') {
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
              logType: 1,
              startDate: this.logstateTime,
              endDate: this.logendTime,
              operationUserName: this.operationName,
              operationTypeName: this.codeModel
            }
          }
        }
      }
    }
  }
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
