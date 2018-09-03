<template>
  <Tabs class="member-list" type="card" :animated="false">
    <TabPane label="会员管理">
      <div class="table-showcase">
        <div class="query-wrapper">
          <Form class="query" :label-width="80">
            <Form-item label="姓名">
              <i-input v-model="queryName"></i-input>
            </Form-item>
            <Form-item label="手机号">
              <i-input v-model="queryPhone"></i-input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="search">搜索</Button>
            </Form-item>
          </Form>
          <div class="operation">
            <i-button class="new-btn" @click="onClickNewBtn">+新建</i-button>
            <i-button class="set-btn" @click="showSettingModal">充值设置</i-button>
          </div>
        </div>

        <div class="query-result">
          <div class="result-total">共有 {{page.totalNum}} 个相关结果</div>
          <Table ref="table" border :width="tableWidth" :columns="columns" :data="items" @on-selection-change="onSelectionChange"></Table>
          <Page :page-size="page.pageSize" :total="page.totalNum" :current="page.currentPage" @on-change="onPageChange"></Page>
          <div class="clean"></div>
        </div>
      </div>

      <Modal class="recharge-modal" title="会员充值" ok-text="提交" v-model="showingRechargeModal" @on-ok="onRechargeModalOk">
        <Form>
          <Form-item class="name" label="姓名">
            <i-input disabled :value="modalValue.name"></i-input>
          </Form-item>
          <Form-item class="phone" label="手机号码">
            <i-input disabled :value="modalValue.phone"></i-input>
          </Form-item>
          <Form-item class="balance" label="余额">
            <i-input disabled :value="formatMoney(modalValue.balance)"></i-input>
          </Form-item>
          <Form-item class="recharge-balance" label="充值金额">
            <i-input :number="true" v-model="modalValue.rechargeBalance"></i-input>
          </Form-item>
          <Form-item class="arrival-amount" label="到账金额">
            <i-input :number="true" v-model="modalValue.arrivalAmount"></i-input>
          </Form-item>
        </Form>
      </Modal>

      <Modal class="recharge-setting-modal" title="充值设置" v-model="showingSettingModal">
        <div slot="footer"></div>
        <MemberRechargeSetting ref="memberRechargeSetting"></MemberRechargeSetting>
      </Modal>
    </TabPane>
  </Tabs>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';
import MemberRechargeSetting from './member-recharge-setting';

/** 接口地址 */
const SvcUrl = {
  List: API.MEMBER + 'getMemberInfo',
  Update: API.MEMBER + 'updateMember',
  Delete: API.MEMBER + 'deleteMember',
  GetMember: API.MEMBER + 'getMemberById',
  Recharge: API.MEMBER + 'Recharge'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiReadList() {
      let param = {
        page: {
          ...this.page,
          currentResult: 1,
          totalPage: 1,
          totalResult: 1
        },
        merchantId: this.getMerchantId(),
        name: undefined,
        phone: undefined
      };
      if (this.queryName) {
        param.name = this.queryName;
      }
      if (this.queryPhone) {
        param.phone = this.queryPhone;
      }

      return this.request(SvcUrl.List, param);
    },
    apiUpdateItem(item) {
      let param = {
        merchantId: this.getMerchantId(),
        ...item
      };
      return this.request(SvcUrl.Update, param);
    },
    /**
     * 冻结
     */
    apiToggleBlock(id, status,phone) {
      let item = {
        id,
        status,
        phone
      };
      return this.apiUpdateItem(item);
    },
    apiDeleteItems(ids) {
      let param = { ids };
      return this.request(SvcUrl.Delete, param)
    },
    apiDeleteItem(id) {
      return this.apiDeleteItems([id]);
    },
    /**
     * @param {number} item.userId
     * @param {number} item.rechargeMoney
     * @param {number} item.accountMoney
     */
    apiRecharge(item) {
      let param = {
        userId:item.userId,
        merchantId: this.getMerchantId(),
        rechargeMoney: item.rechargeMoney,
        accountMoney: item.accountMoney
      };
      return this.request(SvcUrl.Recharge, param);
    },
    apiGetMember() {
      let parma = {};
      return this.request(SvcUrl.GetMember, param);
    }
  }
};

const GenderEnum = {
  Male: 1,
  Female: 0
};
GenderEnum[GenderEnum.Male] = '男';
GenderEnum[GenderEnum.Female] = '女';

const MemberSource = {
  /** 扫码注册 */
  ScanCode: 1,
  /** 云平台 */
  Cloud: 2
};
MemberSource[MemberSource.ScanCode] = '扫码注册';
MemberSource[MemberSource.Cloud] = '云平台';

export default {
  mixins: [SvcApi],

  components: {
    MemberRechargeSetting
  },

  data() {
    return {
      queryName: '',
      queryPhone: '',

      // 充值设置 Modal
      showingSettingModal: false,

      // 会员充值 Modal
      showingRechargeModal: false,
      // 会员充值 Modal 对话框绑定值
      modalValue: {
        id: 0,
        name: '',
        phone: '',
        balance: 0,
        rechargeBalance: '',
        arrivalAmount: ''
      },

      // Table 数据
      items: [],
      page: {
        totalNum: 0,
        currentPage: 1,
        pageSize: 10
      },

      // Table 选中项
      selectionItems: [],

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
          title: '会员ID',
          width: undefined,
          key: 'id'
        },
        {
          title: '姓名',
          width: undefined,
          key: 'name'
        },
        {
          title: '手机号',
          width: undefined,
          key: 'phone'
        },
        {
          title: '余额',
          width: undefined,
          render: (h, p) => Tool.formatMoney(p.row.balance)
        },
        {
          title: '会员来源',
          width: undefined,
          render: (h, p) => p.row.source === MemberSource.Cloud ? '云平台': '扫码注册'
        },
        {
          title: '性别',
          width: undefined,
          render: (h, p) => GenderEnum[p.row.sex]
        },
        {
          title: '创建时间',
          width: 160,
          render: (h, p) => Tool.formatDate(p.row.createTime)
        },
        {
          title: '操作',
          width: 205,
          fixed: undefined,
          render: (h, p) => {
            let disabled = p.row.status === Tool.SwitchStatusEnum.Off;

            let editBtn = h('Button', {
              props: {
                disabled
              },
              class: {
                'edit-btn': true
              },
              nativeOn: {
                click: () => {
                  this.$emit('edit', p.row);
                }
              }
            }, '编辑');

            let rechargeBtn = h('Button', {
              props: {
                disabled
              },
              class: {
                'recharge-btn': true
              },
              nativeOn: {
                click: () => {
                  this.modalValue = {
                    id: p.row.id,
                    name: p.row.name,
                    phone: p.row.phone,
                    balance: p.row.balance,
                    rechargeBalance: '',
                    arrivalAmount: ''
                  };
                  this.showingRechargeModal = true;
                }
              }
            }, '充值');

            let title = disabled ? '解冻' : '冻结';
            let nextStatus = disabled ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off;
            let delBtn = h('Button', {
              class: {
                'del-btn': !disabled,
                'unblock-btn': disabled
              },
              nativeOn: {
                click: () => {
                  this.$Modal.confirm({
                    title,
                    content: '此操作将' + title + '该会员，是否继续？',
                    onOk: () => {
                      this.apiToggleBlock(p.row.id, nextStatus,p.row.phone)
                        .then(data => {
                          this.$Message.success(title + '成功');
                          this.fetchList();
                        }, err => {
                          this.$Message.error(err.message);
                        });
                    }
                  });
                }
              }
            }, title);

            return h('div', [editBtn, rechargeBtn, delBtn]);
          }
        }
      ]
    };
  },

  methods: {
    formatMoney: Tool.formatMoney,
    fetchList() {
      this.apiReadList()
        .then(data => {
          this.items = data.list;
          this.page.totalNum = data.totalResult;
          this.page.currentPage = data.currentPage;
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
    showSettingModal() {
      this.showingSettingModal = true;
      this.$refs.memberRechargeSetting.init();
    },
    onClickNewBtn() {
      this.$emit('create');
    },
    onSelectionChange(selectionItems) {
      this.selectionItems = selectionItems;
    },
    onPageChange(page) {
      this.page.currentPage = page;
      this.fetchList();
    },
    /**
     * 会员充值：提交按钮
     */
    onRechargeModalOk() {
      let item = {
        userId: this.modalValue.id,
        rechargeMoney: this.modalValue.rechargeBalance * 10 * 10,
        accountMoney: this.modalValue.arrivalAmount * 10 * 10
      };
      this.apiRecharge(item)
        .then(data => {
          this.$Message.success('充值成功');
          this.fetchList();
        }, err => {
          this.$Message.error(err.message);
        });
    }
  },

  created() {
    this.search();
  },

  mounted() {
    if (window.outerWidth < 1440) {
      this.tableWidth = this.$refs.table.$el.clientWidth;
      this.columns[0].fixed = 'left';
      this.columns[8].fixed = 'right';

      this.columns[1].width = 100;
      this.columns[2].width = 120;
      this.columns[3].width = 170;
      this.columns[4].width = 120;
      this.columns[5].width = 100;
      this.columns[6].width = 100;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
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

//* 页面样式 */
.member-list {
  .query-wrapper {
    position: relative;

    .query {
      .ivu-input {
        width: 200px;
        height: 36px;
        border-radius: 2px;
        background-color: #ffffff;
        border: solid 1px #c0ccda;
      }
      .ivu-form-item {
        display: inline-block;
        .ivu-form-item-label {
          font-size: 13px;
          color: #1f2d3d;
        }
      }
    }

    .operation {
      position: absolute;
      right: 0;
      top: 0;

      .new-btn {
        width: 88px;
        height: 36px;
        border-radius: 2px;
        background-color: #20a0ff;
        font-size: 14px;
        color: #ffffff;
        margin-right: 16px;
      }
      .set-btn {
        width: 88px;
        height: 36px;
        border-radius: 2px;
        background-color: #ffffff;
        border: solid 1px #c0ccda;
        font-size: 14px;
        color: #475669;
        text-align: center;
        padding: 0;
      }
    }
  }

  .table-showcase {
    .reset-pwd-btn,
    .del-btn {
      border: solid 1px #ff4949;
      span {
        color: #ff4949;
      }
    }
    .reset-pwd-btn {
      margin-left: 50px;
    }
  }
}

.recharge-modal {
  .ivu-modal {
    .ivu-input {
      width: 234px;
      height: 36px;
    }

    .ivu-form-item {
      display: inline-block;
    }

    .name {
      .ivu-input {
        width: 480px;
      }
    }

    .phone,
    .recharge-balance {
      margin-right: 12px;
    }
  }
}

.recharge-setting-modal {
  .ivu-modal {
    width: 880px !important;
  }
}
</style>
