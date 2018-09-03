<template>
    <div class="box">
        <div class="top">
            <div class="project-name">UAV巡检管控平台</div>
            <div class="btn-box">
                <div class="quite">
                    退出
                </div>
                <i-button class="change-btn" to="/taskManager">任务管理</i-button>
            </div>

        </div>
        <!-- 地图 -->
        <div id="container" class="map"></div>

        <div class="control">
            <div class="nav-box">
                <div class="nav-title" v-for="(item,index) in navSeries.level_1.navNames" :key="index" @click="navChoose(index,'level_1')" :style="{ 'background': navSeries.level_1.navIndex==index ? '#116bd1': '#b5b5b5' }">{{item}}</div>
            </div>
            <!-- 内容 -->
            <!-- 时间 -->
            <div class="nav1-content" v-if="navSeries.level_1.navIndex == 0">
                <div class="nav1-title">
                    <div class="nav1-title-btn" v-for="(item,index) in navSeries.level_2.group_1.navNames" :key="index" :style="{ 'background': navSeries.level_2.group_1.navIndex==index ? '#116bd1': '#b5b5b5' }" @click="navChoose(index,'level_2_1')">{{item}}</div>
                </div>
                <div class="inner" v-if="navSeries.level_2.group_1.navIndex == 0">
                    <i-button class="now-data">当前数据</i-button>
                </div>
            </div>
            <!-- 任务/线路 -->
            <div class="nav2-content" v-if="navSeries.level_1.navIndex == 1">
                <div class="nav2-title">
                    <div class="nav2-title-btn" v-for="(item,index) in navSeries.level_2.group_2.navNames" :key="index" :style="{ 'background': navSeries.level_2.group_2.navIndex==index ? '#116bd1': '#b5b5b5' }" @click="navChoose(index,'level_2_2')">{{item}}</div>
                </div>
                <div class="inner" v-if="navSeries.level_2.group_2.navIndex == 0">
                    <Checkbox v-for="(item,index) in checkboxSeries.tasks.labelNames" :key="index" v-model="checkboxSeries.tasks.isChecked[index]">{{item}}</Checkbox>
                </div>
                <div class="inner" v-if="navSeries.level_2.group_2.navIndex == 1">
                    <Checkbox v-for="(item,index) in checkboxSeries.lines.labelNames" :key="index" v-model="checkboxSeries.lines.isChecked[index]">{{item}}</Checkbox>
                </div>
            </div>
            <!-- 图层 -->
            <div class="nav3-content" v-if="navSeries.level_1.navIndex == 2">
                <Checkbox v-for="(item,index) in checkboxSeries.picLayer.labelNames" :key="index" v-model="checkboxSeries.picLayer.isChecked[index]" :disabled="index==checkboxSeries.picLayer.isChecked.length-1?true:false">{{item}}</Checkbox>
            </div>
        </div>
        <flawPop v-if="popSeries.flaw.show" :info="popSeries.flaw.infoList"/>
        <ganta v-if="popSeries.ganta.show" :info="popSeries.ganta.infoList"/>
        <uav v-if="popSeries.uav.show" :info="popSeries.uav.infoList"/>
        <personInfo v-if="popSeries.person.show" :info="popSeries.person.infoList"/>
        <lineClick v-if="popSeries.line.show" :info="popSeries.line.infoList"/>
        <!-- <photo/> -->
    </div>

</template>
<script>
    import AMap from 'AMap';   //在页面中引入高德地图
    import Tool from '../../js/tool'
    import flawPop from './pops/flaw.vue'
    import ganta from './pops/ganta.vue'
    import uav from './pops/uav.vue'
    import personInfo from './pops/personInfo.vue'
    import lineClick from './pops/lineClick.vue'
    import photo from './pops/photo.vue'
    export default {
        data () {
            return {
                zoom: 14,//地图比例
                map: {},// 存放地图实例
                // 导航系列
                navSeries: {
                    level_1:{
                        navNames:['时间','任务/线路','图层'],
                        navIndex: -1
                    },
                    level_2:{
                        group_1:{
                            navNames:['实时','历史'],
                            navIndex: 0
                        },
                        group_2:{
                            navNames:['按任务','按线路'],
                            navIndex: 0
                        }
                    }
                },
                // checkbox 系列
                checkboxSeries: {
                    tasks:{
                        labelNames:['任务1','任务2','任务3','任务1','任务2','任务3'],
                        isChecked:[false,false,false,false,false,false]
                    },
                    lines:{
                        labelNames:['二蓉线','灌成线','沪成线','二蓉线','灌成线','沪成线'],
                        isChecked:[false,false,false,false,false,false]
                    },
                    picLayer:{
                        labelNames:['线路/杆塔','缺陷','人员','无人机','人员轨迹'],
                        isChecked:[true,true,true,true,true]
                    }
                },
                // 地图已展示系列
                drewSeries: {
                    line:[],
                    circle:[],
                    flaw:[],
                    person:[],
                    uav:[]
                },
                // 弹框系列
                popSeries:{
                    flaw:{
                        show: false,
                        infoList:[
                            {
                                pos: '京蓉线',
                                type: '线损坏',
                                level: '严重',
                                img: ''
                            },
                            {
                                pos: '沪蓉线',
                                type: '节点损坏',
                                level: '一般',
                                img: ''
                            },
                            {
                                pos: '123线',
                                type: '11',
                                level: '12',
                                img: ''
                            }
                        ]
                    },
                    ganta:{
                        show: false,
                        infoList:[]
                    },
                    person:{
                        show: false,
                        infoList:[]
                    },
                    uav:{
                        show: false,
                        infoList:[]
                    },
                    line:{
                        show: false,
                        infoList:[]
                    }
                }
            }
        },
        components: {
            flawPop,
            ganta,
            uav,
            personInfo,
            lineClick,
            photo
        },
        mounted(){
            let map = new AMap.Map('container', {
                zoom: this.zoom
            })
            this.map = map
            this.displayLine()
            map.on('click',() => {
                for(let item in this.popSeries){
                    this.popSeries[item].show = false
                }
            })
        },
        methods: {
            displayLine(showList){
                // mock数据
                showList = [
                    {
                        taskId:1,
                        id: 1,
                        lineArray: [
                            [104.107363,30.646983],
                            [104.041617,30.655844],
                            [104.092772,30.668617],
                            [104.065563,30.668617],
                        ],
                        flawArray: [
                            [104.107363,30.646983],
                            [104.041617,30.655844]
                        ],
                        circleArray: [
                            [104.107363,30.646983],
                            [104.041617,30.655844],
                            [104.092772,30.668617],
                            [104.065563,30.668617],
                        ],
                        personArray: [
                            [104.107363,30.646983],
                            [104.041617,30.655844]
                        ],
                        uavArray: [
                            [104.041617,30.655844]
                        ]
                    },
                    {
                        taskId:2,
                        id: 2,
                        lineArray: [
                            [104.024365,30.671127],
                            [104.061873,30.674375],
                            [104.088652,30.683381],
                            [104.133885,30.666624],
                        ],
                        flawArray: [
                            [104.045479,30.675925]
                        ],
                        circleArray: [
                            [104.024365,30.671127],
                            [104.061873,30.674375],
                            [104.088652,30.683381],
                            [104.133885,30.666624],
                        ],
                        personArray: [
                            [104.053633,30.677328]
                        ],
                        uavArray: [
                            [104.116203,30.674006]
                        ]
                    },
                ]
                if(this.navSeries.level_2.group_2.navIndex == 0){
                    // 按任务展示
                    this.checkboxSeries.tasks.isChecked.forEach((item,index) => {
                        if(item){
                            showList.forEach((value,i) => {
                                if(value.taskId == index + 1){
                                    this.drawOneLine(value)
                                }
                            })
                            
                        }
                    })
                    // 清空
                    this.checkboxSeries.lines.isChecked.forEach((item,index) => {
                        this.checkboxSeries.lines.isChecked[index] = false
                    })
                }
                else{
                    // 按线路展示
                    this.checkboxSeries.lines.isChecked.forEach((item,index) => {
                        if(item){
                            this.drawOneLine(showList[index])
                        }
                    })
                    // 清空
                    this.checkboxSeries.tasks.isChecked.forEach((item,index) => {
                        this.checkboxSeries.tasks.isChecked[index] = false
                    })
                }
            },
            drawOneLine(data){
                // 线、杆塔
                if(this.checkboxSeries.picLayer.isChecked[0]){
                    this.drewSeries.line.push(Tool.drawLine(this.map,data.lineArray,this))
                    this.drewSeries.circle.push(Tool.drawCircle(this.map,data.circleArray,this))
                }
                else{
                    this.drewSeries.line.forEach(item => {
                        this.map.remove(item)
                    })
                    this.drewSeries.circle.forEach(item => {
                        this.map.remove(item)
                    })
                }
                // 缺陷
                if(this.checkboxSeries.picLayer.isChecked[1]){
                    this.drewSeries.flaw.push(Tool.addMarker(this.map,data.flawArray,'https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',this,'flaw'))
                }
                else{
                    this.drewSeries.flaw.forEach(item => {
                        this.map.remove(item)
                    })
                }
                // 人员
                if(this.checkboxSeries.picLayer.isChecked[2]){
                    this.drewSeries.person.push(Tool.addMarker(this.map,data.personArray,'https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',this,'person'))
                }
                else{
                    this.drewSeries.person.forEach(item => {
                        this.map.remove(item)
                    })
                }
                // 无人机
                if(this.checkboxSeries.picLayer.isChecked[3]){
                    this.drewSeries.uav.push(Tool.addMarker(this.map,data.uavArray,'https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',this,'uav'))
                }
                else{
                    this.drewSeries.uav.forEach(item => {
                        this.map.remove(item)
                    })
                }
            },
            // 清除所有地图上画的东西
            clearAllDraw(){
                let list = ['line','circle','person','uav','flaw']
                    list.forEach(item => {
                        this.drewSeries[item].forEach(i => {
                            this.map.remove(i)
                        })
                        this.drewSeries[item] = []
                    })
            },
            navChoose(e,type){
                switch(type){
                    case 'level_1': this.navSeries.level_1.navIndex = e
                    break;
                    case 'level_2_1': this.navSeries.level_2.group_1.navIndex = e
                    break;
                    case 'level_2_2': this.navSeries.level_2.group_2.navIndex = e
                    break;
                }
            },
        },
        watch: {
            checkboxSeries: {
                deep: true,
                handler:function(){
                    this.clearAllDraw()
                    this.displayLine()
                }
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
.box{
    width: 100%;
    .top{
        width: 100%;
        height: 115px;
        background: linear-gradient(#058cec,#0a7ee1,#155ec6); /* 标准的语法 */
        .project-name{
            float: left;
            margin-left: 22px;
            margin-top: 18px;
            font-size: 24px;
            color: #fff;
        }
        .btn-box{
            float: right;
            .quite{
                margin-top: 18px;
                margin-right: 26px;
                text-align: right;
                color: #fff;
                cursor:pointer;
            }
            .change-btn{
                float: right;
                margin-top: 22px;
                margin-right: 16px;
                color: #0d75d9;
                border: none;
            }
        }

    }
    .map {
        width: 100%;
        height: 820px;
    }
    .control{
        position: fixed;
        top: 120px;
        right: 14px;
        width: 250px;
        height: 220px;
        background: #fff;
        border: 1px solid #b5b5b5;
        .nav-box{
            float: left;
            .nav-title{
                float: left;
                width: 80px;
                height: 30px;
                margin-top: 2px;
                margin-left: 2px;
                text-align: center;
                line-height: 30px;
                font-size: 13px;
                color: #fff;
                background: #b5b5b5;
            }
        }
        .nav1-content{
            float: left;
            width: 100%;
            height: 185px;
            .nav1-title{
                float: left;
                .nav1-title-btn{
                    float: left;
                    width: 80px;
                    height: 30px;
                    margin-top: 2px;
                    margin-left: 2px;
                    text-align: center;
                    line-height: 30px;
                    font-size: 13px;
                    color: #fff;
                    background: #b5b5b5;
                }
            }
            .inner{
                position: relative;
                float: left;
                width: 100%;
                height: 154px;
                .now-data{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    color: #116bd1;
                    background: #fff;
                    border: 1px solid #116bd1;
                }
            }
        }
        .nav2-content{
            float: left;
            width: 100%;
            height: 185px;
            .nav2-title{
                float: left;
                .nav2-title-btn{
                    float: left;
                    width: 80px;
                    height: 30px;
                    margin-top: 2px;
                    margin-left: 2px;
                    text-align: center;
                    line-height: 30px;
                    font-size: 13px;
                    color: #fff;
                    background: #b5b5b5;
                }
            }
            .inner{
                position: relative;
                float: left;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                height: 154px;
                overflow: scroll;
                color: #116bd1;
                background: #fff;
                .ivu-checkbox-wrapper{
                    margin-top: 10px;
                    span:nth-child(2){
                        margin-left: 10px;
                    }
                }
            }
        }
        .nav3-content{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            label{
                margin-left: 30%;
                margin-top: 15px;
                color: #116bd1;
            }
        }
    }
}

</style>
