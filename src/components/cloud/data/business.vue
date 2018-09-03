<template>
  <div>
    <div class="search-condition clearfix">
      <div class="condition-wrapper">
        <span class="condition-title">日期</span>
        <DatePicker type="daterange" placeholder="选择日期" style="width: 200px;" @on-change="handleDate"></DatePicker>
      </div>
      <!--<div class="condition-wrapper">-->
        <!--<span class="condition-title">时段</span>-->
        <!--<Select v-model="period" style="width:300px" placeholder="餐段选择" @on-change="handlePeriods">-->
          <!--<Option v-for="item in periods" :value="item.id" :key="item.id">{{item.mealperiodName }}-->
          <!--</Option>-->
        <!--</Select>-->
        <!--<TimePicker type="timerange" format="HH:mm" placeholder="选择时间" style="width: 152px"-->
                    <!--@on-change="handleTime" :editable="false" :steps="[1,15]"></TimePicker>-->
      <!--</div>-->
      <button class="search-btn" @click="getSummaryData">搜索</button>

    </div>

    <Row class="amount-summary">
      <Col span="12">
      <div class="amount-summary-item v-line">
        <p class="num" style="color: #ff4949;">￥{{totalTurnoverAmount}}</p>
        <p class="text" style="color: #ff4949;">累计营业额</p>
      </div>
      <div class="amount-summary-item">
        <p class="num">￥{{perDayTurnover}}</p>
        <p class="text">日均营业额</p>
      </div>
      </Col>
      <Col span="12">
      <div class="amount-summary-item" style="width:100%;">
        <p class="num" style="color: rgb(32, 160, 255);">￥{{totalDisCountAmount}}</p>
        <p class="text" style="color: rgb(32, 160, 255);">累计折扣金额</p>
      </div>
      <!-- <div class="amount-summary-item">
            <p class="num">￥{{perPassengerTurnover}}</p>
            <p class="text">客单价</p>
          </div> -->
      </Col>
    </Row>

    <Table ref="tableData" stripe :columns="summaryColumns" :data="summaryData" no-data-text="没有相关数据"></Table>

    <div style="overflow: hidden">
      <div style="float: right;">
        <Page :total="summaryPage" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as api from '../../../vuex/api'

const PAGESIZE = 10;

export default {
  data() {
    return {
      // 营业概况
      ifTable: false,
      period: '',
      periods: [],
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      totalTurnoverAmount: '', // 累计营业额
      perDayTurnover: '', // 日均营业额
      totalDisCountAmount: '', // 累计折扣金额
      perPassengerTurnover: '', // 客单价
      summaryColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '日期',
          key: 'dateTime'
        },
        {
          title: '营业额',
          key: 'turnover',
          render: (h, params) => {
            return h('span', (Number(params.row.turnover) / 100).toFixed(2) + '元')
          }
        },
        {
          title: '折扣金额',
          key: 'discount',
           render: (h, params) => {
            return h('span', (Number(params.row.discount) / 100).toFixed(2) + '元')
          }
        },
        // {
        //   title: '客流量',
        //   key: 'passengerFlow'
        // },
        // {
        //   title: '客单价',
        //   key: 'perPassengerPrice'
        // }
      ],
      summaryData: [],
      summaryPage: 0,
      currentPage: 1,
    }
  },
  created() {
    this.getSummaryData();
    this.periods = JSON.parse(localStorage.getItem('mealPeriods'));
  },
  methods: {
    getSummaryData() {
      this.$http.post(api.BUSSINESS + 'summary',
        JSON.stringify(this.getParam('get')))
        .then(res => {
          // console.log(res);
          let response = res.body;
          if (response.code === 0) {
            this.totalTurnoverAmount = (Number(response.data.stasticsDto.totalTurnoverAmount) / 100).toFixed(2);
            this.perDayTurnover = (Number(response.data.stasticsDto.perDayTurnover) / 100).toFixed(2);
            this.totalDisCountAmount = (Number(response.data.stasticsDto.totalDisCountAmount) / 100).toFixed(2);
            this.perPassengerTurnover = (Number(response.data.stasticsDto.perPassengerTurnover) / 100).toFixed(2);
            this.summaryData = response.data.page.list;
            this.summaryPage = response.data.page.totalResult;
          }
        })
        .catch(res => {
          console.log(res);
        })
    },
    // 获取概况中的日期条件
    handleDate(value) {
      this.startDate = value[0];
      this.endDate = value[1];
    },
    handleTime(value){
      this.startTime = value[0];
      this.endTime = value[1];
    },
    handlePeriods(value) {
      // console.log(value);
      for (let i = 0; i < this.periods.length; i++) {
        if (value === this.periods[i].id) {
          this.startTime = this.periods[i].mealperiodStartTime;
          this.endTime = this.periods[i].mealperiodEndTime;
        }
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getSummaryData();
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
            //              merchantId: 241,
            startDate: this.startDate,
            endDate: this.endDate,
            startTime: this.startTime,
            endTime: this.endTime
          }
        }
      }
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
