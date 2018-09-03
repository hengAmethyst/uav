<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">套餐设置</h2>
    </div>

    <div class="child-wrapper">
      <h3 class="child-title">编辑套餐</h3>
      <div class="child-content">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <SetMealInfo :setMealInfo="setMealInfo" v-else></SetMealInfo>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import SetMealInfo from './setMealInfo.vue'
  import * as api from '../../../vuex/api'

  export default {
    data() {
      return {
        setMealInfo: null,
        spinShow: true
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.setMealInfo = null;
        this.$http.post(api.PACKAGE + 'packageInfo',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.setMealInfo = response.data;
              this.spinShow = false;
            } else {
              this.$Message.error('获取详情失败')
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      getParam(name) {
        if (name === 'get') {
          return {
            reqId: 0,
            channel: 0,
            os: "web",
            ver: "v2",
            appVer: "v2",
            model: "string",
            lng: "0",
            lat: "0",
            signType: "string",
            sign: "string",
            token: localStorage.getItem('token'),
            param: {
              packageId: this.$route.query.id
            }
          }
        }
      }
    },
    components: {
      SetMealInfo
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
