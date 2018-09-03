<template>
  <Card class="financial-rule layout-content-main" dis-hover :bordered="false">
    <p slot="title">财务规则</p>

    <Tabs type="card" :animated="false">
      <TabPane label="支付管理">
        <FinancialPayment></FinancialPayment>
      </TabPane>

      <TabPane label="优惠规则">
        <FinancialRule :precision="precision" :handleType="handleType"></FinancialRule>
      </TabPane>

      <TabPane label="抹零设置">
        <FinancialWipingZero :precision="precision"></FinancialWipingZero>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';
import FinancialPayment from './financial-payment';
import FinancialRule from './financial-rule';
import FinancialWipingZero from './financial-wiping-zero';

/** 接口地址 */
const SvcUrl = {
  Tips: API.FINANCE + 'rule/tips'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    /**
     * 获取精度列表或折后处理列表
     * @param {TipEnum} conditionId
     */
    apiGetTips(conditionId) {
      return this.request(SvcUrl.Tips, { conditionId });
    }
  }
};

const TipEnum = {
  /** 精度圆角分 */
  Precision: 1,
  /** 请求折后处理 */
  Handle: 2
};

export default {
  mixins: [SvcApi],

  components: {
    FinancialPayment,
    FinancialRule,
    FinancialWipingZero
  },

  data() {
    return {
      // 精度枚举列表
      precision: [],
      // 折后处理列表
      handleType: []
    };
  },

  created() {
    this.apiGetTips(TipEnum.Precision)
      .then(data => this.precision = data);
    this.apiGetTips(TipEnum.Handle)
      .then(data => this.handleType = data);
  }
};
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
</style>
