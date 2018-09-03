<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">外卖设置</h2>
    </div>
    <iframe ref="iframe" :src="pageUrl" frameborder="0" :height="getHeight + 'px'" width="100%"></iframe>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {
      pageUrl: sessionStorage.elm_url
    }
  },
  computed: {
    getHeight() {
      let winHeight = '';
      if (window.innerHeight) {
        winHeight = window.innerHeight;
      } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
      }
      winHeight -= 128;
      return winHeight;
    }
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

</style>
