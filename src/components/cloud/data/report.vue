<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">营业报表</h2>
    </div>

    <Tabs type="card" :animated="false">
      <!-- 营业概况 -->
      <Tab-pane label="营业概况">
        <Business></Business>
      </Tab-pane>

      <!-- 销量排行 -->
      <Tab-pane label="销量排行">
        <Sales></Sales>
      </Tab-pane>

      <!-- 交接班记录 -->
      <Tab-pane label="交接班记录">
        <ShiftLog></ShiftLog>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import Business from './business.vue';
import Sales from './sales.vue';
import ShiftLog from './shiftLog.vue';

export default {
  data() {
    return {
      // 交接班记录

    }
  },
  components: {
    Business,
    Sales,
    ShiftLog
  }
};
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
      .search-condition {
        margin-bottom: 32px;
        .condition-wrapper {
          float: left;
          padding-top: 2px;
          margin-right: 32px;
          .condition-title {
            display: inline-block;
            margin-right: 12px;
            vertical-align: top;
            width: 80px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background-color: #e5e9f2;
            color: #1f2d3d;
            font-size: 14px;
          }
        }
        .search-btn {
          width: 88px;
          height: 36px;
          border-radius: 2px;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          background-color: #ff4949;
          &:hover {
            opacity: .9;
          }
        }
      }
      .tab {
        margin-bottom: 32px;
        font-size: 0;
        text-align: center;
        .tab-item {
          display: inline-block;
          padding: 0;
          margin: 0;
          width: 96px;
          height: 36px;
          box-sizing: border-box;
          text-align: center;
          line-height: 34px;
          outline: none;
          border: 1px solid #c0ccda;
          background: #fff;
          font-size: 14px;
          cursor: pointer;
          &:first-child {
            border-radius: 4px 0 0 4px;
          }
          &:last-child {
            border-radius: 0 4px 4px 0;
          }
          &.active {
            background: #ff4949;
            color: #fff;
            border-color: #ff4949;
          }
          &:hover {
            opacity: .9;
          }
        }
      }
      .amount-summary {
        margin-bottom: 32px;
        padding: 18px 0;
        background: #f9fafc;
        .ivu-col {
          border-right: 1px solid #e5e9f2;
          color: #223040;
          font-size: 0;
          &:last-child {
            border-right: 0;
          }
          .amount-summary-item {
            float: left;
            width: 50%;
            z-index: 1;
            &.v-line {
              &:first-child {
                position: relative;
                &:before {
                  position: absolute;
                  display: block;
                  content: '';
                  right: 0;
                  top: -18px;
                  width: 1px;
                  height: 100px;
                  background: #d3d3d3;
                  z-index: 10;
                  transform: rotate(45deg);
                }
              }
            }
            .num {
              margin-bottom: 5px;
              height: 37px;
              line-height: 37px;
              font-size: 26px;
              text-align: center;
              font-weight: 500;
            }
            .text {
              height: 22px;
              line-height: 22px;
              font-size: 16px;
              text-align: center;
            }
          }
        }
      }
      .ivu-table-wrapper {
        margin-bottom: 32px;
      }
    }
  }
}
</style>
