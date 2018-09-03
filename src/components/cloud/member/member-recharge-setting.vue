<template>
  <div class="recharge-setting">
    <div class="recharge section">
      <p>固定金额充值</p>
      <Table border :columns="columns" :data="items"></Table>
      <Button class="new-btn" :disabled="items.length >= 6 || creating" @click="create">新建</Button>
    </div>

    <div class="desc section">
      <p>充值说明</p>
      <Input type="textarea" v-model="desc" placeholder="请输入充值说明（如：充100送50、充200送100。）"></Input>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';

/** 接口地址 */
const SvcUrl = {
  List: API.MEMBER + 'getMemberRechargeSetup',
  Create: API.MEMBER + 'editMemberRechargeSetup',
  Delete: API.MEMBER + 'deleteMemberRechargeSetup'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    /**
     * @param {number} item.money
     * @param {number} item.actualMoney
     * @param {string} item.context
     */
    apiCreateItem(item) {
      let param = {
        merchantId: this.getMerchantId(),
        ...item
      };
      return this.request(SvcUrl.Create, param);
    },
    apiReadList() {
      let param = {
        merchantId: this.getMerchantId()
      };
      return this.request(SvcUrl.List, param);
    },
    apiDeleteItems(ids) {
      let param = { ids };
      return this.request(SvcUrl.Delete, param);
    },
    apiDeleteItem(id) {
      return this.apiDeleteItems([id]);
    }
  }
};

export default {
  mixins: [SvcApi],

  data() {
    return {
      desc: '',
      items: [],
      columns: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, p) => Tool.padSecond(p.index + 1)
        },
        {
          title: '收入金额充值',
          render: (h, p) => {
            let elem = Tool.formatMoney(p.row.money);

            if (p.row.editable) {
              elem = h('Input', {
                attrs: {
                  placeholder: '请输入充值金额'
                },
                props: {
                  value: Tool.formatMoney(p.row.money)
                },
                on: {
                  'on-change': e => {
                    let value = e.target.value.trim();
                    if (value !== '') {
                      let num = Number(value);
                      if (!Number.isNaN(num)) {
                        value = num;
                      }
                    }
                    if (typeof value === 'number') {
                      value *= 100;
                    }
                    this.items[p.index].money = value;
                  }
                }
              });
            }

            return elem;
          }
        },
        {
          title: '储值卡到账金额',
          render: (h, p) => {
            let elem = Tool.formatMoney(p.row.actualMoney);

            if (p.row.editable) {
              elem = h('Input', {
                attrs: {
                  placeholder: '请输入到账金额'
                },
                props: {
                  value: Tool.formatMoney(p.row.actualMoney)
                },
                on: {
                  'on-change': e => {
                    let value = e.target.value.trim();
                    if (value !== '') {
                      let num = Number(value);
                      if (!Number.isNaN(num)) {
                        value = num;
                      }
                    }
                    if (typeof value === 'number') {
                      value *= 100;
                    }
                    this.items[p.index].actualMoney = value;
                  }
                }
              });
            }

            return elem;
          }
        },
        {
          title: '操作',
          width: 100,
          render: (h, p) => {
            let elem;

            if (p.row.editable) {
              elem = h('Button', {
                class: {
                  'ok-btn': true
                },
                nativeOn: {
                  click: () => {
                    let item = {
                      money: this.items[p.index].money,
                      actualMoney: this.items[p.index].actualMoney,
                      context: this.desc
                    };
                    if (typeof item.money !== 'number') {
                      this.$Message.warning('充值金额必须为数字');
                      return;
                    }
                    if (typeof item.actualMoney !== 'number') {
                      this.$Message.warning('到账金额必须为数字');
                      return;
                    }
                    this.apiCreateItem(item)
                      .then(data => {
                        this.render();
                        this.desc = '';
                      });
                  }
                }
              }, '确认');

            } else {
              elem = h('Button', {
                class: {
                  'del-btn': true
                },
                nativeOn: {
                  click: () => {
                    this.apiDeleteItem(this.items[p.index].id)
                      .then(data => {
                        this.items.splice(p.index, 1);
                      });
                  }
                }
              }, '删除');
            }

            return elem;
          }
        }
      ]
    };
  },

  computed: {
    creating() {
      let len = this.items.length;
      if (len > 0) {
        return this.items[len - 1].editable;
      }
    }
  },

  methods: {
    init() {
      this.render();
    },
    render() {
      this.apiReadList()
        .then(data => {
          this.items = data;
        });
    },
    create() {
      this.items.push({
        editable: true
      });
      this.desc = '';
    }
  },

  created() {
    this.render();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.recharge-setting {
  padding: 0 40px;
  .section {
    p {
      height: 36px;
      line-height: 36px;
      font-size: 16px;
      color: #1f2d3d;
      margin-bottom: 12px;
    }

    p::before {
      content: '';
      border-left: 4px solid #ff4949;
      padding-right: 12px;
    }
  }

  .recharge.section {
    .ok-btn {
      width: 40px;
      height: 24px;
      padding: 0;
      background-color: #ff4949;
      font-size: 13px;
      color: #ffffff;
    }

    .del-btn {
      width: 40px;
      height: 24px;
      padding: 0;
      border: solid 1px #ff4949;
      font-size: 13px;
      color: #ff4949;
    }

    .new-btn {
      width: 88px;
      color: #fff;
      height: 36px;
      background-color: #20a0ff;
      margin-top: 16px;
      margin-bottom: 66px;
    }
    .new-btn[disabled] {
      background-color: #8bceff;
    }
  }

  .desc.section {
    .ivu-input {
      height: 159px;
    }
  }
}
</style>
