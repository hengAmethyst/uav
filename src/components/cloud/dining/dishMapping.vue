<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">外卖设置</h2>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <iframe ref="iframe" :src="pageUrl" frameborder="0" :height="getHeight + 'px'" width="100%" v-else></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
import * as api from '../../../vuex/api';

export default {
  data() {
    return {
      pageUrl: '',
      sendMsg: {
        event: 'erpDishData',
        value: {
          "dishes": []
        }
      },
      spinShow: true
    }
  },
  created() {
    // this.getDishes();
    this.dishMapping();
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage);
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
  },
  methods: {
    dishMapping() {
      this.$http.post(api.TAKEOUT + 'dish/mapping' + '?merchantId=' + localStorage.currentMerchantId)
        .then(res => {
          // console.log(res)
          let response = res.body;
          if (response.code === 0) {
            this.pageUrl = response.msg;
            this.spinShow = false
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    getDishes() {
      this.$http.post(api.TAKEOUT + 'dishData' + '?merchantId=' + localStorage.currentMerchantId)
        .then(res => {
          // console.log(res)
          let response = res.body;
          if (response.code === 0) {
            this.sendMsg.value.dishes = JSON.parse(response.data).dishes;
            this.postMessage();
          } else {
            this.$Message.error('网络异常')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    receiveMessage(e) {
      if (e.data.event === 'getErpDishData') {
        // console.log(e.data.event)
        this.getDishes();
      }
    },
    postMessage() {
      if (this.sendMsg.value.dishes.length > 0) {
        this.$refs.iframe.contentWindow.postMessage(this.sendMsg, '*');
        this.$Message.success('发送成功')
      } else {
        this.$Message.warning('本地无可映射菜品')
      }
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
