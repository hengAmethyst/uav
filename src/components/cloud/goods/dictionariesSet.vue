<template>
  <Tabs :value="tabName" :animated="false" class="inline-tab">
    <TabPane label="理由设置" name="理由设置">
      <reasonSet></reasonSet>
    </TabPane>
    <TabPane label="点单备注" name="点单备注">
      <ordeRemark></ordeRemark>
    </TabPane>
    <TabPane label="菜品属性" name="菜品属性">
      <DishesAttribute></DishesAttribute>
    </TabPane>
  </Tabs>
</template>
<script type="text/ecmascript-6">
import reasonSet from "@/components/cloud/goods/reasonSet";
import ordeRemark from "@/components/cloud/goods/orderemark";
import DishesAttribute from "./dishesAttribute";
//import cuisineMeasure from '@/components/cloud/goods/cuisineMeasure'

export default {
  components: {
    reasonSet,
    ordeRemark,
    DishesAttribute
    //cuisineMeasure,
  },
  data() {
    return {
      tabName: "理由设置"
      // dictionariesData: ['理由设置', '点单备注'],
      // nowIndexdata: 0,
    };
  },
  methods: {
    changeData(index) {
      this.nowIndexdata = index;
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.ivu-tabs.ivu-tabs-card {
  .ivu-tabs-bar {
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

.inline-tab {
  &.ivu-tabs {
    .ivu-tabs-bar {
      margin-bottom: 0;
      background: none !important;
      .ivu-tabs-tab {
        background: none !important;
        margin-right: 16px !important;
        &.ivu-tabs-tab-active {
          height: 42px;
          background: #fff;
          border-left: none !important;
          border-right: none !important;
        }
      }
    }
  }
}

.dictionariesTab {
  width: 176px;
  height: 42px;
  border-bottom: solid 1px #d3dce6;
  overflow: hidden;
}

.liDictionaries {
  font-family: PingFangSC;
  font-size: 14px;
  color: #8492a6;
  float: left;
  width: 88px;
  height: 42px;
  line-height: 42px;
  /*border-bottom: solid 3px #ff4949;*/
  text-align: center;
}

.activeDictionaries {
  font-family: PingFangSC;
  font-size: 14px;
  color: #ff4949;
  border-bottom: solid 3px #ff4949;
}

.divTabs {
  margin-top: 24px;
}

</style>
