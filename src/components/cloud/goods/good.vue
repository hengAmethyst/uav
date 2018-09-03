<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">商品管理</h2>
    </div>
    <Tabs v-model="currentTab" type="card" :animated="false">
      <TabPane label="分类管理">
        <result-newly @categories-changed="refreshCategories"></result-newly>
      </TabPane>
      <TabPane label="菜品库">
        <DishesLibrary :dictionaries="dictionaries" :cuisine="cuisine" :spicyDegree="spicyDegree"
                       @copy-dishes-to-merchant-success="copyDishesToMerchantSuccess"></DishesLibrary>
      </TabPane>
      <TabPane label="分店菜品">
        <StoreDishes ref="storeDishes" :dictionaries="dictionaries" :categories="categories" :cuisine="cuisine"
                     :spicyDegree="spicyDegree" @goto-dishes-library="currentTab = 1"></StoreDishes>
      </TabPane>
      <TabPane label="字典设置">
        <dictionaries-set></dictionaries-set>
      </TabPane>
      <TabPane label="其他设置">
        <rests-set></rests-set>
      </TabPane>
    </Tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as Tool from '../../../common/tool';
  import * as API from '../../../vuex/api';
  import dictionariesSet from '@/components/cloud/goods/dictionariesSet'
  import restsSet from '@/components/cloud/goods/restsSet'
  import resultNewly from '@/components/cloud/goods/resultNewly'
  import DishesLibrary from './dishes-library';
  import StoreDishes from './store-dishes';

  /** 接口地址 */
  const SvcUrl = {
    GoodsInitial: API.COMMODITY + '/goodsInitial',
    GetAllCategoryList: API.COMMODITY + '/getAllCategoryList',
    GetDictionaryList: API.DICTIONARYSETTINGS + '/getDictionary'
  };

  /** 接口 Mixin */
  const SvcApi = {
    methods: {
      ...Tool.ApiMethods,
      apiGoodInitial() {
        return this.request(SvcUrl.GoodsInitial, 0);
      },
      apiGetAllCategoryList() {
        let param = {
          id: this.getMerchantId()
        };
        return this.request(SvcUrl.GetAllCategoryList, param);
      },
      apiGetDictionaryList() {
        let param = {
          page: {
            pageSize: 100,
            currentPage: 1,
            currentResult: 1,
            totalPage: 1,
            totalResult: 1
          },
          typeCode: 11,
          merchantId: this.getMerchantId()
        };
        return this.request(SvcUrl.GetDictionaryList, param);
      }
    }
  };

  export default {
    mixins: [SvcApi],

    components: {
      dictionariesSet,
      restsSet,
      resultNewly,
      DishesLibrary,
      StoreDishes
    },

    data() {
      return {
        currentTab: 0,

        // 菜品分类
        categories: [],
        // 菜系
        cuisine: [],
        // 辣度
        spicyDegree: [],
        // 菜品属性
        dictionaries: []
      };
    },
    computed: {
      getDishesAttr() {
        return this.$store.getters['dishesAttr'];
      }
    },
    watch: {
      getDishesAttr() {
        this.refreshDictionaryList();
        this.$refs.storeDishes.search();
      }
    },
    methods: {
      copyDishesToMerchantSuccess() {
        this.$refs.storeDishes.search();
        this.$refs.storeDishes.refreshSideDishesList();
      },
      refreshCategories() {
        this.apiGetAllCategoryList()
          .then(data => {
            this.categories = data;
          });
        if (this.$refs.storeDishes) {
          this.$refs.storeDishes.search();
          this.$refs.storeDishes.refreshSideDishesList();
        }
      },
      refreshDictionaryList() {
        this.apiGetDictionaryList()
          .then(data => {
            if (data) {
              this.dictionaries = data.list.map(it => {
                let attr = JSON.parse(it.value);
                attr.items = attr.items.map(it => it.value);
                return attr;
              });
            }
          });
      }
    },

    created() {
      this.refreshCategories();

      this.apiGoodInitial()
        .then(data => {
          this.cuisine = data.cuisine;
          this.spicyDegree = data.spicyDegree;
        });

      this.refreshDictionaryList();
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .module-title {
    margin: 14px 0;
    .title {
      font-size: 20px;
      width: 200px;
      height: 32px;
      line-height: 32px;
      color: #1f2d3d;
      font-weight: normal;
    }
  }

  .ivu-tabs.ivu-tabs-card {
    border-radius: 4px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    border: solid 1px #d3dce6;
    background: #fff;
    .ivu-tabs-bar {
      margin-bottom: 0;
      background: #eff2f7;
      .ivu-tabs-nav-container {
        height: 42px;
      }
      .ivu-tabs-tab {
        padding: 10px 0 9px;
        margin-right: 0;
        width: 88px;
        height: 41px;
        text-align: center;
        border: none;
        border-radius: 0;
        background: #eff2f7;
        &.ivu-tabs-tab-active {
          height: 42px;
          background: #fff;
          border-left: 1px solid #dddee1;
          border-right: 1px solid #dddee1;
        }
        &:first-child {
          border-left: 0;
        }
      }
    }
    .ivu-tabs-content {
      .ivu-tabs-tabpane {
        padding: 24px 24px 40px;
      }
    }
  }
</style>
