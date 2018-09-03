<template>
  <Card class="member-center layout-content-main" dis-hover :bordered="false">
    <p slot="title">会员中心</p>

    <MemberList ref="memberList" v-show="!showingDetail" @create="onCreate" @edit="onEdit"></MemberList>
    <MemberDetail ref="memberDetail" v-show="showingDetail" @cancel="onDetailCancel" @submit="onDetailSubmit"></MemberDetail>
  </Card>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import MemberList from './member-list';
import MemberDetail from './member-detail';

export default {
  components: {
    MemberList,
    MemberDetail
  },

  data() {
    return {
      showingDetail: false,
    };
  },

  methods: {
    /**
     * 创建按钮事件
     */
    onCreate() {
      this.$refs.memberDetail.create();
      this.showingDetail = true;
    },
    onEdit(item) {
      this.$refs.memberDetail.modify(item);
      this.showingDetail = true;
    },

    /**
     * 会员详细：取消按钮事件
     */
    onDetailCancel() {
      this.showingDetail = false;
    },
    /**
     * 会员详细：提交按钮事件
     */
    onDetailSubmit() {
      this.showingDetail = false;
      this.$refs.memberList.search();
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
//* 通用：页面内容布局 */
.layout-content-main {
  background: none;

  .ivu-btn,
  .ivu-select,
  .ivu-input {
    height: 36px;
  }

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
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    border: solid 1px #d3dce6;
  }
}
</style>
