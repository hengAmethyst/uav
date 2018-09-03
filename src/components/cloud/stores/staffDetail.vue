<template>
  <div>
    <h2 class="title">基本信息</h2>
    <div class="content clearfix">
      <div class="left">
        <span class="item">工号：{{staffInfo.employeeNo}}</span>
        <span class="item" v-if="type==='serving'">姓名：{{staffInfo.userName}}</span>
        <span class="item" v-else>姓名：{{staffInfo.name}}</span>
        <span class="item">性别：{{staffInfo.sex===0?'女':'男'}}</span>
        <span class="item" v-if="type==='serving'">手机号：{{staffInfo.mobile}}</span>
        <span class="item" v-else>手机号：{{staffInfo.phone}}</span>
        <span class="item" style="width: 340px;" v-if="type==='serving'">身份证号码：{{staffInfo.idNumber}}</span>
        <span class="item" style="width: 340px;" v-else>身份证号码：{{staffInfo.idCard}}</span>
        <span class="item" style="width: 340px;">住址：{{staffInfo.contactAddress}}</span>
        <span class="item">紧急联系人：{{staffInfo.urgentName}}</span>
        <span class="item">紧急联系人手机：{{staffInfo.urgentPhone}}</span>
      </div>
      <div class="right">
        <img :src="staffInfo.headImagePath" width="144" height="144" v-if="type==='serving'">
        <img :src="staffInfo.headPortrait" width="144" height="144" v-else>
      </div>
    </div>

    <div class="line"></div>

    <h2 class="title">工作信息</h2>
    <div class="content">
      <span class="item">部门：{{staffInfo.departmentName}}</span>
      <span class="item">岗位：{{staffInfo.positionName}}</span>
      <span class="item">角色：{{staffInfo.roleName}}</span>
      <!--<span class="item">所属门店：</span>-->
      <span class="item">入职日期：{{staffInfo.updateTime | formatDate}}</span>
      <span class="item" v-if="type==='exit'">入职日期：{{staffInfo.endTime}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '../../../common/js/date'

export default {
  props: {
    staffInfo: {
      type: Object
    },
    type: {
      type: String
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd')
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.title {
  position: relative;
  padding-left: 16px;
  margin-bottom: 24px;
  height: 25px;
  line-height: 25px;
  font-size: 18px;
  color: #1f2d3d;
  &:before {
    position: absolute;
    display: block;
    content: "";
    left: 0;
    top: 3px;
    width: 4px;
    height: 18px;
    background: #ff4949;
    z-index: 10;
  }
}

.line {
  margin-bottom: 24px;
  width: 100%;
  height: 1px;
  background: #e5e9f2;
}

.content {
  font-size: 0;
  .left {
    float: left;
    width: 340px;
    .item {
      margin-bottom: 24px;
      display: inline-block;
      width: 170px;
      color: #1f2d3d;
      font-size: 14px;
    }
  }
  .right {
    float: right;
    width: 144px;
    img {
      display: block;
    }
  }
  .item {
    margin-bottom: 24px;
    display: inline-block;
    width: 50%;
    color: #1f2d3d;
    font-size: 14px;
  }
}
</style>
