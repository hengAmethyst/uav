<template>
    <div class="box">
        <div class="title">
            005杆塔信息
        </div>
        <div class="nav">
            <div class="nav-content">
                <div class="nav-label" v-for="(item,index) in navs" :key="index" @click="changeNav(index)"  :style="{'background': showWhichNav==index ? '#116bd1': '#fefefe','color': showWhichNav==index ? '#fff':'#000'}">{{item}}</div>
            </div>
        </div>
        <div v-if="showWhichNav==0">
            <div class="pos textDiv">
                <span>
                    杆塔号:
                </span>
                <span>
                    xx线xx杆塔
                </span>
            </div>
            <div class="type textDiv">
                <span>
                    杆塔类别:
                </span>
                <span>
                    文本标签
                </span>
            </div>
            <div class="level textDiv">
                <span>
                    所属路线:
                </span>
                <span>
                    严重
                </span>
            </div>
            <div class="level textDiv">
                <span>
                    缺陷信息:
                </span>
                <span>
                    严重
                </span>
            </div>
            <div class="img">
                <div>
                    <span>
                        杆塔图:
                    </span>
                </div>
                <img/>
            </div>
        </div>
        <div v-if="showWhichNav==1">
            巡检记录
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            navs: ['基本信息','巡检记录','3D图'],
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
                height: 180px;
                margin-left: 20px;
                margin-top: 20px;
            }
        }
    }
 </style>
 

