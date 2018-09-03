<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">饿了么商户授权</h2>
    </div>
    <div class="content">
      <h2 class="content-title">绑定店铺
        <span class="sub">饿了么商户下有{{storeList.length}}个店铺，请选择1个店铺绑定到晶蝶收银系统中</span>
      </h2>
      <ul class="store-list-wrapper">
        <li class="list-item" v-for="(item,index) in storeList" :class="selectedId === item.id?'active':''"
            @click="selectStore(index)">
          <Icon type="checkmark"></Icon>
          <span>{{item.name}}</span>
        </li>
      </ul>
      <button type="primary" @click="submit" class="submit">提交</Button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as api from "../../../vuex/api";

  export default {
    data() {
      return {
        storeList: [],
        selectedId: '',
        selectedName: ''
      };
    },
    created() {
      this.getElmStoreInfo();
    },
    methods: {
      getElmStoreInfo() {
        this.$http.post(api.ELM_URL + 'merchant/info?userId=' + JSON.parse(localStorage.userInfo).userData.userDetail.userId)
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.storeList = response.data.authorizedShops;
            } else {
              this.$Message.error('获取饿了么门店信息失败')
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      submit() {
        if (this.selectedId === '') {
          this.$Message.error('请选择1个店铺进行绑定')
        } else {
          this.$http.post(api.ELM_URL + 'merchant/mapping',
            JSON.stringify(this.getParam('submit')))
            .then(res => {
              console.log(res)
              let response = res.body;
              if (response.code === 0) {
                this.$Message.success('绑定成功');
                this.$router.go(-1);
              } else {
                this.$Message.error(response.msg);
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      selectStore(index) {
        if (this.selectedId === this.storeList[index].id) {
          this.selectedId = '';
          this.selectedName = '';
        } else {
          this.selectedId = this.storeList[index].id;
          this.selectedName = this.storeList[index].name;
        }
      },
      getParam(name) {
        if (name === 'submit') {
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
              merchantId: localStorage.currentMerchantId,
              eMerchantId: this.selectedId,
              eMerchantName: this.selectedName
            }
          }
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
    .content-title {
      margin-bottom: 24px;
      position: relative;
      padding-left: 16px;
      height: 25px;
      line-height: 25px;
      color: #1f2d3d;
      &:before {
        display: block;
        position: absolute;
        content: '';
        width: 4px;
        height: 18px;
        background: #ff4949;
        left: 0;
        top: 4px;
      }
      .sub {
        padding-left: 12px;
        font-size: 12px;
        color: #8492a6;
      }
    }
    .store-list-wrapper {
      display: block;
      flex-direction: row;
      margin-bottom: 60px;
      .list-item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 40px;
        margin-bottom: 48px;
        width: 232px;
        height: 154px;
        border-radius: 2px;
        border: 1px solid #d3dce6;
        font-size: 26px;
        text-align: center;
        cursor: pointer;
        z-index: 1;
        span {
          vertical-align: middle;
        }
        .ivu-icon-checkmark {
          display: none;
          position: absolute;
          right: 0;
          top: 0;
          background: #fff;
          background-image: linear-gradient(45deg, #ff4949 0%, transparent 0), linear-gradient(45deg, transparent 50%, #ff4949 0);
          background-size: 24px 24px;
          height: 24px;
          width: 24px;
          z-index: 10;
        }
        .ivu-icon-checkmark::before {
          position: absolute;
          top: 1px;
          right: 1px;
          color: #fff;
          font-size: 12px;
        }
        &.active {
          border-color: #ff4949;
          .ivu-icon-checkmark {
            display: block;
          }
        }
      }
    }
    .submit {
      display: block;
      margin: 0 auto;
      width: 144px;
      height: 36px;
      border-radius: 2px;
      background-color: #ff4949;
      font-size: 14px;
      color: #fff;
      border: none;
      outline: none;
      cursor: pointer;
      &:hover {
        opacity: .9;
      }
    }
  }

</style>
