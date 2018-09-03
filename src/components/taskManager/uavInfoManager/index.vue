<template>
  <div id="gantaInfoManager">
    <Row class="formapRow">
      <i-col span="16" class="formapCol">
        <div id="map"></div>
      </i-col>
      <i-col span="8">
        <Form class="form1">
          <FormItem label="选择任务:">
            <Select>
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="table">
          <div style="padding: 10px 0">无人机列表</div>
          <Button type="primary" long>添加无人机</Button>
          <Table border :columns="columns" :data="tableData"></Table>
        </div>
      </i-col>
    </Row>
    <Modal v-model="createTaskModel" fullscreen scrollable  ok-text="提交并保存" title="无人机详情" >
      <div>
        <uav-info-edit ref="child" v-on:closeModal="closeModal"></uav-info-edit>
      </div>
    </Modal>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import uavInfoEdit from './uavInfoEdit'
  import Tool from '../../../js/tool.js'

  export default {
    components:{
      uavInfoEdit
    },
    data() {
      return  {
        map: null,
        drewList:[],
        loadingList:[],
        createTaskModel:false,
        columns: [],
        posRecord:[],// 记录已选杆塔的坐标
        tableData: [{ name: 'John Brown',age: 18,address: '2018.9.12'},{ name: 'John Brown',age: 18,address: '2018.9.12'},{ name: 'John Brown',age: 18,address: '2018.9.12'}]
      }
    },
    created(){
      this.tableData.forEach((item,index) => {
        this.loadingList.push(false)
      })
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
            col.push({title: '名称',key: 'name',align: 'center'})
            col.push({title: '位置',key: 'name',align: 'center'})
            col.push({title: '详情',key: 'name',align: 'center'})
            let tem = {title: '编辑',key: 'action',width: 160,align: 'center',
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
                          size: 'small',
                          loading: this.loadingList[params.index]
                        },
                        on: {
                          click: () => {
                            console.log(this.loadingList)
                            this.loadingList[params.index] = true
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
          this.loadingList[num] = false
          AMap.event.clearListeners(this.map,'click')
        })
      }
    },
    watch: {
      
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
