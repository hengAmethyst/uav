<template>
  <div>
    <div class="search-condition clearfix">
      <div class="condition-wrapper">
        <span class="condition-title">订单日期</span>
        <!--<Date-picker-->
          <!--type="date"-->
          <!--placeholder="开始日期"-->
          <!--:value="startDate"-->
          <!--style="width: 300px"-->
          <!--@on-change="getStartDate"></Date-picker>-->
        <!--&nbsp;-->
        <!--<Date-picker-->
          <!--type="date"-->
          <!--placeholder="结束日期"-->
          <!--:value="endDate"-->
          <!--style="width: 300px"-->
          <!--@on-change="getEndDate"></Date-picker>-->
        <DatePicker type="daterange" placeholder="选择日期" style="width: 200px;"
                    @on-change="handleDate"></DatePicker>
      </div>
      <!--<div class="condition-wrapper">-->
        <!--<span class="condition-title">餐段</span>-->
        <!--<Select-->
          <!--v-model="period"-->
          <!--style="width:300px"-->
          <!--placeholder="餐段选择"-->
          <!--@on-change="handlePeriods">-->
          <!--<Option-->
            <!--v-for="item in periods"-->
            <!--:value="item.id"-->
            <!--:key="item.id">{{item.mealperiodName }}-->
          <!--</Option>-->
        <!--</Select>-->
      <!--</div>-->
      <button class="search-btn" @click="getData">搜索</button>

    </div>

    <Row class="amount-summary">
      <Col span="8">
      </Col>
      <Col span="8" style="border-left:1px solid #e5e9f2">
      <p class="num" style="color:#ff4949;">￥{{thirdTtotalOrderAmount}}</p>
      <p class="text">外卖实收总额（{{thirdTotalOrderNums}}单）</p>
      </Col>
      <Col span="8">
      </Col>
    </Row>

    <Table ref="tableData" :width="width" stripe :columns="columns" :data="data" no-data-text="没有相关数据"></Table>
    <div style="overflow: hidden">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
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
        totalResult: 0,
        currentPage: 1,
        period: 0,
        periods: [],
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        columns: [
          {
            title: '日期',
            key: 'days',
            fixed:'left',
            width:0
          },
          {
            title: '成交订单数',
            key: 'dealOrderNum',
            width:0
          },
          {
            title: '美团',
            key: 'meituanOrderNum',
            width:0
          },
          {
            title: '订单总额',
            key: 'thirdTotalAmount',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.thirdTotalAmount) / 100).toFixed(2))
            },
            width:0
          },
          {
            title: '商家优惠',
            key: 'merchantDiscount',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.merchantDiscount) / 100).toFixed(2))
            },
            width:0
          },
          {
            title: '第三方优惠',
            key: 'thirdDiscount',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.thirdDiscount) / 100).toFixed(2))
            },
            width:0
          },
          {
            title: '顾客实付',
            key: 'consumerPayAmount',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.consumerPayAmount) / 100).toFixed(2))
            },
            width:0
          },
          {
            title: '第三方抽佣',
            key: 'thirdFee',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.thirdFee) / 100).toFixed(2))
            },
            width:0
          },
          {
            title: '第三方配送费',
            key: 'thirdDeliveryFee',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.thirdDeliveryFee) / 100).toFixed(2))
            },
            width:0
          },
          {
            title: '商户实收',
            key: 'merchantReceipt',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.merchantReceipt) / 100).toFixed(2))
            },
            width:0
          }
        ],
        data: [],
        thirdTotalOrderNums: 0,
        thirdTtotalOrderAmount: 0,
        width:0
      }
    },
    mounted() {
      this.width = this.$refs.tableData.$el.clientWidth;
      if (window.outerWidth < 1440) {
        this.columns[0].width = this.width / 6;
        this.columns[1].width = this.width / 7;
        this.columns[2].width = this.width / 10;
        this.columns[3].width = this.width / 8;
        this.columns[4].width = this.width / 8;
        this.columns[5].width = this.width / 7;
        this.columns[6].width = this.width / 8;
        this.columns[7].width = this.width / 7;
        this.columns[8].width = this.width / 6;
        this.columns[9].width = this.width / 8;
      }
    },
    created(){
      this.getData();
      this.periods = JSON.parse(localStorage.getItem('mealPeriods'));
    },
    methods: {
      getData() {
        this.$http.post(api.THIRD + 'dayDetails',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.data = response.data.dayDetails.list;
              this.thirdTtotalOrderAmount = (Number(response.data.thirdTtotalOrderAmount) / 100).toFixed(2);
              this.thirdTotalOrderNums = response.data.thirdTotalOrderNums;
              this.totalResult = response.data.dayDetails.totalResult;
            }
          })
          .catch(err => {
            console.log(err)
          })
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
      changePage(page){
        this.currentPage = page;
        this.getData();
      },
//      getStartDate(date) {
//        this.startDate = date;
//      },
//      getEndDate(date){
//        this.endDate = date;
//      },
      handleDate(value) {
        this.startDate = value[0];
        this.endDate = value[1];
      },
      getParam(name){
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
              // merchantId: 117,
              startDate: this.startDate,
              endDate: this.endDate,
              startHour: this.startTime,
              endTHour: this.endTime
            }
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
