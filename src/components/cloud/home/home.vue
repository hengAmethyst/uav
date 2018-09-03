<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">今日看板</h2>
    </div>

    <div class="child-wrapper">
      <Table :width="width" ref="tableData" stripe :columns="columns" :data="data" no-data-text="没有相关数据"></Table>

      <Row>
        <Col span="24">
        <h2 class="board-title">营业额（今日）</h2>
        <div ref="turnoverTimingDtos" style="width:100%;height:370px;"></div>
        </Col>
        <Col span="12">
        <h2 class="board-title">菜品营收占比</h2>
        <div ref="dishesRevenueDtos" style="width:80%;height:300px;"></div>
        </Col>
        <Col span="12">
        <h2 class="board-title">菜品异常数据</h2>
        <div ref="receiptExceptionDtos" style="width:100%;height:300px;"></div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';
  import echarts from 'echarts'

  const DISHESNUM = 7;

  export default {
    data() {
      return {
        data: [],
        columns: [
          {
            title: '营业额',
            key: 'totalTurnoverAmount',
            fixed: 'left',
            width: 0,
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.totalTurnoverAmount) / 100).toFixed(2))
            }
          },
          {
            title: '订单数',
            width: 0,
            key: 'turnoverTotalOrder'
          },
          {
            title: '外卖收入',
            key: 'takeOuntAmount',
            width: 0,
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.takeOuntAmount) / 100).toFixed(2))
            }
          },
          {
            title: '外卖订单数',
            width: 0,
            key: 'takeOutOrderNums'
          },
          {
            title: '会员储值金额',
            width: 0,
            key: 'memberRechargeAmount',
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.memberRechargeAmount) / 100).toFixed(2))
            }
          },
//        {
//          title: '会员储值消费金额',
//          key: 'memberConsumerAmount',
//          render: (h, params) => {
//            return h('span', '￥' + (Number(params.row.memberConsumerAmount) / 100).toFixed(2))
//          }
//        },
          {
            title: '未支付订单总额',
            key: 'uncheckAmount',
            width: 0,
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.uncheckAmount) / 100).toFixed(2))
            }
          },
          {
            title: '未支付订单数',
            key: 'uncheckOrderNums',
            width: 0,
          },
          {
            title: '折扣金额',
            key: 'totalDiscountAmount',
            width: 0,
            render: (h, params) => {
              return h('span', '￥' + (Number(params.row.totalDiscountAmount) / 100).toFixed(2))
            }
          },
          {
            title: '折扣单数',
            key: 'discountTotalOrder',
            width: 0,
          }
        ],
        // 今日营业额
        turnoverTimingChart: null,
        turnoverTimingDtosXAxis: [],
        totalActualAmout: [],
        totalPayAmount: [],
        turnoverTiming: {
          title: {
            text: null
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            x: 'right',
            data: ['实收金额', '应收金额']
          },
          xAxis: {
            name: '小时',
            data: []
          },
          yAxis: {
            name: '金额(￥)'
          },
          series: [
            {
              name: '实收金额',
              type: 'bar',
              barGap: 0,
              itemStyle: {
                normal: {
                  color: '#13ce66'
                }
              },
              data: []
            },
            {
              name: '应收金额',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#20a0ff'
                }
              },
              data: []
            }
          ]
        },
        // 菜品营收占比
        dishesRevenueChart: null,
        dishesNameData: [],
        dishesValueData: [],
        dishesRevenue: {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            y: 'middle',
            data: []
          },
          series: [
            {
              name: '菜品营收占比',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '24'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        },
        pieColor: ['#f7ba2a', '#ff7f20', '#ff4949', '#13ce66', '#7813ce', '#1337ce', '#20a0ff'], //用于生成饼图的颜色
        // 菜品异常数据
        receiptExceptionChart: null,
        receiptExceptionXAxis: [],
        receiptExceptionData: [],
        receiptException: {
          title: {
            text: null
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            name: '异常',
            data: []
          },
          yAxis: {
            name: '单',
          },
          series: [
            {
              name: '异常数据',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#20a0ff'
                }
              },
              data: []
            }
          ]
        },
        echartsData: {},
        loading: true,
        width: 0
      }
    },
//    created() {
//      this.getData();
//    },
    computed: {
      ifLoading() {
        return this.loading = localStorage.currentMerchantId ? true : false;
      }
    },
    mounted() {
      this.width = this.$refs.tableData.$el.clientWidth;
      if (window.outerWidth < 1440) {
        this.columns[0].width = this.width / 10;
        this.columns[1].width = this.width / 10;
        this.columns[2].width = this.width / 8;
        this.columns[3].width = this.width / 6;
        this.columns[4].width = this.width / 6;
        this.columns[5].width = this.width / 6;
        this.columns[6].width = this.width / 6;
        this.columns[7].width = this.width / 6;
        this.columns[8].width = this.width / 8;
      }
      /*
       * echarts图标处理，数据需从接口获取，并进行处理，依次为初始化图标，设置初始数据，请求接口，并完成设置
       * */
      this.$nextTick(() => {
        this.turnoverTimingChart = echarts.init(this.$refs.turnoverTimingDtos);
        this.turnoverTimingChart.showLoading();

        this.dishesRevenueChart = echarts.init(this.$refs.dishesRevenueDtos);
        this.dishesRevenueChart.showLoading();

        this.receiptExceptionChart = echarts.init(this.$refs.receiptExceptionDtos);
        this.receiptExceptionChart.showLoading();

        this.turnoverTimingChart.setOption(this.turnoverTiming);
        this.dishesRevenueChart.setOption(this.dishesRevenue);
        this.receiptExceptionChart.setOption(this.receiptException);

        setTimeout(() => {
          this.$http.post(api.BOARD + 'detail',
            JSON.stringify(this.getParam('get')))
            .then(res => {
              console.log(res)
              let response = res.body;
              if (response.code === 0) {
                this.data.push(response.data.businessDataDto);

                // 第一张表
                for (let i = 0; i < response.data.turnoverTimingDtos.length; i++) {
                  this.turnoverTimingDtosXAxis.push(response.data.turnoverTimingDtos[i].hour);
                  this.totalActualAmout.push((Number(response.data.turnoverTimingDtos[i].totalActualAmout) / 100).toFixed(2));
                  this.totalPayAmount.push((Number(response.data.turnoverTimingDtos[i].totalPayAmount) / 100).toFixed(2));
                }
                this.turnoverTimingChart.setOption({
                  xAxis: {
                    data: this.turnoverTimingDtosXAxis
                  },
                  series: [
                    {
                      data: this.totalPayAmount
                    },
                    {
                      data: this.totalActualAmout
                    }
                  ]
                });

                this.turnoverTimingChart.hideLoading()

                // 第二张表
                for (let i = 0; i < response.data.dishesRevenueDtos.length; i++) {
//                if (i === DISHESNUM) {
                  this.dishesNameData.push(response.data.dishesRevenueDtos[i].dishesName);
                  this.dishesValueData.push({
                    value: (Number(response.data.dishesRevenueDtos[i].rate) / 100).toFixed(2),
                    name: response.data.dishesRevenueDtos[i].dishesName,
                    itemStyle: {
                      normal: {
                        color: ''
                      }
                    }
                  })
                }
                if (this.dishesValueData.length > 0) {
                  for (let i = 0; i < this.dishesValueData.length; i++) {
                    for (let k = 0; k < this.pieColor.length; k++) {
                      if (i === k) {
                        this.dishesValueData[i].itemStyle.normal.color = this.pieColor[k]
                      }
                    }
                  }
                }
                this.dishesRevenueChart.setOption({
                  legend: {
                    data: this.dishesNameData
                  },
                  series: [
                    {
                      data: this.dishesValueData
                    }
                  ]
                });

                this.dishesRevenueChart.hideLoading();

                // 第三章表
                for (let i = 0; i < response.data.receiptExceptionDtos.length; i++) {
                  this.receiptExceptionData.push(response.data.receiptExceptionDtos[i].exceptionCount);
                  this.receiptExceptionXAxis.push(response.data.receiptExceptionDtos[i].exceptionName);
                }

                this.receiptExceptionChart.setOption({
                  xAxis: {
                    data: this.receiptExceptionXAxis
                  },
                  series: [{
                    data: this.receiptExceptionData
                  }]
                });

                this.receiptExceptionChart.hideLoading()
              }
            })
            .catch(err => {
              console.log(err)
            })
        },1000)
      });
    },
    methods: {
//      getData() {
//        this.$http.post(api.BOARD + 'detail',
//          JSON.stringify(this.getParam()))
//          .then(res => {
//            console.log(res)
//            let response = res.body;
//            if (response.code === 0) {
//              this.data.push(response.data.businessDataDto);
//              this.echartsData = response.data;
////              this.getDishesRevenueData(this.echartsData.dishesRevenueDtos);
////              this.getTurnoverTimingData(this.echartsData.turnoverTimingDtos);
////              this.getDishesRevenueData(this.echartsData.dishesRevenueDtos);
////              this.getReceiptExceptionData(this.echartsData.receiptExceptionDtos);
//
//            }
//          })
//          .catch(err => {
//            console.log(err)
//          })
//      },
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
              // merchantId: 117
              merchantId: localStorage.currentMerchantId
            }
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .module-title {
    margin: 14px 0;
    .title {
      font-size: 20px;
      width: 200px;
      height: 32px;
      line-height: 32px;
      color: #1f2d3d;
      font-weight: normal;
    }
  }

  .child-wrapper {
    padding: 24px 24px 40px;
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid #d3dce6;
    .board-title {
      position: relative;
      padding-left: 16px;
      margin-top: 32px;
      z-index: 1;
      &:before {
        display: block;
        position: absolute;
        left: 0;
        top: 5px;
        content: '';
        width: 4px;
        height: 18px;
        background: #ff4949;
        z-index: 10;
      }
    }
  }
</style>
