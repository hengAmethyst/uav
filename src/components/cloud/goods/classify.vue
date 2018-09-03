<template>
    <div class="classify">
		<div class="classifyname"><Icon style='font-size: 12px;color: red;margin-right: 10px;' type="asterisk"></Icon>分类名称</div>
		<Input v-model="value" placeholder="请输入..." class="classifyInput" style="margin-top: 10px;"></Input>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
    	data () {
            return {
                value: ''
            }
        }
    	
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	.classifyname{
		font-family: PingFangSC;
		font-size: 14px;
		text-align: left;
		color: #475669;
	}
	.classifyInput{
		  width: 380px;
		  height: 36px;
		  border-radius: 2px;
		  background-color: #ffffff;
		  margin-top: 5px;
		  margin-bottom: 64px;
	}
</style>