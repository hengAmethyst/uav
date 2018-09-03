<template>
  <div class="recharge">
    <div class="recharge-head">
      <p class="amount">￥{{formatMoney(amount)}}</p>
      <p class="amount-desc">钱包余额</p>
    </div>
    <div class="recharge-content">
      <div class="section price-list">
        <p class="section-title">选择充值金额</p>
        <ul>
          <li class="price-item" v-for="price of priceList" :key="price" @click="clickPriceItem(price)" :class="{active: selectedPrice === price}">
            <Icon type="checkmark"></Icon>
            <span>￥{{formatMoney(price, {digits: 0, ensureLessThenOne: true})}}</span>
          </li>
        </ul>
      </div>
      <div class="section payment">
        <p class="section-title">选择支付方式</p>
        <RadioGroup v-model="selectedPayment">
          <Radio :label="paymentType.Weixin">微信</Radio>
          <Radio :label="paymentType.Alipay">支付宝</Radio>
        </RadioGroup>
      </div>
      <div class="section desc">
        <p>您的 “晶汉钱包” 资金可用于购买短信、会员、营销活动等</p>
      </div>
      <div class="section action">
        <Button type="primary" @click="confirmRecharge">确认充值 ￥{{formatMoney(selectedPrice, { ensureLessThenOne: true })}}</Button>
      </div>

      <Modal class="qr-code" v-model="showingQRCodeModal" :title="QRCodeModalValue.title">
        <p class="desc">钱包充值金额：
          <span class="amount">{{formatMoney(QRCodeModalValue.amount)}}元</span>
        </p>
        <div class="qr-code-img">
          <qrcanvas :options="{data:QRCodeModalValue.url,size:314}"></qrcanvas>
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import Qrcanvas from 'qrcanvas-vue';

// 单位:分
const PriceList = [
  10000,
  30000,
  50000,
  100000,
  300000,
  500000
];


/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * => 测试时设置金额都乘以 0.0001 <=
 * => 正式环境中记得注释掉下面语句 <=
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
// if (true) {
//   for (let i = 0; i < PriceList.length; i++) {
//     PriceList[i] *= 0.0001;
//   }
// }
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


const PaymentTypeEnum = {
  Alipay: 'ALI_QRCODE',
  Weixin: 'NATIVE'
};

export default {
  components: {
    Qrcanvas
  },

  props: {
    amount: {
      default: 0
    }
  },

  data() {
    return {
      priceList: PriceList,
      paymentType: PaymentTypeEnum,

      selectedPrice: PriceList[0],
      selectedPayment: '',

      showingQRCodeModal: false,
      QRCodeModalValue: {
        title: '微信扫码支付',
        amount: 0,
        url: ''
      }
    };
  },

  methods: {
    formatMoney: Tool.formatMoney,
    clickPriceItem(price) {
      this.selectedPrice = price;
    },
    confirmRecharge() {
      this.$emit('recharge', this.selectedPrice, this.selectedPayment);
    },
    showQRCode(amount, paymentType, url) {
      this.showingQRCodeModal = true;
      if (paymentType === PaymentTypeEnum.Alipay) {
        this.QRCodeModalValue.title = '支付宝扫码支付';
      } else if (paymentType === PaymentTypeEnum.Weixin) {
        this.QRCodeModalValue.title = '微信扫码支付';
      }
      this.QRCodeModalValue.amount = amount;
      this.QRCodeModalValue.url = url;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.recharge {
  .recharge-head {
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

  .recharge-content {
    margin: auto;
    max-width: 1024px;
    .section {
      margin-top: 32px;
      .section-title {
        font-size: 18px;
        color: #1f2d3d;
        margin-bottom: 16px;
      }
      .section-title::before {
        content: '';
        border-left: 4px solid #ff4949;
        padding-right: 12px;
      }
    }

    .price-list {
      .price-item {
        width: 144px;
        height: 64px;
        border: 1px solid #c0ccda;
        display: inline-block;
        margin-right: 32px;
        position: relative;
        span {
          font-size: 24px;
          line-height: 0.58;
          text-align: center;
          color: #475669;
          height: 14px;
          width: 100px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -7px;
          margin-left: -50px;
        }
        .ivu-icon-checkmark {
          display: none;
          position: absolute;
          right: 0;
          background: #fff;
          background-image: linear-gradient(45deg, #ff4949 0%, transparent 0), linear-gradient(45deg, transparent 50%, #ff4949 0);
          background-size: 24px 24px;
          height: 24px;
          width: 24px;
        }
        .ivu-icon-checkmark::before {
          position: absolute;
          top: 1px;
          right: 1px;
          color: #fff;
          font-size: 12px;
        }
      }
      .price-item:last-child {
        margin-right: 0;
      }
      .price-item:hover,
      .price-item.active {
        cursor: pointer;
        border-color: #ff4949;
        span {
          color: #ff4949;
        }
        .ivu-icon-checkmark {
          display: block;
        }
      }
    }

    .payment {
      .ivu-radio-wrapper {
        font-size: 13px;
        margin-right: 32px;
        .ivu-radio {
          margin-right: 6px;
          .ivu-radio-inner,
          .ivu-radio-input {
            width: 16px;
            height: 16px;
          }
        }
        .ivu-radio.ivu-radio-checked {
          .ivu-radio-inner {
            border-width: 5px;
          }
          .ivu-radio-inner::after {
            width: 2px;
            height: 2px;
            background-color: #fff;
          }
        }
      }
    }

    .desc {
      font-size: 13px;
      color: #8492a6;
    }

    .action {
      .ivu-btn {
        display: block;
        width: 336px;
        height: 36px;
        background-color: #ff4949;
        margin: 0 auto;
        font-size: 14px;
      }
    }
  }
}

.qr-code {
  .ivu-modal {
    width: 390px !important;
    height: 466px !important;

    .ivu-modal-header-inner {
      font-size: 16px;
    }

    .desc {
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: #223040;

      .amount {
        color: #ff4949;
      }
    }

    .qr-code-img {
      width: 314px;
      height: 314px;
      margin: auto;
    }
  }
}
</style>
