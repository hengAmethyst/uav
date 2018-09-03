<template>
  <div class="table-showcase dishes-library">
    <div class="form-wrapper">
      <Form :label-width="80">
        <Form-item label="菜品名称">
          <Input v-model="query.name" placeholder="请输入菜品名称"></Input>
        </Form-item>
        <Form-item label="菜品编号">
          <Input v-model="query.code" placeholder="请输入菜品编号"></Input>
        </Form-item>
        <Form-item class="search-item">
          <Button @click="search">搜索</Button>
        </Form-item>
      </Form>
      <div class="extra-item">
        <Button class="new-btn" @click="showNewDetailModal">+新建</Button>
        <Button class="handle-btn" @click="showSelectStoreModal">将菜品应用到门店</Button>
      </div>
    </div>

    <div class="query-result">
      <div class="result-total">共有 {{page.totalNum}} 个相关结果</div>
      <Table ref="table" border :width="tableWidth" :columns="columns" :data="items" @on-selection-change="onSelectionChange"></Table>
      <Button @click="batchDelete" :disabled="selection.length === 0">批量删除({{selection.length}})</Button>
      <Page :page-size="page.pageSize" :total="page.totalNum" :current="page.currentPage" @on-change="onPageChange"></Page>
      <div class="clean"></div>
    </div>

    <Modal class="select-store-modal" v-model="showingSelectStoreModal" title="选择要应用的门店" width="880" @on-ok="onSelectStoreModalOk">
      <p><Icon type="information-circled"></Icon>&nbsp;提示：此操作会替换掉所选门店中与菜品库重复的菜品</p>
      <p><Icon type="information-circled"></Icon>&nbsp;提示：导入分店的菜品不能马上使用，需要去“分店菜品”中为导入的菜品选择分类后才可使用。</p>
      <div class="selection">
        <Checkbox v-model="allStoresSelected" @on-change="selectAllStores">全选</Checkbox>
        <CheckboxGroup v-model="boundStores" @on-change="onSelectStoreChange">
          <Checkbox v-for="it of stores" :label="it.id" :key="it.id">{{it.name}}</Checkbox>
        </CheckboxGroup>
      </div>
    </Modal>

    <Modal v-model="showingDetailModal" :scrollable="false" :title="detailModalTitle" width="880">
      <DishesLibraryDetail ref="detail" :dictionaries="dictionaries" :cuisine="cuisine" :spicyDegree="spicyDegree" :sideDishes="sideDishes" @data-change="onDetailDataChange" @cancel="showingDetailModal = false" @ok="onDetailOk" @on-cancel="fetchList"></DishesLibraryDetail>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';
import DishesLibraryDetail from './dishes-library-detail';

/** 接口地址 */
const SvcUrl = {
  GetDishList: API.BRAND + '/getBrandDishList',
  BatchDeleteDishes: API.BRAND + '/batchDeleteBrandDishes',
  ToggleOnShelf: API.BRAND + '/api/pc/updateBrandDishIsOnShelf',
  CopyBrandDishesToMcnt: API.BRAND + '/copyBrandDishesToMcnt',
  GetSideDishesList: API.BRAND + '/getBrandSideDishesList',
  GetBrandAllMcntList: API.BRAND + '/getBrandAllMcntList',
  UpdateDishesIndex: API.BRAND + '/api/pc/batchUpdateDishesDispIndex'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiGetDishList(query) {
      let param = {
        page: {
          ...this.page,
          currentResult: 1,
          totalPage: 1,
          totalResult: 1
        },
        merchantId: this.getMerchantId(),
        brandId: this.getBrandId(),
        name: query.name,
        code: query.code,
        categoryId: query.categoryId || ''
      };
      return this.request(SvcUrl.GetDishList, param);
    },
    apiBatchDeleteDishes(items) {
      let param = {
        brandId: this.getBrandId(),
        dishesInfoList: items
      };
      return this.request(SvcUrl.BatchDeleteDishes, param);
    },
    /**
     * @param {number} item.id
     * @param {number} item.brandDishesVersion
     */
    apiDeleteDish(item) {
      return this.apiBatchDeleteDishes([item]);
    },
    /**
     * @param {number} item.id
     * @param {number} item.brandDishesVersion
     * @param {boolean} on
     */
    apiToggleOnShelf(item) {
      let param = {
        brandId: this.getBrandId(),
        dishesId: item.id,
        brandDishesVersion: item.brandDishesVersion,
        isOnShelf: item.on
          ? Tool.SwitchStatusEnum.On
          : Tool.SwitchStatusEnum.Off
      };
      return this.request(SvcUrl.ToggleOnShelf, param);
    },
    apiCopyBrandDishesToMcnt(mcntIds) {
      let param = {
        brandId: this.getBrandId(),
        mcntIds
      };
      return this.request(SvcUrl.CopyBrandDishesToMcnt, param);
    },
    apiGetBrandAllMcntList() {
      let param = {
        brandId: this.getBrandId()
      };
      return this.request(SvcUrl.GetBrandAllMcntList, param);
    },
    apiGetSideDishesList() {
      let param = {
        brandId: this.getBrandId()
      };
      return this.request(SvcUrl.GetSideDishesList, param);
    },
    apiUpdateDishesIndex(dishesId, offsetIndex, brandDishesVersion) {
      let param = {
        brandId: this.getBrandId(),
        dishesId,
        offsetIndex,
        brandDishesVersion
      };
      return this.request(SvcUrl.UpdateDishesIndex, param);
    }
  }
};

export default {
  mixins: [SvcApi],

  components: {
    DishesLibraryDetail
  },

  props: {
    // 菜系
    cuisine: {
      default: () => []
    },
    // 辣度
    spicyDegree: {
      default: () => []
    },
    // 菜品属性
    dictionaries: {
      default: () => []
    }
  },

  data() {
    return {
      detailDataChanged: false,

      // 配菜
      sideDishes: [],

      query: {
        categoryId: 0,
        name: '',
        code: ''
      },

      // 选择要应用的门店
      showingSelectStoreModal: false,
      // 所有门店
      stores: [],
      boundStores: [],
      allStoresSelected: false, // 是否勾选全部

      // 新建和编辑
      showingDetailModal: false,
      detailModalTitle: '菜品资料新建',

      // Table 数据
      items: [],
      page: {
        totalNum: 0,
        currentPage: 1,
        pageSize: 10
      },
      selection: [],

      // Table 定义
      tableWidth: undefined,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: undefined
        },
        {
          title: '菜品品名',
          width: undefined,
          key: 'name'
        },
        {
          title: '编号',
          width: undefined,
          key: 'code'
        },
        {
          title: '价格',
          width: undefined,
          render: (h, p) => Tool.formatMoney(p.row.price)
        },
        {
          title: '会员价',
          width: undefined,
          render: (h, p) => Tool.formatMoney(p.row.memberPrice)
        },
        {
          title: '创建时间',
          width: 160,
          render: (h, p) => Tool.formatDate(p.row.createTime)
        },
        {
          title: '创建人',
          width: undefined,
          key: 'createName'
        },
        {
          title: '状态',
          width: 70,
          render: (h, p) => Tool.SwitchStatusEnum[p.row.isOnShelf]
        },
        {
          title: '排序',
          width: 70,
          fixed: undefined,
          render: (h, p) => {
            return h('Button', {
              class: {
                'top-btn': true
              },
              on: {
                click: () => {
                  this.apiUpdateDishesIndex(p.row.id, 10, p.row.brandDishesVersion)
                    .then(() => {
                      this.fetchList();
                    });
                }
              }
            }, '置顶');
          }
        },
        {
          title: '操作',
          width: 135,
          fixed: undefined,
          render: (h, p) => {
            let editBtn = h(
              'Button',
              {
                class: {
                  'edit-btn': true
                },
                nativeOn: {
                  click: () => {
                    this.showEditDetailModal(p.row);
                  }
                }
              },
              '编辑'
            );

            let delBtn = h(
              'Button',
              {
                class: {
                  'del-btn': true
                },
                nativeOn: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '删除',
                      content: '此操作将删除该菜品，是否继续？',
                      okText: '是',
                      cancelText: '否',
                      onOk: () => {
                        let item = {
                          id: p.row.id,
                          brandDishesVersion: p.row.brandDishesVersion
                        };
                        this.apiDeleteDish(item).then(
                          data => {
                            this.$Message.success('删除成功');
                            if (
                              this.items.length === 1 &&
                              this.page.currentPage > 1
                            ) {
                              this.page.currentPage--;
                            }
                            this.fetchList();
                            this.refreshSideDishesList();
                          },
                          err => {
                            this.$Message.error(err.message);
                          }
                        );
                      }
                    });
                  }
                }
              },
              '删除'
            );

            return h('div', [editBtn, delBtn]);
          }
        },
        {
          title: '状态切换',
          width: 90,
          fixed: undefined,
          render: (h, p) => {
            return h('i-switch', {
              props: {
                value: p.row.isOnShelf === Tool.SwitchStatusEnum.On
              },
              on: {
                'on-change': on => this.switchStatus(on, p.row, p.index)
              }
            });
          }
        }
      ]
    };
  },

  watch: {
    showingDetailModal(val, oldVal) {
      if (val) {
        this.detailDataChanged = false;
      } else if (this.detailDataChanged) {
        this.detailDataChanged = false;
        this.fetchList();
      }
    }
  },

  methods: {
    fetchList() {
      this.apiGetDishList(this.query).then(
        data => {
          this.items = data.list;
          this.page.totalNum = data.totalResult;
          this.page.currentPage = data.currentPage;
        },
        err => {
          this.items = [];
          this.page.totalNum = 0;
          this.page.currentPage = 1;
          // this.$Message.error(err.message);
        }
      );
    },
    search() {
      this.page.currentPage = 1;
      return this.fetchList();
    },
    switchStatus(on, row, index) {
      this.items[index].isOnShelf = on ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off;
      let onOk = () => {
        let item = {
          id: row.id,
          brandDishesVersion: row.brandDishesVersion,
          on
        };
        this.apiToggleOnShelf(item)
          .then(data => {
            this.$Message.success('状态切换成功');
            this.fetchList();
            this.refreshSideDishesList();
          }, err => {
            this.$Message.error(err.message);
          });
      };
      if (on) {
        onOk();
      } else {
        this.$Modal.confirm({
          title: '停用',
          content: '此操作将停用该菜品，是否继续？',
          onOk,
          onCancel: () => {
            this.items[index].isOnShelf = on ? Tool.SwitchStatusEnum.Off : Tool.SwitchStatusEnum.On;
          }
        });
      }
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    batchDelete() {
      if (!this.selection.length) {
        return;
      }
      this.$Modal.confirm({
        title: '批量删除',
        content: '此操作将批量删除选中的项，是否继续？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          let items = this.selection.map(it => ({
            id: it.id,
            brandDishesVersion: it.brandDishesVersion
          }));
          this.selection = [];
          this.apiBatchDeleteDishes(items).then(
            data => {
              this.$Message.success('批量删除成功');
              this.fetchList();
              this.refreshSideDishesList();
            },
            err => {
              this.$Message.error(err.message);
            }
          );
        }
      });
    },
    onPageChange(page) {
      this.page.currentPage = page;
      this.fetchList();
    },

    showSelectStoreModal() {
      this.showingSelectStoreModal = true;
    },
    onSelectStoreModalOk() {
      if (this.boundStores.length) {
        this.apiCopyBrandDishesToMcnt(this.boundStores)
          .then(data => {
            this.$Modal.success({
              title: '成功',
              content: '已成功将所选菜品应用到门店'
            });
            this.$emit('copy-dishes-to-merchant-success');
          }, err => {
            this.$Message.error(err.message);
          });
      }

      this.boundStores = [];
    },
    selectAllStores(selected) {
      if (selected) {
        this.boundStores = this.stores.map(it => it.id);
      } else {
        this.boundStores = [];
      }
    },
    onSelectStoreChange() {
      this.allStoresSelected = this.boundStores.length === this.stores.length;
    },

    showNewDetailModal() {
      this.$refs.detail.create();
      this.showingDetailModal = true;
    },
    showEditDetailModal(item) {
      this.$refs.detail.modify(item);
      this.showingDetailModal = true;
    },
    onDetailOk() {
      this.showingDetailModal = false;
      this.refreshSideDishesList();
    },
    onDetailDataChange() {
      this.detailDataChanged = true;
    },

    refreshSideDishesList() {
      return this.apiGetSideDishesList().then(data => {
        if (data) {
          data.forEach(it => (it.enabled = true));
          this.sideDishes = data;
        }
      });
    }
  },

  created() {
    this.search();
    this.apiGetBrandAllMcntList().then(data => {
      this.stores = data;
    });
    this.refreshSideDishesList();
  },

  mounted() {
    if (window.outerWidth < 1440) {
      this.tableWidth = this.$refs.table.$el.clientWidth;
      this.columns[0].fixed = 'left';
      this.columns[8].fixed = 'right';
      this.columns[9].fixed = 'right';
      this.columns[10].fixed = 'right';

      this.columns[1].width = 100;
      this.columns[2].width = 120;
      this.columns[3].width = 100;
      this.columns[4].width = 100;
      this.columns[6].width = 100;
      this.columns[6].width = 100;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
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
.dishes-library.table-showcase {
  .ivu-select,
  .ivu-input {
    height: 36px;
    width: 240px;
  }

  .form-wrapper {
    position: relative;
    .ivu-form {
      margin-right: 220px;
      .ivu-form-item {
        display: inline-block;
      }

      .ivu-btn {
        width: 88px;
        height: 36px;
      }

      .search-item {
        .ivu-form-item-content {
          margin-left: 10px !important;
        }
        .ivu-btn {
          background-color: #ff4949;
          font-size: 14px;
          color: #fff;
        }
      }
    }

    .extra-item {
      position: absolute;
      right: 0;
      top: 0;
      .new-btn {
        background-color: #20a0ff;
        font-size: 14px;
        color: #fff;
      }
      .handle-btn {
        width: 144px;
        border: solid 1px #20a0ff;
        font-size: 14px;
        color: #20a0ff;
      }
    }
  }

  .query-result .ivu-table-wrapper {
    .down-btn,
    .del-btn {
      margin-right: 0;
    }

    .top-btn {
      border-color: #ff4949;
      span {
        color: #ff4949;
      }
    }
  }
}

.select-store-modal {
  p {
    width: 880px;
    height: 36px;
    background-color: #ea5853;
    font-size: 14px;
    font-weight: 600;
    line-height: 36px;
    color: #fff;
    padding: 0 16px;
    margin-left: -16px;
    margin-bottom: 3px;
  }
  .selection {
    margin-top: 32px;
  }
}
</style>
