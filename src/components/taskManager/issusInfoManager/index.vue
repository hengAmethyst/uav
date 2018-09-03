<template>
  <div id="issusInfoManager">
    <div class="taskDetail-header">
      <Row type="flex" className="header-row" align="middle">
        <i-col span="5">
          <Form :label-width="80">
            <FormItem label="选择任务:">
              <Select>
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
          </Form>
        </i-col>
      </Row>
      <Row>
        <Form :label-width="80">
        <i-col span="2">
          <Button type="primary" v-on:click="createTaskModel=true">添加缺陷</Button>
        </i-col>
        <i-col span="6">
          <FormItem label="电压等级">
            <Select>
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="线路">
            <Select>
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="杆塔">
            <Select>
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
        </i-col>
        </Form>
      </Row>
    </div>
    <div class="main">
      <Table border :columns="columns" :data="data6"></Table>
    </div>
    <Modal v-model="createTaskModel" fullscreen scrollable  	 ok-text="提交并保存" title="新建缺陷" >
      <div>
        <issus-info-edit ref="child" v-on:closeModal="closeModal"></issus-info-edit>
      </div>
    </Modal>
  </div>
</template>
<script>
  import issusInfoEdit from './issusInfoEdit'

  export default {
    components:{
      issusInfoEdit
    },
    data() {
      return  {
        createTaskModel:false,
        columns: [
          {
            title: '任务名称',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ]);
            }
          },
          {
            title: '任务路线',
            key: 'age'
          },
          {
            title: '任务开始时间',
            key: 'address'
          },
          {
            title: '任务结束时间',
            key: 'address'
          },
          {
            title: '任务范围',
            key: 'address'
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
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
//                      this.show(params.index)
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
                      this.remove(params.index)
                    }
                  }
                }, '完成')
              ]);
            }
          }
        ],
        data6: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park'
          }
        ]
      }
      
    },
    mounted() {
    },
    methods: {
      // 由父组件来控制关闭modal框
      closeModal(){
        this.createTaskModel = false
      },
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  #issusInfoManager{
    width: 100%;
    height: 100%;
    .header-row{
      margin:25px 0;
    }
    .main {
      padding: 0 40px;
    }
    .taskDetail-header {
      padding: 20px 40px;
      .select-span-label{
          margin-right:10px;
      }
      .search {
        text-align: right;
      }
    }

  }
</style>
