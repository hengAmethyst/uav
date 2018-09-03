<template>
  <div>
    <Row class="search-condition">
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
        <!--<TimePicker type="timerange" format="HH" placeholder="选择时间" style="width: 152px"-->
                    <!--@on-change="handleTime" :editable="false" :steps="[1,15]"></TimePicker>-->
      <!--</div>-->
      <div class="condition-wrapper">
        <Input v-model="staffName" placeholder="请输入员工姓名" style="width: 200px"></Input>
      </div>
      <button class="search-btn" @click="getData">搜索</button>
    </Row>

    <Table ref="shiftTable" :width="width" :data="shiftRecordData" :columns="shiftRecordColumns" stripe></Table>
    <div style="overflow: hidden">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal class="detail-wrapper" v-model="shiftDetail" title="交接明细" width="880px">
      <Row class="base">
        <Col span="6"> 交班人:
        <span class="detail-text">{{detailData.cashierName}}</span>
        </Col>
        <Col span="18"> 当班时间:
        <span class="detail-text">{{detailData.startTime}}&nbsp;至&nbsp;{{detailData.endTime ? detailData.endTime : '-'}}</span>
        </Col>
      </Row>
      <Row class="base">
        <Col span="6"> 现金收入:
        <span class="detail-text">{{detailData.cashIn | filterMoney}}</span>
        </Col>
        <Col span="6"> 班前留底:
        <span class="detail-text">{{detailData.lastRemainMoney | filterMoney}}</span>
        </Col>
        <Col span="6"> 本班留底:
        <span class="detail-text">{{detailData.currentRemainMoney | filterMoney}}</span>
        </Col>
        <Col span="6"> 备用金额:
        <span class="detail-text">{{detailData.prepareMoney | filterMoney}}</span>
        </Col>
      </Row>
      <Row class="grey">
        <Col span="6" class="wrapper" @click.native="showRequires = true">
        <p class="desc">{{detailData.totalRequiresAmount | filterMoney}}</p>
        <h3 class="sub-title">附加费</h3>
        <i class="right-arrow">
          <Icon type="chevron-right" size="18"></Icon>
        </i>
        <div class="wrapper-content" v-if="showRequires">
          <h3 class="wrapper-content-title">附加费明细
            <i class="close" @click.stop="showRequires = false">
              <Icon type="android-close" size="20"></Icon>
            </i>
          </h3>
          <ul class="wrapper-content-list" v-if="detailData.requiresInfos.length>0">
            <li class="wrapper-content-item clearfix" v-for="item in detailData.requiresInfos">
              <span class="item-name">{{item.requiresName}}：</span>
              <span class="item-amount">{{item.requiresFee}}</span>
            </li>
          </ul>
          <p class="no-data" v-else>暂无数据</p>
          <p class="wrapper-content-foot clearfix">
            <span class="foot-name">附加费合计：</span>
            <span class="foot-amount">{{detailData.totalRequiresAmount | filterMoney}}</span>
          </p>
        </div>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.billCountInfo.checkedCount}}</p>
        <h3 class="sub-title">已结账单数</h3>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.billCountInfo.oncreditCount}}</p>
        <h3 class="sub-title">挂账单数</h3>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.billCountInfo.reverseCount}}</p>
        <h3 class="sub-title">反结账单数</h3>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.receiveDeposit | filterMoney}}</p>
        <h3 class="sub-title">收到押金</h3>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.billCountInfo.unCheckCount}}</p>
        <h3 class="sub-title">待结账单数</h3>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.billCountInfo.freeChargeCount}}</p>
        <h3 class="sub-title">免单单数</h3>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.billCountInfo.zeroClearCount}}</p>
        <h3 class="sub-title">抹零单数</h3>
        </Col>
      </Row>
      <Row class="white">
        <Col span="6">
        <p class="desc">{{detailData.totalAmount | filterMoney}}</p>
        <h3 class="sub-title">应收金额</h3>
        </Col>
        <Col span="6">
        <p class="desc" style="color:#ff4949;">{{detailData.payAmount | filterMoney}}</p>
        <h3 class="sub-title">实收金额</h3>
        </Col>
        <Col span="6" class="wrapper" @click.native="showDiscount = true">
        <p class="desc">{{detailData.discountAmount | filterMoney}}</p>
        <h3 class="sub-title">折扣金额</h3>
        <i class="right-arrow">
          <Icon type="chevron-right" size="18"></Icon>
        </i>
        <div class="wrapper-content" v-if="showDiscount">
          <h3 class="wrapper-content-title">折扣明细
            <i class="close" @click.stop="showDiscount = false">
              <Icon type="android-close" size="20"></Icon>
            </i>
          </h3>
          <ul class="wrapper-content-list" v-if="detailData.discountInfos.length>0">
            <li class="wrapper-content-item clearfix" v-for="item in detailData.discountInfos">
              <span class="item-name">{{item.discountName}}：</span>
              <span class="item-amount">{{item.discountAmount | filterMoney}}</span>
            </li>
          </ul>
          <p class="no-data" v-else>暂无数据</p>
          <p class="wrapper-content-foot clearfix">
            <span class="foot-name">折扣合计：</span>
            <span class="foot-amount">{{detailData.discountAmount | filterMoney}}</span>
          </p>
        </div>
        </Col>
        <Col span="6">
        <p class="desc">{{detailData.onCreditAmount | filterMoney}}</p>
        <h3 class="sub-title">挂账金额</h3>
        </Col>
      </Row>
      <Row v-if="detailData.billPayChannels.length>0" class="padding24" style="margin:24px 0;">
        <Col span="24">
        <Table ref="payChannel" :data="detailData.billPayChannels" :columns="payColumns" stripe></Table>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import * as api from '../../../vuex/api';

const PAGESIZE = 10;

export default {
  data() {
    return {
      staffName: null,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      period: '',
      periods: [],
      cateringType: '',
      totalResult: 0,
      currentPage: 1,
      shiftDetail: false,
      shiftRecordColumns: [
        {
          title: '交班人',
          key: 'cashierName',
          fixed: 'left',
          width: 0
        },
        {
          title: '交班时间',
          key: 'finishTime',
          width: 0,
          render: (h, params) => {
            return h('span', params.row.finishTime !== "" ? params.row.finishTime : '-')
          }
        },
        {
          title: '接班时间',
          width: 0,
          key: 'beginTime'
        },
        {
          title: '应收金额',
          width: 0,
          key: 'totalAmount',
          render: (h, params) => {
            return h('span', params.row.totalAmount || params.row.totalAmount === 0 ? '￥' + (Number(params.row.totalAmount) / 100).toFixed(2) : '-')
          }
        },
        {
          title: '实收金额',
          width: 0,
          key: 'payAmount',
          render: (h, params) => {
            return h('span', params.row.payAmount || params.row.payAmount === 0 ? '￥' + (Number(params.row.payAmount) / 100).toFixed(2) : '-')
          }
        },
        {
          title: '班前留底',
          width: 0,
          key: 'lastRemainMoney',
          render: (h, params) => {
            return h('span', params.row.lastRemainMoney || params.row.lastRemainMoney === 0 ? '￥' + (Number(params.row.lastRemainMoney) / 100).toFixed(2) : '-')
          }
        },
        {
          title: '本班留底',
          width: 0,
          key: 'currentRemainMoney',
          render: (h, params) => {
            return h('span', params.row.currentRemainMoney || params.row.currentRemainMoney === 0 ? '￥' + (Number(params.row.currentRemainMoney) / 100).toFixed(2) : '-')
          }
        },
        {
          title: '备用金额',
          width: 0,
          key: 'prepareMoney',
          render: (h, params) => {
            return h('span', params.row.prepareMoney || params.row.prepareMoney === 0 ? '￥' + (Number(params.row.prepareMoney) / 100).toFixed(2) : '-')
          }
        },
        {
          title: '操作',
          key: 'switch',
          width: 100,
          fixed:'right',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                color: '#20a0ff',
                fontSize: '13px',
                cursor: "pointer"
              },
              on: {
                click: () => {
                  this.show({
                    id: params.row.id,
                    merchantId: localStorage.currentMerchantId,
                    startDate: params.row.beginTime,
                    endDate: params.row.finishTime,
                    cashierId: params.row.cashierId,
                    cateringType: this.cateringType
                  });
                }
              }
            }, '明细>>');
          }
        }
      ],
      shiftRecordData: [],
      selected: {},
      detailData: {
        cashierName: '',
        beginTime: '',
        finishTime: '',
        cashIn: 0,
        lastRemainMoney: 0,
        currentRemainMoney: 0,
        prepareMoney: 0,
        totalRequiresAmount: 0,
        billPayChannels: [],
        billCountInfo: {
          checkedCount: 0, // 已结订单数
          oncreditCount: 0, // 挂账订单数
          reverseCount: 0, // 反结订单数
          unCheckCount: 0, // 未结订单数
          freeChargeCount: 0, // 免单数
          zeroClearCount: 0 // 抹零订单数
        },
        receiveDeposit: 0,
        totalAmount: 0,
        payAmount: 0,
        discountAmount: 0,
        onCreditAmount: 0
      },
      // payData: [],
      payColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '收款类型',
          key: 'channelName'
        },
        {
          title: '消费次数',
          key: 'payCount'
        },
        {
          title: '收款金额',
          key: 'payAmount',
          render: (h, params) => {
            return h('span', '￥' + (params.row.payAmount / 100).toFixed(2))
          }
        },
      ],
      showDiscount: false, // 展示折扣明细
      showRequires: false, // 展示附加费明细
      width:0
    }
  },
  created() {
    this.getData();
    this.periods = JSON.parse(localStorage.getItem('mealPeriods'));
  },
  mounted() {
    this.width = this.$refs.shiftTable.$el.clientWidth;
    if (window.outerWidth < 1440) {
      this.shiftRecordColumns[0].width = this.width / 6;
      this.shiftRecordColumns[1].width = this.width / 4;
      this.shiftRecordColumns[2].width = this.width / 4;
      this.shiftRecordColumns[3].width = this.width / 7;
      this.shiftRecordColumns[4].width = this.width / 7;
      this.shiftRecordColumns[5].width = this.width / 7;
      this.shiftRecordColumns[6].width = this.width / 7;
      this.shiftRecordColumns[7].width = this.width / 7;
    }
  },
  methods: {
    getData() {
      this.$http.post(api.BUSSINESS + 'shifts',
        JSON.stringify(this.getParam('get')))
        .then(res => {
          // console.log(res);
          let response = res.body;
          if (response.code === 0) {
            this.totalResult = response.data.totalResult;
            this.shiftRecordData = response.data.list;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    show(obj) {
      this.selected = obj;
      this.$http.post(api.BUSSINESS + 'shiftsDetail',
        JSON.stringify(this.getParam('detail')))
        .then(res => {
          // console.log(res);
          let response = res.body;
          if (response.code === 0) {
            if (response.data) {
              this.detailData = response.data;
            }
            this.showDiscount = false;
            this.showRequires = false;
            this.shiftDetail = true;
          } else {
            this.shiftDetail = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePage(page) {
      this.currentPage = page;
      this.getData();
    },
    handleDate(value) {
      this.startDate = value[0];
      this.endDate = value[1];
    },
    handleTime(value){
      this.startTime = value[0];
      this.endTime = value[1];
    },
    handlePeriods(value) {
      for (let i = 0; i < this.periods.length; i++) {
        if (value === this.periods[i].id) {
          this.startTime = this.periods[i].mealperiodStartTime;
          this.endTime = this.periods[i].mealperiodEndTime;
        }
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
            //              merchantId: 117,
            merchantId: localStorage.currentMerchantId,
            startDate: this.startDate,
            endDate: this.endDate,
            startTime: this.startTime,
            endTime: this.endTime,
            cashierName: this.staffName,
            cateringType: this.cateringType
          }
        }
      } else if (name === 'detail') {
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
            id: this.selected.id,
            merchantId: this.selected.merchantId,
            startDate: this.selected.startDate,
            endDate: this.selected.endDate ? this.selected.endDate : '',
            cashierId: this.selected.cashierId,
            cateringType: this.selected.cateringType
          }
        }
      }
    }
  },
  filters: {
    filterMoney(data) {
      return data || data === 0 ? '￥' + (Number(data) / 100).toFixed(2) : '-';
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.detail-wrapper {
  .detail-text {
    color: #1f2d3d;
    font-size: 14px;
  }
  .ivu-modal {
    .ivu-modal-body {
      padding: 0;
      .base {
        padding: 0 16px;
        height: 48px;
        line-height: 48px;
      }
      .grey {
        background: #f9fafc;
        .ivu-col {
          position: relative;
          padding: 22px 0;
          height: 100px;
          text-align: center;
          &:after {
            position: absolute;
            display: block;
            content: '';
            right: 0;
            top: 24px;
            width: 1px;
            height: 51px;
            background: #ebf0f6;
            z-index: 1;
          }
          .desc {
            font-size: 18px;
            color: #223040;
          }
          .sub-title {
            font-size: 14px;
            color: #223040;
            font-weight: normal;
          }
        }
      }
      .white {
        background: #fff;
        .ivu-col {
          padding: 22px 0;
          height: 100px;
          text-align: center;
          .desc {
            font-size: 18px;
            color: #223040;
          }
          .sub-title {
            font-size: 14px;
            color: #223040;
            font-weight: normal;
          }
        }
      }
      .padding24 {
        padding: 0 24px;
      }
      .wrapper {
        position: relative;
        z-index: 999;
        cursor: pointer;
        &:hover {
          border: 1px solid #20a0ff;
          .desc {
            color: #20a0ff;
          }
          .sub-title {
            color: #20a0ff;
          }
          .right-arrow {
            color: #20a0ff;
          }
        }
        .right-arrow {
          position: absolute;
          display: block;
          width: 20px;
          height: 20px;
          text-align: center;
          right: 0;
          top: 40px;
          z-index: 5;
        }
        .wrapper-content {
          position: absolute;
          right: -200px;
          top: 20px;
          box-sizing: border-box;
          width: 256px;
          padding: 14px;
          border-radius: 2px;
          background: rgba(31, 45, 61, .9);
          z-index: 10;
          .wrapper-content-title {
            margin-bottom: 20px;
            position: relative;
            font-size: 14px;
            color: #fff;
            height: 20px;
            line-height: 20px;
            text-align: left;
            z-index: 10;
            .close {
              display: block;
              position: absolute;
              width: 20px;
              height: 20px;
              right: 0;
              top: 0;
              cursor: pointer;
              text-align: right;
              z-index: 999;
            }
          }
          .wrapper-content-list {
            margin-bottom: 14px;
            border-bottom: 1px solid #fff;
            .wrapper-content-item {
              // height: 22px;
              .item-name,
              .item-amount {
                display: block;
                float: left;
                width: 50%;
                text-align: left;
                color: #fff;
                font-size: 12px;
              }
              .item-amount {
                text-align: right;
              }
            }
          }
          .no-data {
            margin-bottom: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #fff;
            text-align: center;
          }
          .wrapper-content-foot {
            .foot-name,
            .foot-amount {
              display: block;
              float: left;
              width: 50%;
              text-align: left;
              color: #fff;
              font-size: 14px;
            }
            .foot-amount {
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>
