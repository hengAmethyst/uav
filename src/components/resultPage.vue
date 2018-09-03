<template>
  <div class="result-page">
    <Icon type="checkmark-circled" size="70" color="#10fd59"></Icon>
    <p class="text">授权成功</p>
  </div>
</template>
<script type="text/ecmascript-6">
export default {};

</script>
<style scoped lang="scss" rel="stylesheet/scss">
.result-page {
  margin-left: -200px;
  margin-top: -200px;
  padding-top: 130px;
  position: fixed;
  z-index: 10;
  width: 400px;
  height: 400px;
  left: 50%;
  top: 50%;
  text-align: center;
  .text {
    margin-top: 20px;
    font-size: 30px;
    text-align: center;
  }
}

</style>
