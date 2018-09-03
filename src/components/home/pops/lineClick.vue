// 缺陷弹出框
<template>
    <div class="box">
        <div class="title">
            线路详情
        </div>
        <div class="pos textDiv">
            <span>
                线路名称:
            </span>
            <span>
                沪蓉线
            </span>
        </div>
         <div class="textDiv">
            <span>
                线路杆塔总量:
            </span>
            <span>
                123
            </span>
        </div>
        <div class="type textDiv">
            <span>
                缺陷情况:
            </span>
            <span>
                文本标签
            </span>
        </div>
        <div class="img">
            <img/>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                
            }
        },
        methods: {
            
        }
    }

</script>
<style scoped lang="scss" rel="stylesheet/scss">
    .box{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 400px;
        height: 386px;
        background: #fff;
        border: 1px solid #b4b4b4;
        .title{
            width: 100%;
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-weight: bold;
            font-size: 16px;
            color: #0884e6;
            border-bottom: 1px solid #b4b4b4;
        }
        .textDiv{
            height: 30px;
            margin-top: 10px;
            line-height: 30px;
            span{
                font-size: 14px;
            }
            span:nth-child(1){
                display: inline-block;
                width: 100px;
                margin-left: 30px;
            }
            span:nth-child(2){
                margin-left: 10px;
            }
        }
        .img{
            img{
                width: 360px;
                height: 200px;
                margin-left: 20px;
                margin-top: 10px;
            }
        }
    }
</style>

