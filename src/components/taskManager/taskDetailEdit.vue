<template>
  <div id="taskDetailEdit">
    <Card class="card">
      <Row class-name="row">
        <i-col span="7" class-name="input-col">
          <span class="input-label">任务名称: </span>
          <i-input placeholder="请输入..." style="width: 300px"></i-input>
        </i-col>
        <i-col span="8">
          <span class="input-label">任务公司: </span>
          <i-input placeholder="请输入..." style="width: 300px"></i-input>
        </i-col>
      </Row>
    </Card>
    <Card title="任务内容" icon="ios-options" :padding="10" class="card">
      <CellGroup>
        <Row class-name="row">
          <i-col span="5" class-name="input-col">
            <span class="input-label">电压等级: </span>
            <i-input placeholder="请输入..." style="width: 150px"></i-input>
          </i-col>
          <i-col span="5">
            <span class="input-label">线路名称: </span>
            <i-input placeholder="请输入..." style="width: 150px"></i-input>
          </i-col>
          <i-col span="7">
            <span class="input-label">杆塔范围: </span>
            <i-input placeholder="请输入..." style="width: 150px"></i-input>
            <span class="input-label">-</span>
            <i-input placeholder="请输入..." style="width: 150px"></i-input>
          </i-col>
          <i-col span="2">
            <Button type="success">添加巡检段</Button>
          </i-col>
        </Row>
      </CellGroup>
      <CellGroup>
        <Table border :columns="columns7" :data="data6"></Table>
      </CellGroup>
    </Card>
    <Card class="card">
      <Row class-name="row">
        <i-col span="7" class-name="input-col">
          <span class="input-label">使用设备: </span>
          <i-input placeholder="请输入..." style="width: 300px"></i-input>
        </i-col>
      </Row>
      <Row class-name="row">
        <i-col span="7" class-name="input-col">
          <span class="input-label">挂载设备: </span>
          <i-input placeholder="请输入..." style="width: 300px"></i-input>
        </i-col>
      </Row>
      <Row class-name="row">
        <i-col span="7" class-name="input-col">
          <span class="input-label">巡检类别: </span>
          <i-input placeholder="请输入..." style="width: 300px"></i-input>
        </i-col>
      </Row>
      <Row class-name="row">
        <i-col span="18" class-name="input-col">
          <span class="input-label">起止时间: </span>
          <DatePicker format="yyyy/MM/dd" placeholder="开始日期" style="width: 200px" class="date-picker"></DatePicker>
          <TimePicker type="time" format="HH-mm" placeholder="开始时间" style="width: 168px" class="date-picker"></TimePicker>
          <span>--</span>
          <DatePicker format="yyyy/MM/dd" placeholder="结束日期" style="width: 200px" class="date-picker"></DatePicker>
          <TimePicker type="time" format="HH-mm" placeholder="结束时间" style="width: 168px" class="date-picker"></TimePicker>
        </i-col>
      </Row>
      <Row class-name="row">
        <i-col span="7" class-name="input-col">
          <span class="input-label">执 &nbsp;行&nbsp;人:    </span>
          <i-input placeholder="请输入..." style="width: 300px"></i-input>
        </i-col>
      </Row>
    </Card>
  </div>
</template>
<script>
  import ICol from "iview/src/components/grid/col";

  export default {
    components: {ICol},
    data() {
      return {
        columns7: [
          {
            title: '电压等级',
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
            title: '线路名称',
            key: 'age'
          },
          {
            title: '杆塔范围',
            key: 'address'
          },
          {
            title: '编辑',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, 'Delete')
              ]);
            }
          }
        ],
        data6: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park'
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
  #taskDetailEdit {
    padding: 40px;
    .row {
      margin: 20px 0;
    }
    .input-label {
      margin-right: 10px;
      margin-left: 10px;
    }
    .input-col {
      padding: 0 20px;
    }
    .card {
      margin-bottom: 10px;
    }
    .date-picker {
      display: inline-block;
    }
  }

</style>
