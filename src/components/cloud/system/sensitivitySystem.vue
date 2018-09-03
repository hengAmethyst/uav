<template>
  <div>
    <!--查看原因-->
    <Modal class="modal-wrapper" v-model="examineReason" title="订单详情" width="880">
      <div class="viewDetails">
        <div class="viewDetailscommodity">
          <span class="viewDetailsspan"></span>
          <span class="viewDetailsmessage">商品信息</span>
        </div>
        <div class="viewDetailsTabel">
          <Table ref="tableData" stripe :columns="viewDetailSet" :data="viewDetailsData" no-data-text="没有相关数据"></Table>
        </div>
        <div style=" border: solid 1px #c0ccda;border-top: none;height: 46px;">
          <Row class="expand-row">
            <Col span="12" style="line-height: 46px;font-size: 13px;color: #1f2d3d;padding-left:18px;">
            <span class="expand-key">商品总数：</span>
            <span class="expand-value">{{dishesCount}}</span>
            </Col>
            <Col span="12" style="line-height: 46px;font-size: 13px;color: #ff4949;text-align: right;padding-right: 18px;">
            <span class="expand-key">合计：</span>
            <span class="expand-value">
              <Icon type="social-yen"></Icon>{{dishesAmount}}</span>
            </Col>
          </Row>
        </div>
        <div style="margin-top: 44px;">
          <Row class="expand-row">
            <Col span="12">
            <span style="width: 4px;height: 18px;border: 1px solid #ff4949;background-color: #ff4949;margin-right: 12px;"></span>
            <span style="font-family: PingFangSC;font-size: 18px;color: #1f2d3d;">订单信息</span>
            </Col>
            <Col span="12" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">订单号：</span>
            <span class="expand-value" v-model="orderNumber2">{{orderNumber2}}</span>
            </Col>
          </Row>
        </div>
        <div style="width: 96%;margin-top: 33px;margin-left: 2%;">
          <Row class="expand-row">
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">来源：</span>
            <span class="expand-value" v-model="sourceData">{{sourceData}}</span>
            </Col>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">订单类型：</span>
            <span class="expand-value" v-model="orderType">{{orderType}}</span>
            </Col>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">订单状态：</span>
            <span class="expand-value" v-model="orderStatus">{{orderStatus}}</span>
            </Col>
          </Row>
          <Row class="expand-row" style='margin-top: 16px;'>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">会员姓名：</span>
            <span class="expand-value" v-model="customerName">{{customerName}}</span>
            </Col>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">手机号：</span>
            <span class="expand-value" v-model="customerMobile">{{customerMobile}}</span>
            </Col>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">下单时间：</span>
            <span class="expand-value" v-model="createTimeplace">{{createTimeplace | formatDate}}</span>
            </Col>
          </Row>
          <Row class="expand-row" style='margin-top: 16px;'>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">牌号：</span>
            <span class="expand-value" v-model="brandNum">{{brandNum}}</span>
            </Col>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">收银员：</span>
            <span class="expand-value" v-model="cashierName">{{cashierName}}</span>
            </Col>
            <Col span="8" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">订单流水号：</span>
            <span class="expand-value" v-model="serialNumber">{{serialNumber}}</span>
            </Col>
          </Row>
        </div>
        <!--支付信息-->
        <div style="margin-top: 44px;">
          <Row class="expand-row">
            <Col span="24">
            <span style="width: 4px;height: 18px;border: 1px solid #ff4949;background-color: #ff4949;margin-right: 12px;"></span>
            <span style="font-family: PingFangSC;font-size: 18px;color: #1f2d3d;">支付信息</span>
            </Col>
          </Row>
        </div>
        <div style="width: 96%;margin-top: 33px;margin-left: 2%;margin-bottom: 40px;">
          <Row class="expand-row">
            <Col span="16" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">支付状态：</span>
            <span class="expand-value" v-model="payStatus">{{payStatus}}</span>
            </Col>

            <Col span="8" style="font-family: PingFangSC;font-size: 16px; color: #ff4949;" v-if="discountInfoList">
            <ul>
              <li v-for="item in discountInfoList">
                <span class="expand-key">{{item.discountName}}：</span>
                <span class="expand-value">￥{{item.zeroAmount}}</span>
              </li>
            </ul>
            </Col>
          </Row>
          <Row class="expand-row" style='margin-top: 16px;'>
            <Col span="16" style="font-family: PingFangSC;font-size: 16px;color: #1f2d3d;">
            <span class="expand-key">支付方式：</span>
            <span v-if="payType">
              <span v-for="item in payInfoList">
                <span class="expand-value" style="width: 6px;height: 6px;background-color: #ff4949;border: 1px solid  #ff4949;border-radius: 50%;display: inline-block;"></span>
                <span class="expand-value">{{item.payChannelName}}：￥{{item.payChannelAmount}}</span>
              </span>
            </span>
            <span class="expand-value" v-else>无</span>
            <!--<span class="expand-value"-->
            <!--style="width: 6px;height: 6px;background-color: #20a0ff;border: 1px solid  #20a0ff;border-radius: 50%;display: inline-block;margin-left: 24px;"></span>-->
            <!--<span class="expand-value">支付宝：100.00元</span>-->
            </Col>

            <Col span="8" style="font-family: PingFangSC;font-size: 16px; color: #ff4949;">
            <span class="expand-key">实收：</span>
            <span class="expand-value">
              <Icon type="social-yen"></Icon>{{orderPayAmount}}</span>
            </Col>
          </Row>

        </div>
      </div>
      <!--<div slot="footer"></div>-->
    </Modal>
    <div style="overflow: hidden">
      <div style="float: left;" class="search-wrapper">
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">订单号</span>
          <Input v-model="orderNumber" placeholder="请输入订单号" style="width: 200px" class="search-item"></Input>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">操作员</span>
          <Input v-model="compellation" placeholder="根据操作人员搜索" style="width: 200px" class="search-item"></Input>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">操作类型</span>
          <Select v-model="operationType" style="width:168px" placeholder="全部" class="search-item">
            <Option v-for="(item,index) in operationTypeList" :key="index" :value="item.typeCode">{{item.typeName}}</Option>
          </Select>
        </div>
        <div style="display: inline-block;margin-bottom:16px;">
          <span class="search-title">日期</span>
          <DatePicker type="daterange" placeholder="选择日期" style="width: 200px;" class="search-item"
                      @on-change="handleDate"></DatePicker>
        </div>
        <div style="margin-bottom:16px;display: inline-block;vertical-align: top;">
          <button class="search" @click="getlogsensitiveData">搜索</button>
          <button class="reset" @click="resetLog">重置</button>
        </div>
      </div>
    </div>
    <div style="margin-top: 16px;">
      <Table ref="tableData" :width="width" stripe :columns="dictionariesSet" :data="dictionariesData" no-data-text="没有相关数据"></Table>
      <!--<div style="margin-top: 16PX;">-->
      <!--<button class="delAll">导出Excel</button>-->
      <!--</div>-->
      <div style="overflow: hidden;margin-top: 16px;">
        <div style="float: right;">
          <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script type="text/ecmascript-6">
import * as api from '../../../vuex/api';
import { formatDate } from '../../../common/js/date'

/**
 * 把 100 以内的正整数转为字符串，并保证2位，缺的前面加 '0'
 * @param s 值为 0 到 99
 * @returns '00' 到 '99'
 */
const padSecond = s => ('0' + s).substr(String(s).length - 1);
const PAGESIZE = 10;

export default {
  data() {
    return {
      sviewdetailItemId: '',
      orderNumber2: '',//订单号
      sourceData: '',//来源
      cashierName: '',//收医院
      customerName: '',//会员名称
      orderType: '',//订单类型
      customerMobile: '',//手机号
      serialNumber: '',//订单流水号
      createTimeplace: '',//下单时间
      orderStatus: '',//订单状态
      payStatus: '',//支付状态
      viewDetailsData: [],
      viewDetailSet: [       //反结账
        {
          title: '菜品',
          key: 'dishesName'
        },
        {
          title: '数量',
          key: 'dishesCount',
        },
        {
          title: '单价',
          key: 'dishesPrice'
        },
        {
          title: '小计',
          key: 'dishesAmount'
        },

      ],
      dishesAmount: 0,// 菜品总额
      dishesCount: 0,// 菜品数量
      examineReason: false,
      nowIndex: 0,
      orderNumber: '',  //订单号
      compellation: '',//姓名
      repastTypeSource: [],//就餐类型
      repastTypeSourcemodel: '',
      indentSourcedata: '',
      sensitiveLogstattime: '',//开始时间
      sensitiveLogendtime: '',//结束时间
      dictionariesData: [],  //反结账
      brandNum: '',//牌号
      payInfoList: [], // 支付信息集合
      // payChannelName: '',//支付方式
      // payChannelAmount: 0,// 支付金额（应收）
      orderPayAmount: 0, // 实收
      discountInfoList: [], // 打折信息集合
      // discountName: '',// 折扣名称(抹零、免单等)
      // zeroAmount: 0,//抹零金额
      payType: true, // 是否免单
      operationType: '2', // 默认查询挂账
      operationTypeList: [
        // {
        //   typeCode: '',
        //   typeName: '全部'
        // },
        {
          typeCode: '2',
          typeName: '挂账'
        },
        {
          typeCode: '3',
          typeName: '折扣'
        },
        {
          typeCode: '5',
          typeName: '反结账'
        }
      ],
      currentPage: 1,
      totalResult: 0,
      dictionariesObject: {},
      dictionariesSet: [// 反结账
        {
          title: '创建时间',
          fixed:'left',
          width:0,
          render: (h, p) => {
            let createDate = new Date(p.row.createTime);
            let dateStr = createDate.getFullYear() + '-'
              + padSecond(createDate.getMonth() + 1)
              + '-'
              + padSecond(createDate.getDate())
              + ' '
              + padSecond(createDate.getHours())
              + ':'
              + padSecond(createDate.getMinutes());
            return h('span', dateStr);
          }
        },
        {
          title: '订单号',
          key: 'orderCode',
          width:0
        },
        {
          title: '操作员',
          key: 'operationUserName',
          width:0,
        },
        {
          title: '订单金额',
          key: 'orderTotalAmount',
          width:0,
          render: (h, params) => {
            return h('span', (params.row.orderTotalAmount / 100).toFixed(2))
          }
        },
        {
          title: '操作类型',
          key: 'operationTypeName',
          width:0,
        },
        {
          title: '订单变化额',
          key: 'operationAmount',
          width:0,
          render: (h, params) => {
            return h('span', params.row.operationAmount ? (params.row.operationAmount / 100).toFixed(2) : '无')
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          fixed:'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                style: {
                  padding: '0',
                  marginRight: '32px',
                  width: '40px',
                  height: '24px',
                  borderRadius: '2px',
                  border: '1px solid #20a0ff',
                  lineHeight: '24px',
                  textAlign: 'center',
                  color: '#20a0ff',
                  fontSize: '13px',
                  background: '#fff',
                  verticalAlign: 'top'
                },
                on: {
                  click: () => {
                    this.viewDetails(params.index)
                  }
                }
              }, '详情'),
              h('Tooltip', {
                props: {
                  content: params.row.reason,
                  placement: 'left'
                },
                style: {
                  padding: '0',
                  width: '40px',
                  height: '24px',
                  borderRadius: '2px',
                  border: '1px solid #ff4949',
                  lineHeight: '24px',
                  textAlign: 'center',
                  color: '#ff4949',
                  fontSize: '13px',
                  background: '#fff'
                }
              }, '原因')
            ]);
          }
        },
      ],
      width:0
    }
  },
  mounted() {
    this.width = this.$refs.tableData.$el.clientWidth;
    if (window.outerWidth < 1440) {
      this.dictionariesSet[0].width = this.width / 5;
      this.dictionariesSet[1].width = this.width / 3;
      this.dictionariesSet[2].width = this.width / 7;
      this.dictionariesSet[3].width = this.width / 7;
      this.dictionariesSet[4].width = this.width / 7;
      this.dictionariesSet[5].width = this.width / 7;
    }
  },
  created() {
    this.getlogsensitiveData();
  },
  methods: {
    toggleTabs(index) {
      this.nowIndex = index;
    },
    handleDate(value) {
      this.sensitiveLogstattime = value[0];
      this.sensitiveLogendtime = value[1];
    },
    resetLog() {
      this.orderNumber = '';
      this.compellation = '';
      this.operationType = '2';
      this.sensitiveLogstattime = '';
      this.sensitiveLogendtime = '';
    },
    getlogsensitiveData() {
      this.$http.post(api.HANDLELOG + 'list',
        JSON.stringify(this.getParam('getsensitiveLog')))
        .then(res => {
          // console.log('敏感操作=======>', res);
          let response = res.body;
          if (response.code === 0) {
            if (response.data.logs) {
              this.dictionariesData = response.data.logs;
            }
            this.totalResult = response.data.request.page.totalResult;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    changePage(page) {
      this.currentPage = page;
      this.getlogsensitiveData();
    },
    viewDetails(index) { // 编辑操作弹窗
      // console.log(this.dictionariesData[index]);
      this.examineReason = true;
      this.dishesAmount = 0;// 初始化商品总额
      this.dishesCount = 0;//初始化商品数量

      this.sviewdetailItemId = this.dictionariesData[index].id;

      this.viewDetailsData = [];
      // this.viewDetailsData = this.dictionariesData[index].snackOrder.snackOrderDishes;

      if (this.dictionariesData[index].snackOrder.snackOrderDishes) {
        if (this.dictionariesData[index].snackOrder.snackOrderDishes.length > 0) {
          for (let i = 0; i < this.dictionariesData[index].snackOrder.snackOrderDishes.length; i++) {
            this.viewDetailsData.push({
              dishesName: this.dictionariesData[index].snackOrder.snackOrderDishes[i].dishesName,
              dishesCount: this.dictionariesData[index].snackOrder.snackOrderDishes[i].dishesCount,
              dishesPrice: ((this.dictionariesData[index].snackOrder.snackOrderDishes[i].dishesPrice + this.dictionariesData[index].snackOrder.snackOrderDishes[i].cuisinePrice) / 100).toFixed(2),
              dishesAmount: (this.dictionariesData[index].snackOrder.snackOrderDishes[i].dishesAmount / 100).toFixed(2)
            })
          }
        }
      }

      if (this.dictionariesData[index].snackOrder.requires) {
        if (this.dictionariesData[index].snackOrder.requires.length > 0) {
          for (let i = 0; i < this.dictionariesData[index].snackOrder.requires.length; i++) {
            this.viewDetailsData.push({
              dishesName: this.dictionariesData[index].snackOrder.requires[i].obligatoryName,
              dishesCount: this.dictionariesData[index].snackOrder.requires[i].requireCount,
              dishesPrice: (this.dictionariesData[index].snackOrder.requires[i].cost / 100).toFixed(2),
              dishesAmount: (this.dictionariesData[index].snackOrder.requires[i].requireFee / 100).toFixed(2)
            })
          }
        }
      }


      for (let i = 0; i < this.viewDetailsData.length; i++) {
        this.dishesAmount += Number(this.viewDetailsData[i].dishesAmount);
        this.dishesCount += this.viewDetailsData[i].dishesCount
      }

      this.dishesAmount = this.dishesAmount.toFixed(2);

      if (this.dictionariesData[index].snackOrder.channel === 4) {
        this.sourceData = '商户收银系统';
      } else if (this.dictionariesData[index].snackOrder.channel === 1) {
        this.sourceData = 'H5扫码';
      } else if (this.dictionariesData[index].snackOrder.channel === 10) {
        this.sourceData = '服务员APP';
      } else {
        this.sourceData = '第三方外卖';
      }

      this.orderNumber2 = this.dictionariesData[index].snackOrder.orderCode;
      this.customerName = this.dictionariesData[index].snackOrder.customerName;
      this.cashierName = this.dictionariesData[index].snackOrder.cashierName;
      this.customerMobile = this.dictionariesData[index].snackOrder.customerMobile;
      this.serialNumber = this.dictionariesData[index].snackOrder.serialNumber;
      this.brandNum = this.dictionariesData[index].snackOrder.brandNum;
      this.createTimeplace = this.dictionariesData[index].snackOrder.createTime;

      if (this.dictionariesData[index].snackOrder.orderType === 1) {
        this.orderType = '堂吃';
      } else if (this.dictionariesData[index].snackOrder.orderType === 2) {
        this.orderType = '外带';
      } else {
        this.orderType = '外卖';
      }

      if (this.dictionariesData[index].snackOrder.orderStatus === 1) {
        this.orderStatus = '待付款';
      } else if (this.dictionariesData[index].snackOrder.orderStatus === 2) {
        this.orderStatus = '已付款';
      } else if (this.dictionariesData[index].snackOrder.orderStatus === 3) {
        this.orderStatus = '已取消';
      } else {
        this.orderStatus = '已退款';
      }

      if (this.dictionariesData[index].snackOrder.payStatus === 1) {
        this.payStatus = '待支付';
      } else if (this.dictionariesData[index].snackOrder.payStatus === 2) {
        this.payStatus = '账单支付中';
      } else if (this.dictionariesData[index].snackOrder.payStatus === 3) {
        this.payStatus = '支付成功';
      } else if (this.dictionariesData[index].snackOrder.payStatus === 4) {
        this.payStatus = '支付失败';
      } else {
        this.payStatus = '已退款';
      }

      // this.discountName = '';
      // this.zeroAmount = 0;

      this.discountInfoList = [];

      if (this.dictionariesData[index].snackOrder.discountInfos) {
        if (this.dictionariesData[index].snackOrder.discountInfos.length > 0) {
          for (let i = 0; i < this.dictionariesData[index].snackOrder.discountInfos.length; i++) {
            this.discountInfoList.push({
              discountName: this.dictionariesData[index].snackOrder.discountInfos[i].discountName,
              zeroAmount: (this.dictionariesData[index].snackOrder.discountInfos[i].discountAmount / 100).toFixed(2)
            })
          }
        }
      }

      this.orderPayAmount = (this.dictionariesData[index].snackOrder.orderPayAmount / 100).toFixed(2);

      this.payInfoList = [];


      if (this.dictionariesData[index].snackOrder.payChannels) {
        this.payType = true;
        if (this.dictionariesData[index].snackOrder.payChannels.length > 0) {
          for (let i = 0; i < this.dictionariesData[index].snackOrder.payChannels.length; i++) {
            // if (this.dictionariesData[index].snackOrder.payChannels[i].channelId === '5') {
            //   this.orderPayAmount -= this.dictionariesData[index].snackOrder.payChannels[i].payAmount
            // }
            this.payInfoList.push({
              payChannelName: this.dictionariesData[index].snackOrder.payChannels[i].channelName,
              payChannelAmount: (this.dictionariesData[index].snackOrder.payChannels[i].payAmount / 100).toFixed(2)
            })
          }
          // this.orderPayAmount = (this.orderPayAmount / 100).toFixed(2);
        }
      } else {
        this.payType = false;
      }
    },
    getParam(name) {
      if (name === 'getsensitiveLog') {
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
            page: {
              pageSize: PAGESIZE,
              currentPage: this.currentPage
            },
            merchantId: localStorage.currentMerchantId,
            logType: 2,
            operationType: this.operationType,
            startDate: this.sensitiveLogstattime,
            endDate: this.sensitiveLogendtime,
            operationUserName: this.compellation,
            operationTypeName: this.orderNumber,
          }
        }
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.viewDetails {
  width: 88%;
  margin-left: 6%;
  margin-top: 12px;
  .viewDetailscommodity {
    height: 30px;
    .viewDetailsspan {
      width: 4px;
      height: 18px;
      background-color: #ff4949;
      border: 1px solid #ff4949;
      line-height: 30px;
    }
    .viewDetailsmessage {
      font-size: 18px;
      color: #1f2d3d;
      margin-left: 12px;
      line-height: 30px;
    }
  }
  .viewDetailsTabel {
    margin-top: 12px;
  }
}

.ivu-tabs.ivu-tabs-card {
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

.ivu-form .ivu-form-item-label {
  font-size: 12px;
  color: #1f2d3d;
}

.money {
  width: 100%;
  margin: 44px 0;
  .moneyspan {
    font-size: 26px;
    font-weight: 500;
    text-align: center;
    color: #ff4949;
  }
  .moneyicon {
    font-size: 16px;
    text-align: center;
    color: #223040;
  }
}

.tabs-line {
  width: 264px;
  height: 42px;
  border-bottom: solid 1px #d3dce6;
}

.li-tabs {
  font-size: 14px;
  color: #8492a6;
  float: left;
  width: 88px;
  height: 42px;
  line-height: 42px;
  text-align: center;
}

.liActive {
  font-size: 14px;
  color: #ff4949;
  border-bottom: solid 3px #ff4949;
}

.add,
.search,
.reset {
  width: 88px;
  height: 36px;
  border-radius: 2px;
  background-color: #20a0ff;
  color: #fff;
  font-size: 14px;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    opacity: .9;
  }
}

.search {
  margin-right: 16px;
  background: #ff4949;
}

.reset {
  background: #fff;
  border: 1px solid #ff4949;
  color: #ff4949;
}

.search-wrapper {
  .search-title {
    display: inline-block;
    margin-top: 2px;
    margin-right: 12px;
    vertical-align: top;
    width: 80px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    background: #f2f4f8;
    font-size: 14px;
    color: #1f2d3d;
  }
  .search-item {
    vertical-align: top;
    margin-top: 2px;
    margin-right: 24px;
  }
}
</style>
