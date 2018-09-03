<template>
  <div class="record">
    <div class="record-head">
      <p class="amount">{{amount}}条</p>
      <p class="amount-desc">短信使用量</p>
    </div>
    <div class="record-content">
      <div v-for="record of records" :key="record.month">
        <Row class="month">
          <Col span="6">{{record.month}}</Col>
          <Col span="12">&nbsp;</Col>
          <Col span="6">本月使用：
          <span class="amount">{{record.amount}}条</span>
          </Col>
        </Row>
        <Row class="day" v-for="it of record.list" :key="it.day">
          <Col class="date" span="6">{{it.day}}</Col>
          <Col class="desc" span="12">{{it.desc}}</Col>
          <Col class="amount" span="6">{{it.amount}}条</Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    amount: {
      default: 0
    },
    records: {
      default: function() { return []; }
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
