<template>
  <div id="taskDetail">
    <div class="taskDetail-header">
      <Row>
        <i-col span="12">
          <Button type="primary" v-on:click="createTaskModel=true">创建任务</Button>
        </i-col>
        <i-col span="12" class="search">
          <i-input icon="ios-search" placeholder="请输入..." style="width: 200px"></i-input>
          <Button type="primary" icon="ios-search">查询</Button>
        </i-col>
      </Row>

    </div>
    <div class="main">
      <Table border :columns="columns" :data="data6"></Table>
      <div>
        <Row class="page">
          <Page :total="100"/>
        </Row>
      </div>
    </div>
    <Modal v-model="createTaskModel" fullscreen scrollable  	 ok-text="提交并保存" title="新建巡查任务" >
      <div>
        <task-detail-edit>
        </task-detail-edit>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 编辑完之后，点击完成，编辑按钮变成 查看详情,完成按钮变灰，-> 已完成
   */
  import taskDetailEdit from './taskDetailEdit'
  export default {
    components:{
      taskDetailEdit
    },
    data() {
      return {
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
    methods: {}
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  #taskDetail {
    width: 100%;
    height: 100%;
    .main {
      padding: 0 40px;
    }
    .taskDetail-header {
      padding: 20px 40px;
      .search {
        text-align: right;
      }
    }
    .page {
      margin-top: 30px;
      text-align: center;
    }
  }

</style>
