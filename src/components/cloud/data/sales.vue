<template>
  <div>
    <div class="search-condition">
      <div class="condition-wrapper">
        <span class="condition-title">日期</span>
        <DatePicker type="daterange" placeholder="选择日期" style="width: 200px;"
                    @on-change="handleDate"></DatePicker>
      </div>
      <!--<div class="condition-wrapper">-->
        <!--<span class="condition-title">时段</span>-->
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
        <!--<TimePicker type="timerange" format="HH" placeholder="选择时间" style="width: 152px"-->
                    <!--@on-change="handleTime" :editable="false" :steps="[1,15]"></TimePicker>-->
      <!--</div>-->
      <button class="search-btn" @click="getData">搜索</button>
    </div>

    <div class="tab">
      <button class="tab-item" :class="hot?'active':''" @click="showTable(1)">热销榜</button>
      <button class="tab-item" :class="poor?'active':''" @click="showTable(2)">滞销榜</button>
    </div>
    <div class="tab-content">
      <div class="content-item" v-show="hot">
        <Table ref="hotTable" :data="hotData" :columns="hotColumns" stripe></Table>
        <!--<div style="overflow: hidden">-->
        <!--<div style="float: right;">-->
        <!--<Page :total="100" :current="currentPage" @on-change="changePage"></Page>-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <div class="content-item" v-show="poor">
        <Table ref="poorTable" :data="poorData" :columns="poorColumns" stripe></Table>
        <!--<div style="overflow: hidden">-->
        <!--<div style="float: right;">-->
        <!--<Page :total="100" :current="currentPage" @on-change="changePage"></Page>-->
        <!--</div>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';

  //  const PAGESIZE = 10;

  export default {
    data() {
      return {
        hot: true,
        poor: false,
        period: '',
        periods: [],
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        hotColumns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '菜品名称',
            key: 'dishName'
          },
          {
            title: '销售量',
            key: 'salesCount',
            render: (h, params) => {
              const color = params.row.salesCountChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.salesCountChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';
              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, params.row.salesCount),
                h('Icon', {
                  props: {
                    type: params.row.salesCountChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.salesCountChangeRate ? Math.abs(Number(params.row.salesCountChangeRate) * 100).toFixed(2) + '%' : ''),
              ]);
            }
          },
          {
            title: '销售额',
            key: 'salesAmount',
            render: (h, params) => {
              const color = params.row.salesAmountChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.salesAmountChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, '￥' + (Number(params.row.salesAmount) / 100).toFixed(2)),
                h('Icon', {
                  props: {
                    type: params.row.salesAmountChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.salesAmountChangeRate ? Math.abs(Number(params.row.salesAmountChangeRate) * 100).toFixed(2) + '%' : '')
              ]);
            }
          },
          {
            title: '销售变化金额',
            key: 'salesChangeAmount',
            render: (h, params) => {
              const color = params.row.salesChangeAmount > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.salesChangeAmount > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('Icon', {
                  props: {
                    type: params.row.salesChangeAmount ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', params.row.salesChangeAmount ? Math.abs(Number(params.row.salesChangeAmount) / 100).toFixed(2) : '------')
              ])
            }
          },
          {
            title: '点选率',
            key: 'clickChooseRate',
            render: (h, params) => {
              const color = params.row.clickChooseChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.clickChooseChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, (Number(params.row.clickChooseRate) * 100).toFixed(2) + '%'),
                h('Icon', {
                  props: {
                    type: params.row.clickChooseChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.clickChooseChangeRate ? Math.abs(Number(params.row.clickChooseChangeRate) * 100).toFixed(2) + '%' : '')
              ]);
            }
          },
          {
            title: '营收占比',
            key: 'revenueRate',
            render: (h, params) => {
              const color = params.row.revenueChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.revenueChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, (Number(params.row.revenueRate) * 100).toFixed(2) + '%'),
                h('Icon', {
                  props: {
                    type: params.row.revenueChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.revenueChangeRate ? Math.abs(Number(params.row.revenueChangeRate) * 100).toFixed(2) + '%' : '')
              ]);
            }
          }
        ],
        hotData: [],
        poorColumns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '菜品名称',
            key: 'dishName'
          },
          {
            title: '销售量',
            key: 'salesCount',
            render: (h, params) => {
              const color = params.row.salesCountChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.salesCountChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';
              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, params.row.salesCount),
                h('Icon', {
                  props: {
                    type: params.row.salesCountChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.salesCountChangeRate ? Math.abs(Number(params.row.salesCountChangeRate) * 100).toFixed(2) + '%' : ''),
              ]);
            }
          },
          {
            title: '销售额',
            key: 'salesAmount',
            render: (h, params) => {
              const color = params.row.salesAmountChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.salesAmountChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, '￥' + (Number(params.row.salesAmount) / 100).toFixed(2)),
                h('Icon', {
                  props: {
                    type: params.row.salesAmountChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.salesAmountChangeRate ? Math.abs(Number(params.row.salesAmountChangeRate) * 100).toFixed(2) + '%' : '')
              ]);
            }
          },
          {
            title: '销售变化额',
            key: 'salesChangeAmount',
            render: (h, params) => {
              const color = params.row.salesChangeAmount > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.salesChangeAmount > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('Icon', {
                  props: {
                    type: params.row.salesChangeAmount ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', params.row.salesChangeAmount ? Math.abs(Number(params.row.salesChangeAmount) / 100).toFixed(2) + '%' : '------')
              ])
            }
          },
          {
            title: '点选率',
            key: 'clickChooseRate',
            render: (h, params) => {
              const color = params.row.clickChooseChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.clickChooseChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, (Number(params.row.clickChooseRate) * 100).toFixed(2) + '%'),
                h('Icon', {
                  props: {
                    type: params.row.clickChooseChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.clickChooseChangeRate ? Math.abs(Number(params.row.clickChooseChangeRate) * 100).toFixed(2) + '%' : '')
              ]);
            }
          },
          {
            title: '营收占比',
            key: 'revenueRate',
            render: (h, params) => {
              const color = params.row.revenueChangeRate > 0 ? '#20a0ff' : '#ff4949';
              const type = params.row.revenueChangeRate > 0 ? 'arrow-up-c' : 'arrow-down-c';

              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, (Number(params.row.revenueRate) * 100).toFixed(2) + '%'),
                h('Icon', {
                  props: {
                    type: params.row.revenueChangeRate ? type : '',
                    color: color,
                    size: '16'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }),
                h('span', {
                  style: {
                    color: '#99a9bf'
                  }
                }, params.row.revenueChangeRate ? Math.abs(Number(params.row.revenueChangeRate) * 100).toFixed(2) + '%' : '')
              ]);
            }
          }
        ],
        poorData: [],
//        currentPage: 1,
        type: 0 // 0为热销榜，1为滞销榜
      }
    },
    created(){
      this.getData();
      this.periods = JSON.parse(localStorage.getItem('mealPeriods'));
    },
    methods: {
      showTable(type) {
        if (type === 1) {
          this.hot = true;
          this.poor = false;
          this.type = 0;
          this.getData();
          // 重绘表格尺寸
          this.$refs.hotTable.handleResize();
        } else if (type === 2) {
          this.poor = true;
          this.hot = false;
          this.type = 1;
          this.getData();
          // 重绘表格尺寸
          this.$refs.poorTable.handleResize();
        }
      },
      changePage(page){
        this.currentPage = page;
        this.getData();
      },
      handlePeriods(value) {
        for (let i = 0; i < this.periods.length; i++) {
          if (value === this.periods[i].id) {
            this.startTime = this.periods[i].mealperiodStartTime;
            this.endTime = this.periods[i].mealperiodEndTime;
          }
        }
      },
      handleDate(value) {
        this.startDate = value[0];
        this.endDate = value[1];
      },
      handleTime(value){
        this.startTime = value[0];
        this.endTime = value[1];
      },
      getData() {
        this.$http.post(api.BUSSINESS + 'sales',
          JSON.stringify(this.getParam(this.type === 0 ? 'hot' : 'poor')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              if (this.type === 0) {
                this.hotData = response.data.dishesSalesStasticsDtos;
              } else {
                this.poorData = response.data.dishesSalesStasticsDtos;
              }
            }
          })
          .catch(err => {
              console.log(err);
            }
          )
      },
      getParam(name){
        if (name === 'hot') {
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
//              merchantId: 117,
              startDate: this.startDate,
              endDate: this.endDate,
              startTime: this.startTime,
              endTime: this.endTime,
              type: this.type
            }
          }
        } else if (name === 'poor') {
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
//              merchantId: 117,
              startDate: this.startDate,
              endDate: this.endDate,
              startTime: this.startTime,
              endTime: this.endTime,
              type: this.type
            }
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
