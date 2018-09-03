<template>
  <Card class="surcharge layout-content-main" dis-hover :bordered="false">
    <p slot="title">附加费设置</p>

    <div class="table-showcase">
      <div class="query-result">
        <div class="result-total">共有 {{page.totalNum}} 个相关结果</div>
        <div class="extra">
          <Button class="new-btn" @click="showNewModal">+新建</Button>
        </div>
        <Table ref="table" border :width="tableWidth" :columns="columns" :data="items"></Table>
        <Page :page-size="page.pageSize" :total="page.totalNum" :current="page.currentPage" @on-change="onPageChange"></Page>
        <div class="clean"></div>
      </div>
    </div>

    <Modal class="surcharge-modal" :title="value.modalTitle" v-model="showingModal" width="420">
      <Form ref="form" :model="value" :rules="rules">
        <Form-item class="name" label="附加费名称" required prop="obligatoryName">
          <Input v-model="value.obligatoryName" :readonly="!!value.remark" placeholder="请输入附加费名称"></Input>
        </Form-item>
        <Form-item class="status" label="状态" required prop="cost" :show-message="false">
          <Select v-model="value.categoryId">
            <Option v-for="(val, key) in formulaMode" v-if="handleStatusDisplay(key, value)" :value="Number(key)" :label="val" :key="key"></Option>
          </Select>
          <Input v-model="value.cost" placeholder="请输入金额">
          <span slot="append" :class="{'contain-input': value.categoryId === formulaMode.GDJE}">
            <span>{{unit}}{{value.categoryId === formulaMode.GDJE ? '/' : ''}}</span>
            <Input placeholder="单位" v-show="value.categoryId === formulaMode.GDJE" v-model="value.costCategoryName"></Input>
          </span>
          </Input>
        </Form-item>
        <Form-item class="scene" label="适用场景" required prop="scene" :show-message="true">
          <CheckboxGroup v-model="value.scene" style="margin-right: 10px;">
            <Checkbox v-for="(val, key) in sceneType" v-if="!isNaN(Number(key))" :label="Number(key)" :key="key">{{val}}</Checkbox>
          </CheckboxGroup>
        </Form-item>
        <!-- <Form-item class="on-off"> -->
        <!-- <Checkbox class="start-using" v-model="value.isStartedUsing">启用</Checkbox> -->
        <!-- <Checkbox v-model="value.isEnjoyedDiscount">参与折扣</Checkbox> -->
        <!-- </Form-item> -->
      </Form>
      <div slot="footer">
        <Button @click="showingModal=false">取消</Button>
        <Button type="primary" @click="onModalOk">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';

const OBLIGATORY_NAME_MAX_LEN = 30;

/** 接口地址 */
const SvcUrl = {
  Create: API.EXTRA_CHARGE + '/addExtraCharge',
  List: API.EXTRA_CHARGE + '/getExtraChargePage',
  Update: API.EXTRA_CHARGE + '/updateExtraCharge',
  Delete: API.EXTRA_CHARGE + '/deleteExtraCharge'
};

const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    /**
     * @param {string} item.obligatoryName
     * @param {number[]} item.scene
     * @param {FormulaModeEnum} item.categoryId
     * @param {string} item.categoryName
     * @param {number} item.cost
     * @param {string} item.costCategoryName
     * @param {SwitchStatusEnum} item.isStartedUsing
     * @param {SwitchStatusEnum} item.isEnjoyedDiscount
     */
    apiCreateItem(item) {
      let param = {
        merchantId: this.getMerchantId(),
        remark: '',
        type: 1, // 固定为 1
        ...item
      };
      return this.request(SvcUrl.Create, param);
    },
    apiReadList() {
      let param = {
        page: {
          ...this.page,
          currentResult: 1,
          totalPage: 1,
          totalResult: 1
        },
        merchantId: this.getMerchantId()
      };
      return this.request(SvcUrl.List, param);
    },
    apiUpdateItem(item) {
      let param = { merchantId: this.getMerchantId(), ...item };
      return this.request(SvcUrl.Update, param);
    },
    apiUpdateStatus(id, obligatoryName, on) {
      return this.apiUpdateItem({ id, obligatoryName, isStartedUsing: on ? 0 : 1 });
    },
    apiDeleteItem(id) {
      let param = { ids: [id] };
      return this.request(SvcUrl.Delete, param);
    }
  }
};

// 计算方式
const FormulaModeEnum = {
  /** 按订单 */
  ADD: 4,
  /** 按菜品 */
  ACP: 3,
  /** 按比例 */
  // ABL: 2,
  /** 按人数 */
  ARS: 0,
  /** 固定金额 */
  GDJE: 1
};
FormulaModeEnum[FormulaModeEnum.ADD] = '按订单';
FormulaModeEnum[FormulaModeEnum.ACP] = '按菜品';
FormulaModeEnum[FormulaModeEnum.ABL] = '按比例';
FormulaModeEnum[FormulaModeEnum.ARS] = '按人数';
FormulaModeEnum[FormulaModeEnum.GDJE] = '固定金额';

const UnitDict = {
  [FormulaModeEnum.ADD]: '元',
  [FormulaModeEnum.ACP]: '元',
  [FormulaModeEnum.ABL]: '%',
  [FormulaModeEnum.ARS]: '元/人',
  [FormulaModeEnum.GDJE]: '元'
};

// 场景
const SceneTypeEnum = {
  /** 餐厅堂食 */
  CTTS: 1,
  /** 餐厅外带 */
  CTWD: 2,
  /** 餐厅外卖 */
  CTWM: 3,
  /** 第三方外卖 */
  DSFWM: 4
};
SceneTypeEnum[SceneTypeEnum.CTTS] = '餐厅堂食';
SceneTypeEnum[SceneTypeEnum.CTWD] = '餐厅外带';
SceneTypeEnum[SceneTypeEnum.CTWM] = '餐厅外卖';
SceneTypeEnum[SceneTypeEnum.DSFWM] = '第三方外卖';

const ModalTypeEnum = {
  New: 'new',
  Edit: 'edit'
};

// 默认新建对话框中绑定的数据
const DefaultModalValue = {
  id: 0,
  modalTitle: '新建附加费',
  modalType: ModalTypeEnum.New,
  obligatoryName: '',
  /** 场景 */
  scene: [],
  categoryId: 2,
  cost: 0,
  costCategoryName: '',
  /** 启用禁用 */
  isStartedUsing: true,
  /** 参与折扣 */
  isEnjoyedDiscount: false
};

const ValueConvertor = {
  /**
   * 把服务器上的数据项转为对话框中绑定的数据
   */
  toLocal(item) {
    let value = {
      id: item.id,
      obligatoryName: item.obligatoryName,
      remark: item.remark,
      scene: item.scene,
      categoryId: item.categoryId,
      cost: item.cost || 0,
      costCategoryName: '',
      isStartedUsing: item.isStartedUsing === Tool.SwitchStatusEnum.On,
      isEnjoyedDiscount: item.isEnjoyedDiscount === Tool.SwitchStatusEnum.On
    };

    // if (value.categoryId === FormulaModeEnum.ARS || value.categoryId === FormulaModeEnum.GDJE) {
    value.cost /= 100;
    // }

    if (item.categoryId === FormulaModeEnum.GDJE) {
      value.costCategoryName = item.costCategoryName;
    }

    return value;
  },
  /**
   * 把对话框中绑定的数据转为服务器接收的数据项
   */
  toRemote(value) {
    let item = {
      obligatoryName: value.obligatoryName,
      scene: value.scene,
      categoryId: value.categoryId,
      categoryName: FormulaModeEnum[value.categoryId],
      cost: Number(value.cost),
      isStartedUsing: value.isStartedUsing ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off,
      isEnjoyedDiscount: value.isEnjoyedDiscount ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off
    };

    // if (item.categoryId === FormulaModeEnum.ARS || item.categoryId === FormulaModeEnum.GDJE) {
    item.cost *= 100;
    // }

    if (item.categoryId === FormulaModeEnum.GDJE) {
      item.costCategoryName = value.costCategoryName;
    }

    return item;
  }
};

export default {
  mixins: [SvcApi],

  data() {
    return {
      formulaMode: FormulaModeEnum,
      sceneType: SceneTypeEnum,
      showingModal: false,

      value: { ...DefaultModalValue },

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
          title: '附加费名称',
          width: undefined,
          render: (h, p) => {
            let childElements = [p.row.obligatoryName];
            if (p.row.remark) {
              let remark = h('span', { class: { remark: true } }, '（' + p.row.remark + '）');
              childElements.push(remark);
            }
            return h('span', childElements);
          }
        },
        {
          title: '收取方式',
          width: undefined,
          key: 'categoryName'
        },
        {
          title: '金额',
          width: undefined,
          render: (h, p) => {
            let cost = p.row.cost;
            // if (
            //   p.row.categoryId === FormulaModeEnum.ARS
            //   || p.row.categoryId === FormulaModeEnum.GDJE
            // ) {
            cost = Tool.formatMoney(cost);
            // }

            let unit = UnitDict[p.row.categoryId];
            if (
              p.row.categoryId === FormulaModeEnum.GDJE
              && p.row.costCategoryName
            ) {
              unit += '/' + p.row.costCategoryName;
            }

            return cost + ' ' + unit;
          }
        },
        {
          title: '适用场景',
          width: undefined,
          render: (h, p) => (p.row.scene || []).map(id => SceneTypeEnum[id] || '').join(',')
        },
        {
          title: '修改时间',
          width: 160,
          render: (h, p) => p.row.createTime && Tool.formatDate(p.row.updateTime || p.row.createTime)
        },
        {
          title: '状态',
          width: 65,
          render: (h, p) => Tool.SwitchStatusEnum[p.row.isStartedUsing]
        },
        {
          title: '操作',
          width: 150,
          fixed: undefined,
          render: (h, p) => {
            let editBtn = h('Button', {
              class: {
                'edit-btn': true
              },
              nativeOn: {
                click: () => {
                  this.showEditModal(p.row);
                }
              }
            }, '编辑');

            let enableDelBtn = !p.row.remark;
            let delBtn = h('Button', {
              class: {
                'del-btn': true,
              },
              props: { disabled: !enableDelBtn },
              nativeOn: {
                click: () => {
                  this.apiDeleteItem(p.row.id)
                    .then(data => {
                      this.$Message.success('删除成功');
                      if (this.items.length === 1 && this.page.currentPage > 1) {
                        this.page.currentPage--;
                      }
                      this.fetchList();
                    }, err => {
                      this.$Message.error(err.message);
                    });
                }
              }
            }, '删除');

            return h('div', [editBtn, delBtn]);
          }
        },
        {
          title: '状态切换',
          width: 90,
          fixed: undefined,
          render: (h, p) => {
            let isOn = p.row.isStartedUsing === Tool.SwitchStatusEnum.On;
            let options = {
              props: { value: isOn },
              on: {
                'on-change': () => {
                  this.apiUpdateStatus(p.row.id, p.row.obligatoryName, !isOn)
                    .then(data => {
                      this.fetchList();
                    }, err => {
                      this.$Message.error(err.message);
                    });
                }
              }
            }
            return h('i-switch', options);
          }
        }
      ],

      rules: {
        obligatoryName: [
          { required: true, message: ' ' },
          { max: OBLIGATORY_NAME_MAX_LEN, message: '不能超过 ' + OBLIGATORY_NAME_MAX_LEN + ' 字' }
        ],
        cost: [{ required: true, pattern: /^\d+(?:.\d*)?$/ }],
        scene: [{ required: true, type: 'array', min: 1, message: '适用场景必选' }]
      }
    };
  },

  computed: {
    unit() {
      return UnitDict[this.value.categoryId];
    }
  },

  methods: {
    handleStatusDisplay(key, value) {
      key = Number(key);
      if (isNaN(key)) {
        return false;
      }

      if (value.remark && value.obligatoryName === '餐盒费') {
        return key === FormulaModeEnum.ACP || key === FormulaModeEnum.ADD;
      } else if (key === FormulaModeEnum.ACP || key === FormulaModeEnum.ADD) {
        return false;
      }

      return true;
    },
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

    onPageChange(page) {
      this.page.currentPage = page;
      this.fetchList();
    },

    // 新建按钮弹出对话框
    showNewModal() {
      this.value = { ...DefaultModalValue };

      this.$refs.form.resetFields();
      this.showingModal = true;
    },
    // 编辑按钮弹出对话框
    showEditModal(item) {
      this.value = {
        ...ValueConvertor.toLocal(item),
        modalTitle: '编辑附加费',
        modalType: ModalTypeEnum.Edit
      };

      this.$refs.form.resetFields();
      this.showingModal = true;
    },
    onModalOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let item = ValueConvertor.toRemote(this.value);
          let promise = null;
          if (this.value.modalType === ModalTypeEnum.New) {
            promise = this.apiCreateItem(item);

          } else if (this.value.modalType === ModalTypeEnum.Edit) {
            item.id = this.value.id;
            promise = this.apiUpdateItem(item);
          }

          promise && promise
            .then(data => {
              this.showingModal = false;
              this.fetchList();
            }, err => {
              this.$Message.error(err.message);
            });
        }
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
      this.columns[7].fixed = 'right';
      this.columns[8].fixed = 'right';

      this.columns[1].width = 200;
      this.columns[2].width = 100;
      this.columns[3].width = 170;
      this.columns[4].width = 200;
    }
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
.surcharge.layout-content-main {
  .ivu-card-body {
    padding: 22px 24px 40px 24px;
  }

  .table-showcase {
    .ivu-table-cell .remark {
      font-size: 12px;
      color: #99a9bf;
    }
  }
}

//* 新建附加费 */
.surcharge-modal {
  .ivu-btn {
    width: 64px;
    height: 36px;
  }

  .ivu-form {
    .ivu-form-item-label {
      /*font-size: 14px;*/
    }
  }
  .status {
    .ivu-form-item-content {
      clear: both;
    }
    .ivu-select {
      width: 142px;
      margin-right: 4px;
    }
    .ivu-input-wrapper {
      width: 234px;
      display: inline-table;
      .ivu-input {
        height: 36px;
      }
      .ivu-input-group-append {
        width: 54px;
        height: 36px;
      }
    }
    .ivu-input-group-append {
      padding: 0;

      .contain-input {
        span {
          display: inline-block;
          width: 40px;
        }
        .ivu-input-wrapper {
          display: inline-block;
          width: 54px;

          .ivu-input {
            border-top: 0;
            border-right: 0;
            border-bottom: 0;
            height: 34px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
        }
      }
    }
  }
  .scene {
    .ivu-form-item-content {
      float: left;
    }
  }
  .on-off {
    .ivu-checkbox-wrapper {
      font-size: 14px;
      .ivu-checkbox {
        height: 16px;
        width: 16px;
      }
    }

    .start-using {
      margin-right: 60px;
    }
  }
}
</style>
