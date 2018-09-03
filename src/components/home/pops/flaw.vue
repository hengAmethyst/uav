// 缺陷弹出框
<template>
    <div class="box">
        <div class="title">
            缺陷信息
        </div>
        <div class="nav">
            <div class="nav-content">
                <div class="nav-label" v-for="(item,index) in info" :key="index" @click="changeNav(index)"  :style="{'background': showWhichNav==index ? '#116bd1': '#fefefe','color': showWhichNav==index ? '#fff':'#000'}">缺陷{{index+1}}</div>
            </div>
        </div>
        <div class="pos textDiv">
            <span>
                缺陷位置:
            </span>
            <span>
               {{nowData.pos}}
            </span>
        </div>
        <div class="type textDiv">
            <span>
                缺陷类别:
            </span>
            <span>
                {{nowData.type}}
            </span>
        </div>
        <div class="level textDiv">
            <span>
                缺陷级别:
            </span>
            <span>
                {{nowData.level}}
            </span>
        </div>
        <div class="img">
            <div>
                <span>
                    缺陷图片:
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
                showWhichNav: 0,
                nowData: null
            }
        },
        props:['info'],
        methods: {
            changeNav(e){
                this.showWhichNav = e
                this.nowData = this.info[e]
            }
        },
        mounted(){
            this.nowData = this.info[0]
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
        height: 500px;
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
        .nav{
            width: 100%;
            margin-top: 10px;
            text-align: center;
            .nav-content{
                display: inline-block;
                margin: 0 auto;
                border-top: 1px solid #b4b4b4;
                border-bottom: 1px solid #b4b4b4;
                border-left: 1px solid #b4b4b4;
            }
            .nav-label{
                display: inline-block;
                width: 100px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                color: #000;
                border-right: 1px solid #b4b4b4;
                background: #fefefe;
                cursor: pointer;
            }
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
            margin-top: 10px;
            span{
                margin-left: 30px;
                font-size: 14px;
            }
            img{
                width: 360px;
                height: 200px;
                margin-left: 20px;
                margin-top: 20px;
            }
        }
    }
</style>

