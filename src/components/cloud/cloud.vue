<template>
  <div class="layout">
    <Row type="flex">
      <div class="layout-menu-left">
        <Menu active-name="home" theme="dark" width="auto" @on-select="router($event)" accordion>
          <div class="layout-logo-left">
            <img src="../../assets/image/logo.jpg">
          </div>

          <h2 class="group-title">经营参谋</h2>
          <Menu-item name="home">
            今日看板
          </Menu-item>

          <Submenu name="data">
            <template slot="title">
              数据中心
            </template>
            <Menu-item name="report">营业报表</Menu-item>
            <Menu-item name="checking">第三方对账</Menu-item>
          </Submenu>

          <h2 class="group-title">工作区</h2>
          <Menu-item name="order">
            订单中心
          </Menu-item>

          <Menu-item name="member">
            会员中心
          </Menu-item>

          <Submenu name="stores">
            <template slot="title">
              门店管理
            </template>
            <Menu-item name="merchant">商户管理</Menu-item>
            <Menu-item name="staff">员工管理</Menu-item>
          </Submenu>

          <h2 class="group-title">设置区</h2>
          <Submenu name="goods">
            <template slot="title">
              商品设置
            </template>
            <Menu-item name="good">商品管理</Menu-item>
            <Menu-item name="setMeal">套餐设置</Menu-item>
          </Submenu>

          <Submenu name="dining">
            <template slot="title">
              财务模块
            </template>
            <Menu-item name="payment">快捷支付</Menu-item>
            <Menu-item name="financial">财务规则</Menu-item>
            <Menu-item name="takeOut">外卖设置</Menu-item>
            <Menu-item name="surcharge">附加费设置</Menu-item>
          </Submenu>
          <Menu-item name="log">操作日志</Menu-item>
        </Menu>
      </div>
      <div class="layout-content-right">
        <div class="layout-header">
          <div class="title"></div>
          <div class="info clearfix">
            <div class="icon-wrapper" @click="toMarket">
              <i class="icon tmall"></i>
            </div>
            <div class="icon-wrapper mine-wrapper" @click="toUser">
              <Tooltip placement="bottom">
                <i class="icon mine"></i>
                <div slot="content">
                  <ul class="tooltip-content">
                    <li class="item clearfix">
                      <p class="item-title">钱包余额</p>
                      <p class="item-text">￥{{walletAmount}}</p>
                    </li>
                    <li class="item clearfix" @click.stop="toUser">
                      <p class="item-title">短信余量</p>
                      <p class="item-text">{{smsAmount}}条</p>
                    </li>
                    <li class="item clearfix">
                      <button class="reset" @click="toUser">修改密码</button>
                      <button class="logout" @click="logout">退出登录</button>
                    </li>
                  </ul>
                </div>
              </Tooltip>
            </div>
            <!-- <div class="icon-wrapper">
                  <i class="icon message"></i>
                </div> -->
            <!--<div class="icon-wrapper">-->
            <!--<i class="icon help"></i>-->
            <!--</div>-->
          </div>
          <div class="username">{{storeName}}</div>
          <div class="store">
            <Select v-model="store" style="width:120px" @on-change="handleChangeStore">
              <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="phone">
            <h3 class="text">免费服务热线：400-685-8188</h3>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </Row>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from "../../vuex/api";

  export default {
    data() {
      return {
        store: localStorage.currentMerchantId
          ? localStorage.currentMerchantId
          : "",
        storeList: [],
        storeName: JSON.parse(localStorage.userInfo).userData.userDetail.userName,
        mine: false,
        smsAmount: 0,
        walletAmount: 0,
        storeListLength: sessionStorage.storeListLength
      };
    },
    created() {
//      this.getPeriod();
      this.getMerchantInfo();
//      this.getSmsUsageRecord();
    },
    computed: {
      getNewStoreLength() {
        return this.$store.getters['storeListLength'];
      }
    },
    watch: {
      getNewStoreLength() {
        this.getMerchantInfo();
        // console.log(1);
      }
    },
    methods: {
      router(e) {
        this.$router.push("/cloud/" + e);
      },
      handleHover() {
        this.mine = !this.mine;
      },
      toMarket() {
        window.open("https://shop350629009.taobao.com");
      },
      toUser() {
        this.$router.push("/cloud/user");
      },
      logout() {
        this.$store.dispatch("logout");
        this.$router.replace("/login");
      },
      handleChangeStore(id) {
        this.$store.dispatch("currentMerchantId", id);
        this.$router.replace("/cloud/home");
      },
      /*getPeriod() {
       this.$http
       .post(api.PERIOD, JSON.stringify(this.getParam("period")))
       .then(res => {
       // console.log(res);
       let response = res.body;
       if (response.code === 0) {
       this.$store.dispatch("mealPeriods", response.data.mealPeriods);
       localStorage.setItem(
       "mealPeriods",
       JSON.stringify(response.data.mealPeriods)
       );
       }
       })
       .catch(err => {
       console.log(err);
       });
       },*/
      getMerchantInfo() {
        this.$http
          .post(api.MERCHANTINFO, JSON.stringify(this.getParam("merchant")))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              if (response.data) {
                this.storeList = response.data;
                this.store = JSON.parse(localStorage.userInfo).userData.merchantId;
                localStorage.currentMerchantId = this.store;
                this.$store.dispatch('storeListLength', response.data.length);
              } else {
                localStorage.currentMerchantId = 0;
                this.$store.dispatch('storeListLength', 0);
              }
              this.getSmsUsageRecord();
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      getSmsUsageRecord() {
        this.$http
          .post(
            api.MESSAGE_RECHARGE + "api/pc/queryInventedAccountByMerchantId",
            JSON.stringify(this.getParam("balance"))
          )
          .then(res => {
            // console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.smsAmount = response.data.remainderAmount;
              this.walletAmount = (response.data.balance / 100).toFixed(2);
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      getParam(name) {
        if (name === "period") {
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
            token: localStorage.getItem("token"),
            param: {
              merchantId: JSON.parse(localStorage.getItem("userInfo")).userData
                .merchantId,
              mealPeriodType: 1
            }
          };
        } else if (name === "merchant") {
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
            token: localStorage.getItem("token"),
            param: {
              id: JSON.parse(localStorage.getItem("userInfo")).userData
                .merchantId,
              brandId: JSON.parse(localStorage.getItem("userInfo")).userData
                .brandId
            }
          };
        } else if (name === "balance") {
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
            token: localStorage.getItem("token"),
            param: {
              merchantId: localStorage.currentMerchantId
            }
          };
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .layout {
    background: #f5f7f9;
    position: relative;
  }

  .group-title {
    padding: 12px 14px 11px;
    font-size: 18px;
    color: #686a7f;
    font-weight: normal;
    background-color: #222544;
  }

  .layout-menu-left {
    position: fixed;
    width: 176px;
    left: 0;
    top: 0;
    bottom: 0;
    background: #1f223c;
    overflow: scroll;
    z-index: 510;
  }

  .ivu-menu-dark {
    background: #080c30;
  }

  .layout-content-right {
    margin-left: 176px;
    padding: 40px 32px 24px;
    width: 100%;
    box-sizing: border-box;
    background-color: #ebf0f6;
  }

  .layout-header {
    position: fixed;
    padding-left: 176px;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 40px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    color: #1f2d3d;
    z-index: 500;
    .title {
      flex: 1;
      padding-left: 24px;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
    }
    .info {
      .icon-wrapper {
        position: relative;
        padding-top: 12px;
        float: left;
        width: 40px;
        height: 40px;
        margin-right: 12px;
        text-align: center;
        .ivu-tooltip-inner {
          max-width: 256px;
          box-sizing: border-box;
          padding: 0;
          .tooltip-content {
            width: 256px;
            .item {
              border-bottom: 1px solid rgba(192, 204, 218, 0.2);
              font-size: 14px;
              .item-title {
                padding: 14px 0 14px 14px;
                width: 50%;
                float: left;
                text-align: left;
              }
              .item-text {
                padding: 14px 14px 14px 0;
                width: 50%;
                float: right;
                text-align: right;
              }
              button {
                width: 50%;
                text-align: center;
                line-height: 48px;
                background: none;
                border: none;
                outline: none;
                color: #fff;
                cursor: pointer;
                &:first-child {
                  border-right: 1px solid rgba(192, 204, 218, 0.2);
                }
              }
            }
          }
        }
        .icon {
          display: block;
          margin: 0 auto;
          width: 16px;
          height: 16px;
          background-size: 16px 16px;
          cursor: pointer;
          &.mine {
            background: url(../../assets/image/mine.png) no-repeat;
          }
          &.message {
            background: url(../../assets/image/msg.png) no-repeat;
          }
          &.help {
            background: url(../../assets/image/help.png) no-repeat;
          }
          &.tmall {
            background: url(../../assets/image/market.png) no-repeat;
          }
        }
        .panel {
          display: none;
          position: absolute;
          width: 100px;
          height: 50px;
          border: 1px solid #ddd;
          left: 0;
          top: 40px;
          background: #fff;
          z-index: 50;
        }
        &:hover {
          .panel {
            display: block;
          }
        }
      }
    }
    .username {
      padding-left: 20px;
      width: 150px;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      text-align: left;
    }
    /*.logout {*/
    /*margin-left: 30px;*/
    /*text-align: center;*/
    /*width: 80px;*/
    /*height: 40px;*/
    /*line-height: 40px;*/
    /*font-size: 16px;*/
    /*border-left: 1px solid #D3DCE6;*/
    /*cursor: pointer;*/
    /*&:hover {*/
    /*color: #E85C4C;*/
    /*}*/
    /*}*/
    .store {
      width: 152px;
      padding-top: 4px;
      padding-right: 32px;
    }
    .phone {
      .text {
        width: 255px;
        line-height: 40px;
        text-align: left;
        font-size: 16px;
        color: #8492a6;
        font-weight: 600;
      }
    }
  }

  .layout-logo-left {
    img {
      display: block;
      width: 100%;
    }
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
  .ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
    border-right: 0;
    border-left: 4px solid #e85c4c;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background: #010315;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
  .ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu),
  .ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):hover,
  .ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover {
    background: #080c30;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
    background: #080c30;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active .ivu-menu-submenu-title {
    border-left: 4px solid #e85c4c;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    position: relative;
    color: #fff;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-item-active:before {
    position: absolute;
    display: block;
    left: 30px;
    top: 21px;
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #fff;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    background: transparent !important;
    border-left: 0;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item,
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title {
    color: rgb(132, 146, 166);
  }
</style>
