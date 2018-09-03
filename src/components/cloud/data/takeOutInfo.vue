<template>
  <div>
    <div class="search-condition clearfix">
      <div class="condition-wrapper">
        <span class="condition-title">日期</span>
        <!--<Date-picker type="date" placeholder="开始日期" :value="startDate" style="width: 300px"-->
                     <!--@on-change="getStartDate"></Date-picker>-->
        <!--&nbsp;-->
        <!--<Date-picker type="date" placeholder="结束日期" :value="endDate" style="width: 300px"-->
                     <!--@on-change="getEndDate"></Date-picker>-->
        <DatePicker type="daterange" placeholder="选择日期" style="width: 200px;"
                    @on-change="handleDate"></DatePicker>
      </div>
      <!--<div class="condition-wrapper">-->
        <!--<span class="condition-title">餐段</span>-->
        <!--<Select v-model="period" style="width:300px" placeholder="餐段选择" @on-change="handlePeriods">-->
          <!--<Option v-for="item in periods" :value="item.id" :key="item.id">{{-->
            <!--item.mealperiodName }}-->
          <!--</Option>-->
        <!--</Select>-->
      <!--</div>-->
      <button class="search-btn" @click="getData">搜索</button>

    </div>

    <Row class="amount-summary">
      <Col span="8">
      </Col>
      <Col span="8" style="border-left:1px solid #e5e9f2">
      <p class="num" style="color:#ff4949;">￥{{getTotalAmount}}</p>
      <p class="text">外卖实收总额（{{getTotalNum}}单）</p>
      </Col>
      <Col span="8">
      </Col>
    </Row>

    <Table ref="tableData" :width="width" stripe :columns="columns" :data="data" no-data-text="没有相关数据"></Table>

  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api'

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
            title: '第三方',
            key: 'thirdName',
            width:0,
            fixed:'left'
          },
          {
            title: '成交订单数',
            key: 'thirdOrderNum',
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
        width:0
      }
    },
    computed: {
      getTotalNum(){
        let num = 0;
        for (let i = 0; i < this.data.length; i++) {
          num += Number(this.data[i].thirdOrderNum);
        }
        return num;
      },
      getTotalAmount() {
        let amount = 0;
        for (let i = 0; i < this.data.length; i++) {
          amount += Number(this.data[i].thirdTotalAmount);
        }
        return (Number(amount) / 100).toFixed(2);
      }
    },
    mounted() {
      this.width = this.$refs.tableData.$el.clientWidth;
      if (window.outerWidth < 1440) {
        this.columns[0].width = this.width / 10;
        this.columns[1].width = this.width / 7;
        this.columns[2].width = this.width / 8;
        this.columns[3].width = this.width / 8;
        this.columns[4].width = this.width / 7;
        this.columns[5].width = this.width / 7;
        this.columns[6].width = this.width / 7;
        this.columns[7].width = this.width / 6;
        this.columns[8].width = this.width / 8;
      }
    },
    created(){
      this.getData();
      this.periods = JSON.parse(localStorage.getItem('mealPeriods'));
    },
    methods: {
      getData() {
        this.$http.post(api.THIRD + 'stastics',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.data = response.data.bussinessThirdStasticsDtos;
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handlePeriods(value) {
        for (let i = 0; i < this.periods.length; i++) {
          if (value === this.periods[i].id) {
            this.startTime = this.periods[i].mealperiodStartTime;
            this.endTime = this.periods[i].mealperiodEndTime;
          }
        }
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
              // merchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId,
              merchantId:localStorage.currentMerchantId,
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
