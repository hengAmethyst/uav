<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">外卖设置</h2>
    </div>
    <div class="content clearfix">
      <div class="card-wrapper">
        <div class="card meituan">
          <img src="../../../assets/image/meituan.png" width="144" height="144">
          <p class="desc">美团外卖</p>
        </div>
        <div class="foot-btn clearfix">
          <button class="dishes unactive" disabled v-if="!isMappedMeituan">映射菜品</button>
          <button class="dishes" @click="toSetDishes('meituan')" v-else>映射菜品</button>
          <button class="store" @click="toBind('meituan')" v-if="!isMappedMeituan">绑定门店</button>
          <button class="store" @click="unBind('meituan')" v-else>解绑门店</button>
        </div>
      </div>
      <div class="card-wrapper">
        <div class="card elm">
          <img src="../../../assets/image/elm.png" width="144" height="144">
          <p class="desc">饿了么</p>
        </div>
        <div class="foot-btn clearfix" v-if="isGrantElm">
          <button class="dishes unactive" disabled v-if="!isMappedElm">映射菜品</button>
          <button class="dishes" @click="toSetDishes('elm')" v-else>映射菜品</button>
          <button class="store" @click="toBind('elm')" v-if="!isMappedElm">绑定门店</button>
          <button class="store" @click="unBind('elm')" v-else>解绑门店</button>
        </div>
        <div class="foot-btn" v-else>
          <button class="grant" @click="toGrant('elm')">授权</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as api from "../../../vuex/api";

  export default {
    data() {
      return {
        isMappedMeituan: false,
        isMappedElm: false,
        isGrantElm: false
      };
    },
    created() {
      this.getMapped();
      this.getElmMapped();
    },
    methods: {
      getMapped() {
        this.$http.post(api.TAKEOUT + "isMapped?merchantId=" + localStorage.currentMerchantId)
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              if (response.data === true) {
                this.isMappedMeituan = true;
              } else {
                this.isMappedMeituan = false;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      getElmMapped() {
        this.$http.post(api.ELM_URL + 'merchant/grant?userId=' + JSON.parse(localStorage.userInfo).userData.userDetail.userId + '&merchantId=' + localStorage.currentMerchantId)
          .then(res => {
            console.log(res);
            let response = res.body;
            if (response.code === 0) {
              if (response.data.isGrant === "true") {
                this.isGrantElm = true;
                if (response.data.isMapped === "true") {
                  this.isMappedElm = true;
                } else {
                  this.isMappedElm = false;
                }
              } else {
                this.isGrantElm = false;
                sessionStorage.elm_url = response.data.grantURL;
              }
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      unBindMeituan() {
        this.$http.post(api.TAKEOUT + "unbound/mapping?merchantId=" + localStorage.currentMerchantId)
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              sessionStorage.setItem("unBind", response.msg);
              this.$router.push("/cloud/unBind");
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      unBindElm() {
        this.$http.post(api.ELM_URL + "unbound?merchantId=" + localStorage.currentMerchantId)
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.$Message.success('解绑成功');
              this.isMappedElm = false;
            }else{
              this.$Message.error(response.msg);
              this.isMappedElm = true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      toSetDishes(name) {
        if (name === "meituan") {
          this.$router.push("/cloud/dishMapping");
        }else if(name === 'elm'){
            this.$router.push("/cloud/dishMappingElm");
        }
      },
      toBind(name) {
        if (name === "meituan") {
          this.$router.push("/cloud/setTakeOut");
        } else if (name === "elm") {
           this.$router.push("/cloud/setTakeOutElm");
        }
      },
      toGrant(name) {
        if (name === 'elm') {
          this.$router.push("/cloud/setGrantElm");
        }
      },
      unBind(name) {
        if (name === "meituan") {
          this.unBindMeituan();
        }else if(name === 'elm'){
            this.unBindElm()
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

  .content {
    padding: 24px 24px 40px;
    width: 100%;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #d3dce6;
    .card-wrapper {
      float: left;
      margin-right: 40px;
      border-radius: 8px;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
      .card {
        padding-top: 41px;
        box-sizing: border-box;
        border-radius: 8px 8px 0 0;
        width: 240px;
        height: 280px;
        &.meituan {
          background-color: #ffac29;
        }
        &.elm {
          background-color: #2295ff;
        }
        &.baidu {
          background-color: rgb(235, 65, 58);
        }
        img {
          display: block;
          margin: 0 auto 24px;
        }
        .desc {
          text-align: center;
          font-size: 22px;
          color: #fff;
          height: 30px;
          line-height: 30px;
        }
      }
      .foot-btn {
        .dishes,
        .store {
          float: left;
          width: 50%;
          height: 48px;
          border: none;
          outline: none;
          line-height: 48px;
          font-size: 14px;
          text-align: center;
          background: none;
          cursor: pointer;
          &.unactive {
            color: #ccc;
            cursor: default;
          }
          &:hover {
            opacity: 0.8;
          }
        }
        .grant {
          width: 100%;
          height: 48px;
          border: none;
          outline: none;
          line-height: 48px;
          font-size: 14px;
          text-align: center;
          background: none;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }

</style>
