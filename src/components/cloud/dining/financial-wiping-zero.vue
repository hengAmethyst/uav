<template>
  <Form class="wiping-zero" :label-width="110">
    <Form-item class="auto-wiping-zero" label="自动抹零">
      <i-switch :value="value.status" @on-change="toggle"></i-switch>
      <p>说明：开启后，会在结算时自动抹零</p>
    </Form-item>
    <Form-item class="wiping-zero-way" label="请选择抹零方式">
      <Select v-model="value.precision">
        <Option v-for="it of precision" :key="it.id" :value="it.id">抹{{it.name}}</Option>
      </Select>
    </Form-item>
    <Form-item class="action">
      <Button class="cancel">取消</Button>
      <Button type="primary" @click="submit">提交</Button>
    </Form-item>
  </Form>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';

const DiscountTypeEnum = {
  /** 自动抹零 */
  WipingZero: 1,
  /** 优惠规则设置 */
  DiscountRule: 2
};
DiscountTypeEnum[DiscountTypeEnum.WipingZero] = '自动抹零';
DiscountTypeEnum[DiscountTypeEnum.DiscountRule] = '优惠规则设置';

/** 接口地址 */
const SvcUrl = {
  DiscountInfo: API.FINANCE + 'rule/discountInfo',
  Setting: API.FINANCE + 'rule/setting',
  Switch: API.FINANCE + 'rule/switch'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiGetDiscountInfo() {
      let param = {
        merchantId: this.getMerchantId(),
        discountType: DiscountTypeEnum.WipingZero
      };
      return this.request(SvcUrl.DiscountInfo, param);
    },
    apiSetting(precision) {
      let param = {
        merchantId: this.getMerchantId(),
        discountType: DiscountTypeEnum.WipingZero,
        discountName: DiscountTypeEnum[DiscountTypeEnum.WipingZero],
        discountContentType: precision,
        discountContentName: this.percisonDict[precision]
      };
      return this.request(SvcUrl.Setting, param);
    },
    apiSwitch(status) {
      let param = {
        merchantId: this.getMerchantId(),
        discountType: DiscountTypeEnum.WipingZero,
        status
      };
      return this.request(SvcUrl.Switch, param);
    }
  }
};

export default {
  mixins: [SvcApi],

  props: {
    precision: {
      default: () => []
    }
  },

  data() {
    return {
      value: {
        precision: '', // 抹零方式
        status: false // 自动抹零
      }
    };
  },

  computed: {
    percisonDict() {
      return this.precision.reduce((dict, it) => {
        dict[it.id] = it.name;
        return dict;
      }, {});
    }
  },

  methods: {
    refresh() {
      this.apiGetDiscountInfo()
        .then(data => {
          this.value.precision = data.discountContentType;
          this.value.status = data.status === Tool.SwitchStatusEnum.On;
        });
    },
    toggle(on) {
      this.apiSwitch(on ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off)
        .then(data => {
          this.$Message.success('设置成功');
        }, err => {
          this.$Message.error(err.message);
        });
    },
    submit() {
      this.apiSetting(this.value.precision)
        .then(data => {
          this.$Message.success('设置成功');
          this.refresh()
        }).catch(err => {
          this.$Message.error(err.message);
        });
    }
  },

  created() {
    this.refresh();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.wiping-zero {
  .auto-wiping-zero {
    margin-bottom: 72px;
    .ivu-form-item-label {
      font-size: 16px;
      text-align: left;
    }
    .ivu-form-item-content {
      margin-left: 0 !important;
    }
    .ivu-switch {
      position: absolute;
      right: 0;
      top: 15px;
    }

    p {
      font-size: 14px;
      color: #99a9bf;
      position: absolute;
      left: 0;
      top: 30px;
    }
  }

  .wiping-zero-way {
    .ivu-form-item-label {
      font-size: 14px;
      text-align: left;
    }
    .ivu-select {
      width: 640px;
    }
  }

  .action {
    margin-top: 200px;
    .ivu-form-item-content {
      margin: auto !important;
      width: 300px;
    }
    .ivu-btn {
      width: 144px;
      height: 36px;
    }
  }
}
</style>
