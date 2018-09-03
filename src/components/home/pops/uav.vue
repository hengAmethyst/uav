// 缺陷弹出框
<template>
    <div class="box">
        <div class="title">
            无人机状态
        </div>
        <div class="pos textDiv">
            <span>
                无人机类别:
            </span>
            <span>
                xx线xx杆塔
            </span>
        </div>
        <div class="type textDiv">
            <span>
                吊舱状态:
            </span>
            <span>
                文本标签
            </span>
        </div>
        <div class="level textDiv">
            <span>
                任务执行状态:
            </span>
            <span>
                严重
            </span>
        </div>
        <div class="textDiv">
            <span>
                当前坐标:
            </span>
            <span>
                严重
            </span>
        </div>
        <div class="img">
            <div>
                <span>
                    外观图:
                </span>
            </div>
            <img/>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                navs:['缺陷1','缺陷2','缺陷3'],
                showWhichNav: 0
            }
        },
        methods: {
            changeNav(e){
                this.showWhichNav = e
            }
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
        height: 450px;
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
            margin-top: 6px;
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
            margin-top: 10px;
            span{
                margin-left: 30px;
                font-size: 14px;
            }
            img{
                width: 360px;
                height: 200px;
                margin-left: 20px;
                margin-top: 10px;
            }
        }
    }
</style>

