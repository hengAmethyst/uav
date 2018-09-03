<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">商户管理</h2>
    </div>

    <div class="child-wrapper">
      <h3 class="child-title">新建子商户</h3>
      <div class="child-content">
        <MerchantInfo :id="id"></MerchantInfo>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import MerchantInfo from './merchantInfo.vue';

  export default {
    data() {
      return {
        id: null
      }
    },
    components: {
      MerchantInfo
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
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

  .child-wrapper {
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid #d3dce6;
    .child-title {
      padding-left: 24px;
      height: 40px;
      line-height: 40px;
      background-color: #eff2f7;
      color: #1f2d3d;
      font-size: 16px;
      border-bottom: 1px solid #d3dce6;
      font-weight: normal;
    }
    .child-content {
      padding: 24px 24px 40px;
    }
  }

</style>
