<template>
  <div class="recharge">
    <div class="recharge-head">
      <p class="amount">{{amount}}条</p>
      <p class="amount-desc">短信余额</p>
    </div>
    <div class="recharge-content">
      <div class="section price-list">
        <p class="section-title">选择购买条数</p>
        <ul>
          <li class="price-item" v-for="it of priceList" :key="it.price" @click="clickPriceItem(it.price)" :class="{active: selectedPrice === it.price}">
            <Icon type="checkmark"></Icon>
            <p class="price">{{formatMoney(it.price, { digits: 0 })}}元</p>
            <p class="count">{{it.count}}条</p>
            <p class="present">送{{it.present}}条</p>
          </li>
        </ul>
      </div>
      <div class="section desc">
        <div>
          <p>说明：</p>
          <p>短信0.1元/条。</p>
          <p>短信账号充值无论有几个分店，充值到一个账号，几个分店共用一个帐号的余额。</p>
        </div>
        <div style="margin-top:16px;">
          <p>功能包括：</p>
          <p>1. 通知短信</p>
          <p>2. 营销短信</p>
        </div>
      </div>
      <div class="section action">
        <Button type="primary" @click="confirmPurchase">确认购买 ￥{{formatMoney(selectedPrice, { digits: 0 })}}</Button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';

const PriceList = [
  { price: 10000 /* 单位: 分 */, count: 1000, present: 100 },
  { price: 30000 /* 单位: 分 */, count: 3000, present: 500 },
  { price: 50000 /* 单位: 分 */, count: 5000, present: 1250 },
  { price: 100000 /* 单位: 分 */, count: 10000, present: 5000 }
];


/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * => 测试时设置金额都乘以 0.0001 <=
 * => 正式环境中记得注释掉下面语句 <=
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
// if (true) {
//   for (let i = 0; i < PriceList.length; i++) {
//     PriceList[i].price *= 0.01;
//     PriceList[i].count *= 0.01;
//     PriceList[i].present *= 0.01;
//     PriceList[i].present = ~~PriceList[i].present;
//   }
// }
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


export default {
  props: {
    amount: {
      default: 0
    }
  },

  data() {
    return {
      selectedPrice: PriceList[0].price,
      priceList: PriceList
    };
  },

  methods: {
    formatMoney: Tool.formatMoney,
    clickPriceItem(price) {
      this.selectedPrice = price;
    },
    confirmPurchase() {
      let priceItem = this.priceList.find(it => it.price === this.selectedPrice);
      this.$emit('purchase', this.selectedPrice, priceItem.count + priceItem.present);
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
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
        width: 232px;
        height: 154px;
        border: 1px solid #c0ccda;
        display: inline-block;
        margin-right: 32px;
        margin-bottom: 10px;
        position: relative;

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
        .price {
          font-size: 26px;
          font-weight: 600;
          text-align: center;
          color: #1f2d3d;
          margin-top: 32px;
        }
        .count {
          font-size: 18px;
          text-align: center;
          color: #8492a6;
        }
        .present {
          font-size: 18px;
          font-weight: 500;
          text-align: center;
          color: #ffffff;
          opacity: 0.3;
          background-color: #1e223e;
          width: 192px;
          height: 38px;
          line-height: 38px;
          position: absolute;
          bottom: 0;
          left: 20px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      }
      .price-item:last-child {
        margin-right: 0;
      }
      .price-item:hover,
      .price-item.active {
        cursor: pointer;
        border-color: #ff4949;
        .ivu-icon-checkmark {
          display: block;
        }
        .count {
          color: #ff4949;
        }
        .present {
          opacity: 1;
          background-color: #ff4949;
        }
      }
    }

    .payment {
      .ivu-radio-wrapper {
        font-size: 13px;
        margin-right: 32px;
        .ivu-radio {
          margin-right: 6px;
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
</style>
