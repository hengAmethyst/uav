<template>
  <Card class="user-center layout-content-main" dis-hover :bordered="false">
    <p slot="title">个人中心</p>

    <Tabs v-model="currentTab" type="card" :animated="false">
      <TabPane name="UserWalletRecharge" label="钱包充值">
        <UserWalletRecharge ref="rechargePane" class="pane-content" :amount="balance" @recharge="recharge"></UserWalletRecharge>
      </TabPane>

      <TabPane name="UserSmsPurchase" label="短信购买">
        <UserSmsPurchase class="pane-content" :amount="remainingSmsAmount" @purchase="purchaseMessage"></UserSmsPurchase>
        <Modal class="not-enough-balance" v-model="showingNotEnoughBalance" title="警告" width="330">
          <div class="icon-warning">
            <Icon type="android-alert"></Icon>
          </div>
          <div>钱包余额不足，请充值后购买</div>
          <div slot="footer">
            <Button type="primary" @click="(currentTab = 'UserWalletRecharge', showingNotEnoughBalance = false)">去充值</Button>
          </div>
        </Modal>
      </TabPane>

      <TabPane name="UserWalletRechargeRecord" label="钱包充值记录">
        <UserWalletRechargeRecord class="pane-content" :records="walletRechargeRecords" :amount="rechargeRecordRawData.totalAmount"></UserWalletRechargeRecord>
      </TabPane>

      <TabPane name="UserWalletConsumeRecord" label="钱包消费记录">
        <UserWalletConsumeRecord class="pane-content" :records="walletConsumeRecords" :amount="consumeRecordRawData.totalAmount"></UserWalletConsumeRecord>
      </TabPane>

      <TabPane name="UserSmsUsageRecord" label="短信使用记录">
        <UserSmsUsageRecord class="pane-content" :amount="sentSmsAmount" :records="smsUsageRecords"></UserSmsUsageRecord>
      </TabPane>

      <TabPane name="UserPwdSetting" label="修改密码">
        <UserPwdSetting class="pane-content"></UserPwdSetting>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';
import UserPwdSetting from './user-pwd-setting';
import UserWalletRecharge from './user-wallet-recharge';
import UserSmsPurchase from './user-sms-purchase';
import UserWalletRechargeRecord from './user-wallet-recharge-record';
import UserWalletConsumeRecord from './user-wallet-consume-record';
import UserSmsUsageRecord from './user-sms-usage-record';

/** 接口地址 */
const SvcUrl = {
  Balance: API.MESSAGE_RECHARGE + 'api/pc/queryInventedAccountByMerchantId',
  WalletRecord: API.MESSAGE_RECHARGE + 'api/pc/queryTradeInfoListAccordingMonth',
  SmsUsageRecord: API.MESSAGE_RECHARGE + 'queryMessageRecordAccordingMonth',
  GenerateTrade: API.MESSAGE_RECHARGE + 'api/all/generateTradeInfoOrder',
  PayRouter: API.PAY_ROUTER
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiGetBalance() {
      let param = { merchantId: this.getMerchantId() };
      return this.request(SvcUrl.Balance, param);
    },
    apiGenerateTrade(amount, type, tradeNum) {
      let param = {
        merchantId: this.getMerchantId(),
        userAccount: this.getUserAccount(),
        tradeAmount: amount,
        tradeType: type,
        tradeNum
      };

      return this.request(SvcUrl.GenerateTrade, param);
    },
    /**
     * @param {string} orderNo
     * @param {PaymentTypeEnum} paymentType
     */
    apiCreatePayment(orderNo, paymentType) {
      let param = {
        merchantId: this.getMerchantId(),
        orderNo,
        billType: 7,
        tradeType: paymentType,
        operateSystem: 2
      };
      return this.request(SvcUrl.PayRouter, param);
    },
    /**
     * @param {TradeTypeEnum} type
     */
    apiGetWalletRecord(type) {
      let param = {
        merchantId: this.getMerchantId(),
        type,
        currentPage: 1
      };
      return this.request(SvcUrl.WalletRecord, param);
    },
    apiGetSmsUsageRecord() {
      let param = {
        merchantId: this.getMerchantId(),
        currentPage: 1
      };
      return this.request(SvcUrl.SmsUsageRecord, param);
    }
  }
};

const TradeTypeEnum = {
  /** 账户充值 */
  Recharge: 1,
  /** 短信购买 */
  BuyMessage: 2,
  /** 购买会员 */
  BuyVip: 3,
  /** 购买营销活动 */
  BuyActivity: 4
};

const PaymentTypeEnum = {
  Alipay: 'ALI_QRCODE',
  Weixin: 'NATIVE'
};

const Convertor = {
  walletRecordConvert(data) {
    let items = [];
    if (!data) {
      return items;
    }

    for (let it of data) {
      let monthItem = {
        month: it.operateMonthDate,
        amount: it.totalAmount,
        list: []
      };

      for (let record of it.records) {
        monthItem.list.push({
          day: Tool.formatMonthDay(record.operateDate),
          desc: record.account + ' ' + record.content,
          amount: record.amount
        });
      }

      items.push(monthItem);
    }

    return items;
  }
};

export default {
  mixins: [SvcApi],

  components: {
    UserPwdSetting,
    UserWalletRecharge,
    UserSmsPurchase,
    UserWalletRechargeRecord,
    UserWalletConsumeRecord,
    UserSmsUsageRecord
  },

  data() {
    return {
      currentTab: 'UserWalletRecharge',

      balance: 0,
      remainingSmsAmount: 0,
      sentSmsAmount: 0,

      showingNotEnoughBalance: false,

      rechargeRecordRawData: { list: [] },
      consumeRecordRawData: { list: [] },

      rawSmsUsageRecords: undefined
    };
  },

  computed: {
    walletRechargeRecords() {
      return Convertor.walletRecordConvert(this.rechargeRecordRawData.list);
    },
    walletConsumeRecords() {
      return Convertor.walletRecordConvert(this.consumeRecordRawData.list);
    },
    smsUsageRecords() {
      let rawItems = this.rawSmsUsageRecords;
      let items = [];
      if (!rawItems) {
        return items;
      }

      for (let rawItem of rawItems) {
        let pit = {
          month: rawItem.queryDate,
          amount: rawItem.consumeTotalAmountOneMonth,
          list: []
        }

        if (rawItem.merchantMessageList) {
          for (let it of rawItem.merchantMessageList) {
            pit.list.push({
              day: it.merchantName,
              desc: it.messageTypeName,
              amount: it.consumeMessageAmount
            })
          }
        }

        items.push(pit);
      }
      return items;
    }
  },

  methods: {
    getWalletRecord(assignName, type) {
      return this.apiGetWalletRecord(type)
        .then(data => {
          this[assignName] = data;
        }, err => {
          this[assignName] = { list: [] };
          // this.$Message.error(err.message);
        });
    },
    getSmsUsageRecord() {
      return this.apiGetSmsUsageRecord()
        .then(data => {
          this.rawSmsUsageRecords = data;
        }, err => {
          this.$Message.error(err.message);
        });
    },
    recharge(amount, paymentType) {
      return this.apiGenerateTrade(amount, TradeTypeEnum.Recharge)
        .then(trade => {
          return this.apiCreatePayment(trade.tradeCode, paymentType)
            .then(data => {
              this.$refs.rechargePane.showQRCode(amount, paymentType, data.code_url);
            });
        })
        .catch(err => {
          this.$Message.error(err.message);
        });
    },
    purchaseMessage(amount, num) {
      if (this.balance < amount) {
        this.showingNotEnoughBalance = true;
        return;
      }

      this.apiGenerateTrade(amount, TradeTypeEnum.BuyMessage, num)
        .then(trade => {
          this.refreshBalance();
          this.$Modal.success({
            title: '成功',
            content: '短信购买成功'
          });
          this.getWalletRecord('consumeRecordRawData', TradeTypeEnum.BuyMessage);
        });
    },
    refreshBalance() {
      this.apiGetBalance()
        .then(data => {
          this.balance = data.balance;
          this.remainingSmsAmount = data.remainderAmount;
          this.sentSmsAmount = data.sendedAmount;
        }, err => {
          this.$Message.error(err.message);
        });
    }
  },

  created() {
    this.refreshBalance();
    this.getWalletRecord('rechargeRecordRawData', TradeTypeEnum.Recharge);
    this.getWalletRecord('consumeRecordRawData', TradeTypeEnum.BuyMessage);
    this.getSmsUsageRecord();
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

.user-center {
  /* tab 内容 */
  .ivu-tabs-content {
    background: #fff;
    padding: 22px 24px 40px 24px;

    .pane-content {
      width: 100%;
      margin: auto;
    }

    /** 记录，包括钱包充值、钱包消费、短信使用 */
    .record {
      .record-head {
        margin-bottom: 80px;
        .amount {
          text-align: center;
          font-size: 26px;
          font-weight: 500;
          color: #ff4949;
        }
        .amount-desc {
          text-align: center;
          font-size: 16px;
          color: #223040;
        }
      }
      .record-content {
        margin: auto;
        max-width: 1024px;
        .ivu-col {
          padding: 0 18px;
          font-size: 13px;
        }
        .month {
          height: 44px;
          background-color: #e0e6ed;
          box-shadow: inset 0 -1px 0 0 #e0e6ed, inset 0 1px 0 0 #e0e6ed, inset 1px 0 0 0 #e0e6ed;
          .ivu-col {
            line-height: 44px;
          }
          .amount {
            color: #ff4949;
          }
        }
        .day {
          color: #1f2d3d;
          min-height: 46px;
          background-color: #ffffff;
          border-left: 1px solid #e0e6ed;
          border-right: 1px solid #e0e6ed;
          border-bottom: 1px solid #e0e6ed;
          .ivu-col {
            line-height: 44px;
          }
          .desc {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
}

.not-enough-balance {
  .ivu-modal-body {
    position: relative;
    margin: 0 10px;
    padding-left: 50px;
    .icon-warning {
      margin: 0 10px;
      color: #ff9900;
      font-size: 36px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .ivu-modal-footer {
    .ivu-btn {
      width: 88px;
      height: 36px;
    }
  }
}
</style>
