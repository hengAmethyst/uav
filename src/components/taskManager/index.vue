<template>
    <div class="box">
        <div class="top">
            <div class="project-name">UAV巡检管控平台</div>
            <div class="btn-box">
                <div class="quite">
                    退出
                </div>
                <Button class="change-btn" to="/home">返回主页</Button>
            </div>
        </div>
        <div id="container">
          <div class="nav">
            <Menu active-name="1-1" :open-names="['1']">
              <MenuGroup title="UAV巡检任务管理">
              <Submenu name="1">
                <template slot="title">
                  <Icon type="ios-paper" />
                  任务管理
                </template>
                <MenuItem name="1-1" to="/taskManager/taskDetail">任务详情</MenuItem>
              </Submenu>
              <Submenu name="2">
                <template slot="title">
                  <Icon type="ios-people" />
                  任务内容管理
                </template>
                <MenuItem name="2-1" to="/taskManager/gantaInfoManager">杆塔信息管理</MenuItem>
                <MenuItem name="2-2" to="/taskManager/issuesInfoManager">缺陷信息管理</MenuItem>
                <MenuItem name="2-3" to="/taskManager/personInfoManager">人员信息管理</MenuItem>
                <MenuItem name="2-4" to="/taskManager/uavInfoManager">无人机信息管理</MenuItem>
                <MenuItem name="2-5" to="/taskManager/sectionInfoManager">区间管理</MenuItem>
              </Submenu>
              </MenuGroup>
            </Menu>
          </div>
            <div class="container-main">
              <router-view>

              </router-view>
            </div>
        </div>
    </div>

</template>
<script>
    export default {
        data () {
            return {
            }
        },
        mounted(){
        },
        methods: {

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
    #container{
      position: absolute;
      top:115px;
      right:0px;
      left:0px;
      bottom:0px;
      .nav{
        height:100%;
        width:240px;
        ul{
          height:100%;
        }
      }
      .container-main{
        position: absolute;
        left:240px;
        right:0px;
        bottom:0px;
        top:0px;
      }
    }
}

</style>
