<template>
  <div class="restsSet">
    <div class="restsSetp">
      <div class="restsSetpspan">估清自动还原</div>
    </div>
    <div style="float: right;" class="restsSetbutton">
      <i-switch v-model="switchset" size="large"></i-switch>
    </div>
    <div class="restsSetstate">说明：开启后，被估清的菜品会在每日的还原时间自动反估清</div>
    <div class="restsSetinput">
      <span class="restsSetinputspan">还原时间</span>
      <TimePicker @on-change="handlesend" :value="time" format="HH:mm" placeholder="选择时间" style="width: 300px;height: 36px;margin-left: 26px;"></TimePicker>
    </div>
    <div style="text-align: center;margin-top: 500px;">
      <Button @click="cancelButton" class="order-dates" style="width: 144px;height: 36px;">取消</Button>
      <Button @click="zhixinggetrestsSet()" type="primary" style="width: 144px;height: 36px;margin-left: 12px;" class="order-dates">提交</Button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import * as api from '../../../vuex/api';
export default {
  data() {
    return {
      restsSettime: '',//时间
      switchset: false,
      loading: true,
      time: ''
    }
  },
  created() {
    this.getrestsSet();
    //this.getsetData();
  },
  methods: {
    handlesend(time) {
      this.restsSettime = time;
    },
    getrestsSet() {
      this.$http.post(api.COMMODITY + '/queryDishesOtherInfo',
        JSON.stringify(this.getParam('getSet')))
        .then(res => {
          let response = res.body;
          if (response.code === 0) {
            this.time = response.data.autoRestoreTime;
            if (response.data.isAutoRestore === 1) {
              this.switchset = false;
            } else {
              this.switchset = true;
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    sendrestsSet() {
      this.$http.post(api.COMMODITY + '/saveMcntOtherInfo',
        JSON.stringify(this.getParam('sendSet')))
        .then(res => {
          console.log(res);
          let response = res.body;
          if (response.code === 0) {
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    //   getsetData(index){
    //   	console.log('===========================================111111111111111111')
    //    	this.restsSettime = this.getsendData[index].restsSettime;
    //    	this.getsendData[index].switchset === 0 ? this.switchset = true : this.switchset = false;
    //   },
    cancelButton() {
      this.restsSettime = '';
      this.switchset = false;
    },
    zhixinggetrestsSet(index) { // 删除逻辑
      this.$Modal.confirm({
        title: '提交',
        content: '此操作将提交所有数据，是否继续？',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.sendrestsSet();
            this.$Modal.remove();
          }, 1000);
        },
        onCancel: () => {
          this.loading = false;
          this.$Modal.remove();
        }
      });
    },
    getParam(name) {
      if (name === 'sendSet') {
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
            autoRestoreTime: this.restsSettime,
            isAutoRestore: this.switchset === false ? 1 : 0,
          }
        }
      } else if (name === 'getSet') {
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
          }
        }

      }
    },

  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.restsSet {
  width: 100%;
  height: 839px;
  overflow: hidden;
  .restsSetp {
    font-family: PingFangSC;
    .restsSetpspan {
      font-size: 16px;
      text-align: left;
      color: #475669;
      margin-top: 40px;
      margin-left: 56px;
    }
  }
  .restsSetbutton {
    margin-top: -16px;
    margin-right: 67px;
  }
  .restsSetstate {
    font-family: PingFangSC;
    font-size: 14px;
    text-align: left;
    color: #99a9bf;
    margin-top: 12px;
    margin-left: 56px;
  }
  .restsSetinput {
    margin-top: 48px;
    margin-left: 56px;
    .restsSetinputspan {
      font-family: PingFangSC;
      font-size: 14px;
      color: #475669;
    }
  }
}
</style>