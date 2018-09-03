<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">操作日志</h2>
    </div>
    <Tabs type="card" :animated="false">
      <Tab-pane label="系统操作">
       	<operation-system></operation-system>-
      </Tab-pane>
      <Tab-pane label="敏感操作">
       	 <sensitivity-system></sensitivity-system>
      </Tab-pane>
    </Tabs>
 </div>
</template>
<script type="text/ecmascript-6">
	 import operationSystem from '@/components/cloud/system/operationSystem'
	 import sensitivitySystem from '@/components/cloud/system/sensitivitySystem'
		export default {
		  components: {
			   operationSystem,
			   sensitivitySystem,
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
      }
    }
  }
  .ivu-form .ivu-form-item-label{
  	color: #1f2d3d;
  }
</style>
