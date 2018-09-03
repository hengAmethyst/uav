<template>
  <div id="gantaInfoManager">
    <Row class="formapRow">
      <i-col span="16" class="formapCol">
        <div id="map"></div>
      </i-col>
      <i-col span="8">
        <Form class="form1">
          <FormItem label="选择任务:">
            <Select v-model="nowTask">
              <Option v-for="(item,index) in taskList" :value="item" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
        </Form>
        <Form>
          <FormItem label="电压等级" class="form2">
            <Select v-model="nowLevel">
              <Option v-for="(item,index) in levelList" :key="index" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
        </Form>
        <Form>
          <FormItem label="选择线路" class="form2">
            <Select v-model="nowLine">
              <Option v-for="(item,index) in lineList" :key="index" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="table">
          <div style="padding: 10px 0">杆塔列表</div>
          <Table border :columns="columns" :data="tableData"></Table>
        </div>
      </i-col>
    </Row>
    <Modal v-model="createTaskModel" fullscreen scrollable ok-text="提交并保存" title="杆塔详情">
      <div>
        <ganta-info-edit ref="child" v-on:closeModal="closeModal"></ganta-info-edit>
      </div>
    </Modal>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import gantaInfoEdit from './gantaInfoEdit'
  import Tool from '../../../js/tool.js'

  export default {
    components:{
      gantaInfoEdit
    },
    data() {
      return  {
        map: null,
        drewList:[],
        createTaskModel:false,
        columns: [],
        posRecord:[],// 记录已选杆塔的坐标
        taskList:['任务1','任务2','任务3','任务4'],//任务列表
        nowTask: null,// 选中的任务
        levelList:['1000v','2000v','3000v','4000v'],//电压列表
        nowLevel: null,// 选中电压
        lineList:['路线1','路线2'],
        nowLine: null,
        tableData: [{ name: 'John Brown',pos: '已配置',detail: '2018.9.12'},{ name: 'John Brown',pos: '已配置',detail: '2018.9.12'},{ name: 'John Brown',pos: '已配置',detail: '2018.9.12'}],
      }
    },
   mounted(){
        let map = new AMap.Map('map', {
            zoom: 14
        })
        this.map = map
        this.columns = this.generateColumns()
    },
    methods: {
      // 由父组件来控制关闭modal框
      closeModal(){
        this.createTaskModel = false
      },
      generateColumns(){
        let col = []
            col.push({title: '杆号',key: 'name',align: 'center'})
            col.push({title: '位置',key: 'pos',align: 'center'})
            col.push({title: '详情',key: 'detail',align: 'center'})
            let tem = {title: '编辑',key: 'action',width: 140,align: 'center',
                  render: (h, params) => {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'primary',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.createTaskModel=true;
                          }
                        }
                      }, '编辑'),

                      h('Button', {
                        props: {
                          type: 'success',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.drawPos(params.index)
                          }
                        }
                      }, this.drewList[params.index]?'更改':'位置')
                    ]);
                  }}

        col.push(tem)
        return col
      },  
      drawPos(num){
        AMap.event.addListener(this.map,"click",(e)=>{
          let pos = []
          pos.push(e.lnglat.getLng())
          pos.push(e.lnglat.getLat())
          if(this.drewList[num]){
            this.map.remove(this.drewList[num])
          }
          this.drewList.splice(num,1,Tool.posGanta(this.map,pos,'https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png'))
          this.posRecord.splice(num,1,pos)
          AMap.event.clearListeners(this.map,'click')
        })
      }
    },
    watch: {
      nowTask(){
        console.log(this.nowTask)
      }
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  #gantaInfoManager{
    width: 100%;
    height: 100%;
    .formapRow{
       height:100% ;
     }
    .formapCol{
      height: 100% ;
    }
    #map{
      height:100%;
    }
    .form1,.form2{
      padding: 10px 40px;
    }
    .table{
      width: 100%;
      padding: 10px 40px;
    }
  }
</style>
