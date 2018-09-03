<template>
  <div class="order-detail">

    <div class="section product-info">
      <p class="section-title">商品信息</p>

      <Table border :columns="columns" :data="value.dishesInfos"></Table>
      <div class="total">
        <span class="total-count">商品总数: {{value.dishesInfos.reduce((t, c) => (t += c.dishCount, t), 0)}}</span>
        <span class="total-amount">合计: ￥{{formatMoney(value.dishTotalPriceAmount)}}</span>
      </div>
    </div>

    <div class="section order-info">
      <p class="section-title">订单信息</p>
      <p class="order-num">订单号：{{value.orderInfo.orderCode}}</p>

      <Row align="middle">
        <Col span="8">来源：{{value.orderInfo.channelFromName}}</Col>
        <Col span="8">订单类型：{{value.orderInfo.orderTypeName}}</Col>
        <Col span="8">订单状态：{{value.orderInfo.orderStatusName}}</Col>
      </Row>
      <Row align="middle">
        <Col span="8">会员姓名：{{value.orderInfo.memberName}}</Col>
        <Col span="8">手机号：{{value.orderInfo.memberPhone}}</Col>
        <!-- <Col span="8">客位数：{{value.orderInfo.dinnerCount}}</Col> -->
        <Col span="8">服务员：{{value.orderInfo.waiterName}}</Col>
      </Row>
      <Row align="middle">
        <Col span="8">牌号：{{value.orderInfo.brandNum}}</Col>
        <Col span="8">收银员：{{value.orderInfo.cashierName}}</Col>
        <Col span="8">订单流水号：{{value.orderInfo.serialNumber}}</Col>
      </Row>
      <Row align="middle">
        <Col span="8">下单时间：{{formatDate(value.orderInfo.createTime)}}</Col>
        <Col span="8"></Col>
        <Col span="8"></Col>
      </Row>
    </div>

    <div class="section payment-info">
      <p class="section-title">支付信息</p>

      <Row align="middle">
        <Col span="16">支付状态：{{value.orderInfo.payStatusName}}</Col>
        <Col span="8" class="discount">
        <label>优惠：</label>
        <ul v-if="value.orderInfo.discountList.length > 0">
          <li v-for="(it, index) of value.orderInfo.discountList" :key="index">{{it.discountName}}：{{formatMoney(it.discountAmount)}}</li>
        </ul>
        <span v-else>
          ¥{{formatMoney(value.orderInfo.discount)}}
        </span>
        </Col>
      </Row>
      <Row align="middle">
        <Col span="16" class="payment">
        <label>支付方式：</label>
        <ul>
          <li v-for="it of value.orderInfo.payChannels" :key="it.payChannelId">
            <i class="dot" :style="{'background-color': '#' + (~~(Math.random() * (1 << 24))).toString(16)}"></i>{{it.payChannelName}}：{{formatMoney(it.payChannelAmount)}}</li>
        </ul>
        </Col>
        <Col span="8">实收：¥{{formatMoney(value.orderInfo.payActualAmount)}}</Col>
      </Row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';

export default {
  props: {
    value: {
      default() {
        return {
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
      }
    }
  },

  data() {
    return {
      columns: [
        {
          title: '菜品',
          key: 'dishName'
        },
        {
          title: '数量',
          key: 'dishCount'
        },
        {
          title: '单价',
          render: (h, p) => Tool.formatMoney(p.row.dishPrice)
        },
        {
          title: '小计',
          render: (h, p) => Tool.formatMoney(p.row.dishPriceAmount)
        }
      ]
    };
  },

  methods: {
    formatDate: Tool.formatDate,
    formatMoney: Tool.formatMoney
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.order-detail {
  .section {
    padding: 0 40px;
    margin-top: 12px;
    .section-title {
      font-size: 18px;
      color: #1f2d3d;
      margin-bottom: 16px;
    }
    .section-title::before {
      content: "";
      border-left: 4px solid #ff4949;
      padding-right: 12px;
    }
  }

  .ivu-table {
    th {
      height: 44px;
      background-color: #e5e9f2;
    }

    td {
      height: 46px;
    }
  }
  .total {
    height: 50px;
    border: 1px solid #dddee1;
    border-top: 0;
    margin-bottom: 20px;
    span {
      font-size: 18px;
      padding: 10px 20px;
    }
    .total-count {
      float: left;
    }
    .total-amount {
      float: right;
    }
  }

  .ivu-row {
    margin: 8px 0;
    .ivu-col {
      font-size: 14px;
      color: #1f2d3d;
    }
  }

  .order-info.section {
    position: relative;
    .order-num {
      position: absolute;
      right: 40px;
      top: 0;
      font-size: 16px;
      color: #1f2d3d;
    }
  }
  .payment-info.section {
    ul {
      li {
        display: inline-block;
        margin-right: 24px;

        .dot {
          background-color: #ff4949;
          border-radius: 10px;
          display: inline-block;
          width: 5px;
          height: 5px;
          vertical-align: middle;
          margin: 0 8px 0 0;
        }
      }
    }

    .discount.ivu-col {
      label {
        float: left;
      }
      ul {
        margin-left: 40px;
      }
    }
    .payment.ivu-col {
      label {
        float: left;
      }
      ul {
        margin-left: 70px;
      }
    }
  }
}
</style>
