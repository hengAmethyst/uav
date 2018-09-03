<template>
  <Form class="discount-rule" ref="form" :model="value" :rules="rules">
    <Form-item class="switch-item" label="优惠规则">
      <i-switch v-model="value.status" @on-change="toggle"></i-switch>
      <p>说明：开启后，会在优惠后按照以下规则计算金额</p>
    </Form-item>
    <Form-item label="优惠计算精度" required prop="precision" :show-message="false">
      <Select v-model="value.precision">
        <Option v-for="it of precision" :key="it.id" :value="it.id">{{it.name}}</Option>
      </Select>
    </Form-item>
    <Form-item label="折后金额处理" required prop="handleType" :show-message="false">
      <Select v-model="value.handleType">
        <Option v-for="it of handleType" :key="it.id" :value="it.id">{{it.name}}</Option>
      </Select>
    </Form-item>
    <p>说明：只入不舍，比如收银金额计算到元，折后金额14.1元，系统自动计算为15元。</p>
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
  WipingZero: 1,
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
        discountType: DiscountTypeEnum.DiscountRule
      };
      return this.request(SvcUrl.DiscountInfo, param);
    },
    /**
     * @param {number} p.precision
     * @param {number} p.handleType
     */
    apiSetting(p) {
      let param = {
        merchantId: this.getMerchantId(),
        discountType: DiscountTypeEnum.DiscountRule,
        discountName: DiscountTypeEnum[DiscountTypeEnum.DiscountRule],
        discountContentType: p.precision,
        discountContentName: this.percisonDict[p.precision],
        handleType: p.handleType,
        handleName: this.handleTypeDict[p.handleType],
        status: p.status ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off
      };
      return this.request(SvcUrl.Setting, param);
    },
    apiSwitch(status) {
      let param = {
        merchantId: this.getMerchantId(),
        discountType: DiscountTypeEnum.DiscountRule,
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
    },
    handleType: {
      default: () => []
    }
  },

  data() {
    return {
      value: {
        status: false, // 优惠规则开启状态
        precision: '', // 优惠计算精度
        handleType: '' // 折后金额处理
      },

      rules: {
        precision: [{ required: true }],
        handleType: [{ required: true }]
      }
    };
  },

  computed: {
    percisonDict() {
      return this.precision.reduce((dict, it) => {
        dict[it.id] = it.name;
        return dict;
      }, {});
    },
    handleTypeDict() {
      return this.handleType.reduce((dict, it) => {
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
          this.value.handleType = data.handleType;
          this.value.status = data.status === Tool.SwitchStatusEnum.On;
        });
    },
    toggle(on) {
      this.apiSwitch(on ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off)
        .then(data => {
          this.$Message.success('设置成功');
        }, err => {
          this.$Message.error(err.message);
          this.value.status = !on;
        });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.apiSetting(this.value)
            .then(data => {
              this.$Message.success('设置成功');
              this.refresh();
            }).catch(err => {
              this.$Message.error(err.message);
            });
        }
      });
    }
  },

  created() {
    this.refresh();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.financial-rule {
  .discount-rule {
    .ivu-form-item {
      margin-bottom: 32px;
      .ivu-form-item-label {
        width: 100px;
      }
      .ivu-form-item-content {
        margin-left: 100px;
      }
      &.switch-item {
        display: block;
        margin-bottom: 60px;
        .ivu-form-item-label {
          text-align: left;
          font-size: 16px;
          color: #475669;
        }
        .ivu-switch {
          position: absolute;
          right: 0;
        }
        p {
          position: absolute;
          top: 30px;
          left: -100px;
        }
      }
    }
    .ivu-select {
      width: 640px;
    }
    .ivu-form-item {
      display: inline-block;
    }
    p {
      font-size: 14px;
      text-align: left;
      color: #99a9bf;
      text-align: center;
      margin-bottom: 32px;
    }
    .action {
      display: block;
      .ivu-form-item-content {
        left: 50%;
        margin-left: -130px;
        .ivu-btn {
          width: 88px;
          height: 36px;
          border-radius: 2px;
        }
        .cancel.ivu-btn {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
