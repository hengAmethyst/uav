<template>
  <Card class="message-center" dis-hover :bordered="false">
    <p slot="title">消息中心</p>

    <Tabs type="card" :animated="false">
      <TabPane label="系统消息">
        <div class="pane-content">
          <Card :class="{'message-item': true, unread: it.unread}" dis-hover v-for="(it, i) of items" :key="i">
            <p slot="title">{{it.title}}</p>
            <p>{{it.content}}</p>
            <div class="time">发送时间：{{it.time}}</div>
          </Card>

          <div class="page-wrapper">
            <Page :page-size="pageSize" :total="totalNum" :current="currentPage" @on-change="onPageChange"></Page>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      totalNum: 0,
      currentPage: 1,
      pageSize: 6
    };
  },

  computed: {
    items() {
      let items = Array(6).fill(null).map((_, i) => (
        {
          unread: !(i % 2),
          title: '系统升级通知',
          content: '尊敬的商户，晶蝶餐饮后台服务器将在2017-08-15 01:00～04:00 期间进行系统升级，在此期间您们的晶蝶餐饮、晶心服务、晶彩自助点餐系统将不能使用，请提前做好经营准备，敬请谅解。尊敬的商户，晶蝶餐饮后台服务器将在2017-08-15 01:00～04:00 期间进行系统升级，在此期间您们的晶蝶餐饮、晶心服务、晶彩自助点餐系统将不能使用，请提前做好经营准备，敬请谅解。',
          time: '2018-06-06 12:12:12'
        }
      ));
      return items;
    }
  },

  methods: {
    onPageChange() {

    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.message-center {
  background: none;

  /* 页面 title */
  .ivu-card-head {
    padding: 18px 0;
    p {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: #1f2d3d;
    }
  }

  /* 页面内容 */
  .ivu-card-body {
    padding: 0;
    background: #eff2f7;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    border: solid 1px #d3dce6;

    /* tab 样式 */
    .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar {
      margin-bottom: 0;
      .ivu-tabs-nav-container {
        height: 42px;

        .ivu-tabs-tab {
          height: 41px;
          border-top: 0;
          border-left: 1px solid #fff;
          border-right: 1px solid #fff;
          line-height: 32px;
          margin: 0 0 0 -1px;
        }

        .ivu-tabs-tab.ivu-tabs-tab-active {
          padding-right: 15px;
          margin-right: 1px;
          height: 42px;
          border-left: 1px solid #d3dce6;
          border-right: 1px solid #d3dce6;
        }
      }
    }

    /* tab 内容 */
    .ivu-tabs-content {
      background: #fff;
      padding: 22px 24px 40px 24px;

      .message-item {
        width: 750px;
        height: 244px;
        display: inline-block;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
        border: solid 1px #d3dce6;
        margin-bottom: 24px;
        margin-right: 24px;

        .ivu-card-head {
          border: none;
          p::before {
            content: '';
            display: inline-block;
            height: 8px;
            width: 8px;
            margin-right: 6px;
          }
          p {
            font-size: 16px;
            font-weight: 500;
            color: #5e6d82;
            margin-left: 20px;
          }
        }
        .ivu-card-body {
          border: none;
          box-shadow: none;
          background-color: inherit;
          p {
            width: 650px;
            margin: auto;
            color: #8492a6;
          }
          .time {
            position: absolute;
            bottom: 20px;
            right: 24px;
            font-size: 14px;
            text-align: right;
            color: #99a9bf;
          }
        }
      }
      .unread.message-item {
        .ivu-card-head {
          p::before {
            background-color: #ff4949;
            border-radius: 10px;
          }
          p {
            color: #1f2d3d;
          }
        }
        .ivu-card-body {
          p {
            color: #475669;
          }
        }
      }

      /* 分页 */
      .page-wrapper {
        height: 32px;
        .ivu-page {
          margin: 10px 24px;
          float: right;
        }
      }
    }
  }
}
</style>
