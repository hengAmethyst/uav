<template>
  <Card class="order-center layout-content-main" dis-hover :bordered="false">
    <p slot="title">订单中心</p>

    <Tabs type="card" :animated="false">
      <TabPane label="业务订单">
        <div class="table-showcase">
          <Form ref="queryForm" :model="queryValue">
            <Form-item class="row-1 order-type" label="订单类型">
              <Select v-model="queryValue.orderType">
                <Option :value="0">全部</Option>
                <Option v-for="it of orderType" :key="it.conditionId" :value="it.conditionId">{{it.conditionDes}}</Option>
              </Select>
            </Form-item>
            <Form-item class="row-1 order-source" label="订单来源">
              <Select v-model="queryValue.orderSource">
                <Option :value="0">全部</Option>
                <Option v-for="it of orderSource" :key="it.conditionId" :value="it.conditionId">{{it.conditionDes}}</Option>
              </Select>
            </Form-item>
            <Form-item class="row-1 payment-method" label="支付方式">
              <Select v-model="queryValue.paymentMethod">
                <Option :value="-1">全部</Option>
                <Option v-for="it of paymentMethod" :key="it.conditionId" :value="it.conditionId">{{it.conditionDes}}</Option>
              </Select>
            </Form-item>
            <Form-item class="row-1" label="餐段">
              <Select v-model="queryValue.mealPeriod">
                <Option value="-">全部</Option>
                <Option v-for="it of mealPeriod" :key="it.mealperiodName" :value="it.mealperiodStartTime + '-' + it.mealperiodEndTime">{{it.mealperiodName}} {{it.mealperiodStartTime}}-{{it.mealperiodEndTime}}</Option>
              </Select>
            </Form-item>
            <Form-item class="row-2 order-date" label="订单日期">
              <DatePicker class="from-date" v-model="queryValue.fromDate" type="date" :options="fromDateOption" placeholder="选择日期"></DatePicker>
              <DatePicker class="to-date" v-model="queryValue.toDate" type="date" :options="toDateOption" placeholder="选择日期"></DatePicker>
            </Form-item>
            <Form-item class="row-2 order-number" label="订单号">
              <Input v-model="queryValue.orderNo" placeholder=""></Input>
            </Form-item>
            <Form-item class="row-2 action">
              <Button type="primary" @click="search">搜索</Button>
              <Button @click="reset">重置</Button>
            </Form-item>
          </Form>

          <div class="query-result">
            <div class="result-total">共有 {{page.totalNum}} 个相关结果</div>
            <Table ref="table" border :width="tableWidth" :columns="columns" :data="items"></Table>
            <!-- <Button @click="exportExcel">导出Excel</Button> -->
            <Page :page-size="page.pageSize" :total="page.totalNum" :current="page.currentPage" @on-change="onPageChange"></Page>
            <div class="clean"></div>
          </div>
        </div>

        <Modal v-model="showingModal" title="订单详情" width="880">
          <OrderDetail :value="detailValue"></OrderDetail>
          <div slot="footer"></div>
        </Modal>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';
import OrderDetail from './detail';

/** 接口地址 */
const SvcUrl = {
  List: API.ORDER + 'list',
  Detail: API.ORDER + 'orderDetail',
  ExportExcel: API.ORDER + 'orderExcel',
  GetCondition: API.ORDER + 'orderCondition',
  MealPeriod: API.MEAL_PERIOD
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    /**
     * @param {ConditionTypeEnum} type
     */
    apiGetCondition(type) {
      let param = {
        merchantId: this.getMerchantId(),
        conditionId: type
      };
      return this.request(SvcUrl.GetCondition, param);
    },
    apiReadList(query) {
      let param = {
        page: {
          ...this.page,
          currentResult: 1,
          totalPage: 1,
          totalResult: 1
        },
        merchantId: this.getMerchantId(),
        orderChannelId: query.orderSource || undefined,
        orderTypeId: query.orderType || undefined,
        payChannelId: query.paymentMethod >= 0 ? query.paymentMethod : undefined,
        startDate: Tool.formatDate(query.fromDate, { yyyyMMDD: true }) || undefined,
        endDate: Tool.formatDate(query.toDate, { yyyyMMDD: true }) || undefined,
        startTime: undefined,
        endTime: undefined,
        orderCode: query.orderNo || undefined
      };
      if (query.mealPeriod && query.mealPeriod !== '-') {
        let arr = query.mealPeriod.split('-');
        param.startTime = arr[0];
        param.endTime = arr[1];
      }
      return this.request(SvcUrl.List, param);
    },
    apiReadItem(id) {
      let param = { orderId: id };
      return this.request(SvcUrl.Detail, param);
    },
    /**
     * @param {MealPeriodTypeEnum} type
     */
    apiGetMealPeriod(type) {
      let param = {
        merchantId: this.getMerchantId(),
        mealPeriodType: type
      };
      return this.request(SvcUrl.MealPeriod, param);
    }
  }
};

const ConditionTypeEnum = {
  /** 订单类型 */
  OrderType: 1,
  /** 订单来源 */
  OrderSource: 2,
  /** 支付方式 */
  PaymentMethod: 3
};

const MealPeriodTypeEnum = {
  /** 正餐 */
  Dinner: 0,
  /** 快餐 */
  Snack: 1
};

const DefaultDetailValue = {
  dishAmount: 0,
  dishTotalPriceAmount: 0,
  dishesInfos: [],
  orderInfo: {
    orderCode: '',
    channelFromName: '',
    orderTypeName: '',
    orderStatusName: '',
    memberName: '',
    memberPhone: '',
    dinnerCount: 0,
    brandNum: '',
    cashierName: '',
    waiterName: '',
    serialNumber: '',
    updateTime: 0,
    payStatusName: '',
    payActualAmount: 0,
    discountList: [],
    payChannels: []
  }
};

const DateShortcuts = [
  {
    text: '今天',
    value() {
      return new Date();
    }
  },
  {
    text: '昨天',
    value() {
      return new Date(Date.now() - 3600 * 24 * 1000);
    }
  },
  {
    text: '一周前',
    value() {
      return new Date(Date.now() - 3600 * 24 * 1000 * 7);
    }
  }
];

export default {
  mixins: [SvcApi],

  components: {
    OrderDetail
  },

  data() {
    return {
      orderType: [],
      orderSource: [],
      paymentMethod: [],
      mealPeriod: [],

      fromDateOption: {
        shortcuts: DateShortcuts,
        disabledDate: (date) => {
          if (!this.queryValue.toDate) {
            return false;
          }

          if (date <= this.queryValue.toDate) {
            return false;
          }

          return true;
        }
      },
      toDateOption: {
        shortcuts: DateShortcuts,
        disabledDate: (date) => {
          if (!this.queryValue.fromDate) {
            return false;
          }

          if (date >= this.queryValue.fromDate) {
            return false;
          }

          return true;
        }
      },

      showingModal: false,
      detailValue: { ...DefaultDetailValue },

      queryValue: {
        orderType: 0,
        orderSource: 0,
        paymentMethod: -1,
        mealPeriod: '-',
        fromDate: null,
        toDate: null,
        orderNo: null
      },

      // Table 数据
      items: [],
      page: {
        totalNum: 0,
        currentPage: 1,
        pageSize: 10
      },

      // Table 定义
      tableWidth: undefined,
      columns: [
        {
          title: '序号',
          width: 65,
          align: 'center',
          fixed: undefined,
          render: (h, p) => Tool.padSecond(p.index + 1)
        },
        {
          title: '订单号',
          width: 250,
          key: 'orderCode'
        },
        {
          title: '流水号',
          width: undefined,
          key: 'serialNumber'
        },
        {
          title: '实付金额',
          width: undefined,
          render: (h, p) => Tool.formatMoney(p.row.payActualAmount)
        },
        {
          title: '订单类型',
          width: undefined,
          key: 'orderTypeName'
        },
        {
          title: '订单来源',
          width: undefined,
          key: 'channelFromName'
        },
        {
          title: '支付方式',
          width: undefined,
          key: 'channelName'
        },
        {
          title: '订单状态',
          width: undefined,
          key: 'orderStatusName'
        },
        {
          title: '支付状态',
          width: undefined,
          key: 'payStatusName'
        },
        {
          title: '订单时间',
          width: 160,
          render: (h, p) => Tool.formatDate(p.row.updateTime)
        },
        {
          title: '操作',
          width: 80,
          fixed: undefined,
          render: (h, p) => {
            return h('Button', {
              nativeOn: {
                click: () => this.viewDetail(p.row.orderId)
              }
            }, '查看');
          }
        }
      ]
    }
  },

  methods: {
    fetchList() {
      this.apiReadList(this.queryValue)
        .then(data => {
          this.items = data.list;
          this.page.totalNum = data.totalResult;
          this.page.currentPage = data.currentPage;
          if (!this.items.length) {
            this.$Message.info('无符合条件的订单');
          }
        }, err => {
          this.items = [];
          this.page.totalNum = 0;
          this.page.currentPage = 1;
          // this.$Message.error(err.message);
        });
    },
    search() {
      this.page.currentPage = 1;
      this.fetchList();
    },
    reset() {
      this.queryValue = {
        orderType: null,
        orderSource: null,
        paymentMethod: null,
        mealPeriod: null,
        fromDate: null,
        toDate: null,
        orderNo: null
      };
      this.fetchList();
    },
    viewDetail(orderId) {
      this.showingModal = true;
      this.detailValue = { ...DefaultDetailValue };
      this.apiReadItem(orderId)
        .then(data => {
          this.detailValue = data;
        });
    },
    onPageChange(page) {
      this.page.currentPage = page;
      this.fetchList();
    },

    exportExcel() {
      this.$refs.table.exportCsv({
        filename: '订单列表',
        columns: this.columns.filter((col, index) => index < 10),
        data: this.items
      });
    }
  },

  created() {
    this.apiGetCondition(ConditionTypeEnum.OrderType)
      .then(data => this.orderType = data);
    this.apiGetCondition(ConditionTypeEnum.OrderSource)
      .then(data => this.orderSource = data);
    this.apiGetCondition(ConditionTypeEnum.PaymentMethod)
      .then(data => this.paymentMethod = data);
    this.apiGetMealPeriod(MealPeriodTypeEnum.Snack)
      .then(data => this.mealPeriod = data.mealPeriods);

    this.search();
  },

  mounted() {
    if (window.outerWidth < 1440) {
      this.tableWidth = this.$refs.table.$el.clientWidth;
      this.columns[0].fixed = 'left';
      this.columns[10].fixed = 'right';

      this.columns[2].width = 100;
      this.columns[3].width = 100;
      this.columns[4].width = 100;
      this.columns[5].width = 150;
      this.columns[6].width = 100;
      this.columns[7].width = 100;
      this.columns[8].width = 100;
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
//* 通用：页面内容布局 */
.layout-content-main {
  background: none;

  .ivu-btn,
  .ivu-select,
  .ivu-input {
    height: 36px;
  }

  /* 页面 title */
  .ivu-card-head {
    padding: 18px 0;
    p {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: #1f2d3d;
    }
  }

  /* 页面内容 */
  .ivu-card-body {
    padding: 0;
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    border: solid 1px #d3dce6;
  }
}

//* 通用：Tabs 控件样式 */
.layout-content-main .ivu-tabs {
  /* tab 样式 */
  .ivu-tabs-bar {
    margin-bottom: 0;
    background-color: #eff2f7;

    .ivu-tabs-nav-container {
      height: 42px;

      .ivu-tabs-tab {
        height: 41px;
        width: auto;
        padding: 5px 16px 4px;
        border-top: 0;
        border-left: 1px solid #eff2f7;
        border-right: 1px solid #eff2f7;
        margin: 0 0 0 -1px;
        line-height: 32px;
        background-color: #eff2f7;
      }

      .ivu-tabs-tab.ivu-tabs-tab-active {
        height: 42px;
        padding-right: 15px;
        border-left: 1px solid #d3dce6;
        border-right: 1px solid #d3dce6;
        margin-right: 1px;
        background-color: #fff;
      }
    }
  }

  /* tab 内容 */
  .ivu-tabs-content {
    background: #fff;
    padding: 22px 24px 40px 24px;
    .ivu-tabs-tabpane {
      padding: 0 !important;
    }
  }
}

//* 通用：表格数据展示 */
.table-showcase {
  /* 查询内容 */
  .query-result {
    position: relative;

    .clean {
      clear: both;
    }

    /* 查询结果数量 */
    .result-total {
      font-size: 14px;
      line-height: 30px;
      margin: 12px 0 16px 0;
    }

    /* 查询结果数量右边额外元素 */
    .extra {
      position: absolute;
      right: 0;
      top: -3px;

      .new-btn {
        width: 88px;
        height: 36px;
        background-color: #20a0ff;
        span {
          font-size: 14px;
          color: #ffffff;
        }
      }
      .new-btn:hover {
        border-color: #20a0ff;
      }
    }

    /* 查询结果 table */
    .ivu-table-wrapper {
      margin-bottom: 23px;

      .ivu-table {
        font-size: 13px;
      }

      /* table 内查看按钮 */
      .ivu-btn {
        min-width: 40px;
        height: 24px;
        border-radius: 2px;
        border: solid 1px #20a0ff;
        padding: 0 6px;
        margin-right: 16px;

        span {
          width: 27px;
          height: 16px;
          font-size: 13px;
          color: #20a0ff;
        }
      }

      .ivu-btn:disabled {
        border: solid 1px #e0e6ed;
        span {
          color: #c0ccda;
        }
      }

      .del-btn {
        border-color: #ff4949;
        span {
          color: #ff4949;
        }
      }

      th {
        background-color: #e5e9f2;
        box-shadow: inset 0 -1px 0 0 #e0e6ed, inset 0 1px 0 0 #e0e6ed;
      }

      td {
        border-right: none;
      }
    }

    /* 分页 */
    .ivu-page {
      margin: 10px 0;
      float: right;
    }
  }
}

//* 表格数据展示的查询条件 */
.order-center .table-showcase .ivu-form {
  .ivu-form-item {
    margin-bottom: 0;
    .ivu-form-item-label {
      width: 92px;
    }
    .ivu-form-item-content {
      margin-left: 92px;
    }
  }
  .ivu-select {
    width: 240px;
    .ivu-select-selection {
      height: 36px;
      .ivu-select-placeholder,
      .ivu-select-selected-value {
        height: 34px;
        line-height: 34px;
        font-size: 14px;
      }
    }
    .ivu-select-dropdown-list {
      .ivu-select-item {
        font-size: 14px !important;
        height: 36px;
        line-height: 36px;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }
  .ivu-date-picker {
    width: 300px;
    .ivu-input {
      height: 36px;
    }
  }
  .row-1,
  .row-2 {
    display: inline-block;
    margin-bottom: 14px;
  }
  .order-type {
    margin-right: 40px;
  }
  .order-source {
    margin-right: 24px;
  }
  .payment-method {
    clear: both;
  }
  .order-date {
    margin-right: 24px;
    .from-date {
      margin-right: 12px;
    }
  }
  .order-number {
    margin-right: 24px;
    .ivu-input {
      width: 540px;
    }
  }
  .action {
    float: right;
    .ivu-form-item-content {
      z-index: 100;
      margin-left: 0;
    }
    .ivu-btn {
      width: 88px;
      height: 36px;
    }
  }
}
</style>
