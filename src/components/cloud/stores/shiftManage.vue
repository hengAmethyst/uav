<template>
  <div>
    <div style="margin-bottom: 16px;overflow: hidden">
      <div style="float: right;">
        <button class="add" @click="add">+新建</button>
      </div>
    </div>
    <Table ref="tableData" stripe :columns="shiftColumns" :data="shiftData" no-data-text="没有相关数据"></Table>

    <div style="overflow: hidden;margin-top: 32px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal
      class="modal-wrapper"
      v-model="addShift"
      title="新建餐段"
      :loading="loading"
      @on-ok="asyncOK"
      width="270px !important;">
      <h4 class="modal-title"><b style="color: #ff4949;margin-right: 5px;">*</b>餐段名称</h4>
      <Input v-model="shiftName" placeholder="请输入餐段名称" style="width: 229px;"></Input>

      <h4 class="modal-title" style="margin-top: 21px;"><b style="color: #ff4949;margin-right: 5px;">*</b>时间选择</h4>
      <Time-picker
        class="startTime"
        type="time"
        placement="bottom-end"
        placeholder="开始时间"
        open
        :editable="false"
        style="width: 112px;"
        format="HH:mm"
        :value="startTime"
        @on-change="handleStartTime"></Time-picker>
      <Time-picker
        class="endTime"
        type="time"
        placement="bottom-end"
        placeholder="结束时间"
        open
        :editable="false"
        style="margin-left:5px;width: 112px;"
        format="HH:mm"
        :value="endTime"
        @on-change="handleEndTime"></Time-picker>
      <Checkbox v-model="status" style="margin-top:165px;display: block">启用</Checkbox>
    </Modal>

    <Modal
      class="modal-wrapper"
      v-model="editShift"
      title="编辑餐段"
      :loading="loading"
      @on-ok="asyncOK"
      width="270px !important;">
      <h4 class="modal-title"><b style="color: #ff4949;margin-right: 5px;">*</b>餐段名称</h4>
      <Input v-model="shiftName" placeholder="请输入餐段名称"></Input>

      <h4 class="modal-title" style="margin-top: 21px;"><b style="color: #ff4949;margin-right: 5px;">*</b>时间选择</h4>
      <Time-picker
        class="startTime"
        type="time"
        placement="bottom-end"
        placeholder="开始时间"
        open
        :editable="false"
        style="width: 112px;"
        format="HH:mm"
        :value="startTime"
        @on-change="handleStartTime"></Time-picker>
      <Time-picker
        class="endTime"
        type="time"
        placement="bottom-end"
        placeholder="结束时间"
        open
        :editable="false"
        style="margin-left:5px;width: 112px;"
        format="HH:mm"
        :value="endTime"
        @on-change="handleEndTime"></Time-picker>
      <Checkbox v-model="status" style="margin-top:165px;display: block">启用</Checkbox>
    </Modal>

  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';

  const PAGESIZE = 10;

  export default {
    data() {
      return {
        shiftColumns: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '餐段名称',
            key: 'mealperiodName'
          },
          {
            title: '开始时间',
            key: 'mealperiodStartTime'
          },
          {
            title: '结束时间',
            key: 'mealperiodEndTime'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              return h('span', params.row.isUsedMealperiod === 0 ? '开启' : '禁用')
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  style: {
                    padding: '0',
                    marginRight: '32px',
                    width: '40px',
                    height: '24px',
                    borderRadius: '2px',
                    border: '1px solid #20a0ff',
                    lineHeight: '24px',
                    textAlign: 'center',
                    color: '#20a0ff',
                    fontSize: '13px',
                    background: '#fff',
                    verticalAlign: 'top'
                  },
                  on: {
                    click: () => {
                      this.edit(params.index)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  style: {
                    padding: '0',
                    width: '40px',
                    height: '24px',
                    borderRadius: '2px',
                    border: '1px solid #ff4949',
                    lineHeight: '24px',
                    textAlign: 'center',
                    color: '#ff4949',
                    fontSize: '13px',
                    background: '#fff'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          },
          {
            title: '状态切换',
            key: 'switch',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: params.row.isUsedMealperiod === 0
                  },
                  on: {
                    'on-change': () => {
                      this.change(params.index);
                    }
                  }
                }),
              ])
            }
          }
        ],
        shiftData: [],
        loading: true,
        type: '',
        shiftName: '',
//        oldName: '',
        selectedItemId: '',
        addShift: false,
        editShift: false,
        status: false,
        startTime: '',
        endTime: '',
        totalResult: 0,
        currentPage: 1,
        delId: []
      }
    },
    created(){
      this.getData();
    },
    methods: {
      handleStartTime(time){
        this.startTime = time;
        // console.log(time);
      },
      handleEndTime(time){
        this.endTime = time;
        // console.log(time)
      },
      getData() {
        this.$http.post(api.MERCHANT + 'getMealPeriodList',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              if (response.data.list) {
                this.shiftData = response.data.list;
              }else{
                this.shiftData = [];
              }
              this.totalResult = response.data.totalResult;
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      addData() {
        if (!this.shiftName) {
          this.$Message.error('必填信息不能为空');
          this.loading = false;
        } else if(this.startTime === '' || !this.endTime === ''){
          this.$Message.error('必填信息不能为空');
          this.loading = false;
        }else {
          this.$http.post(api.MCT_PERIOD + 'saveAddMealPeriodInfo',
            JSON.stringify(this.getParam('add')))
            .then(res => {
              // console.log(res);
              let response = res.body;
              if (response.code === 0) {
                this.loading = false;
                this.$Message.success('创建成功');
                this.addShift = false;
                this.getData();
              } else {
                this.$Message.error(response.msg);
                this.loading = false;
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      editData() {
        if (!this.shiftName) {
          this.$Message.error('必填信息不能为空');
          this.loading = false;
        }else if(this.startTime === '' || !this.endTime === ''){
          this.$Message.error('必填信息不能为空');
          this.loading = false;
        } else {
          this.$http.post(api.MCT_PERIOD + 'saveEditMealPeriodInfo',
            JSON.stringify(this.getParam('edit')))
            .then(res => {
              // console.log(res);
              let response = res.body;
              if (response.code === 0) {
                this.loading = false;
                this.$Message.success('修改成功');
                this.editShift = false;
                this.getData();
              } else {
                this.$Message.error(response.msg);
                this.getData();
                this.loading = false;
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      delData() {
        this.$http.post(api.MERCHANT + 'deleteMealPeriods',
          JSON.stringify(this.getParam('del')))
          .then(res => {
            // console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.loading = false;
              this.getData();
              this.$Message.success('删除成功');
            } else {
              this.loading = false;
              this.$Message.error('删除失败');
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      changePage(page){
        this.currentPage = page;
        this.getData();
      },
      deleteData() {
        this.$http.post()
      },
      add(){ // 添加班次操作弹窗
        this.type = 'add';
        this.addShift = true;
        this.shiftName = '';
        this.status = false;
        this.startTime = '';
        this.endTime = '';
      },
      edit(index) { // 编辑操作弹窗
        this.type = 'edit';
        this.editShift = true;
        this.selectedItemId = this.shiftData[index].id;
        this.shiftName = this.shiftData[index].mealperiodName;
//        this.oldName = this.shiftData[index].mealperiodName;
        this.startTime = this.shiftData[index].mealperiodStartTime;
        this.endTime = this.shiftData[index].mealperiodEndTime;
        this.shiftData[index].isUsedMealperiod === 0 ? this.status = true : this.status = false;
      },
      remove(index){ // 删除逻辑
        this.$Modal.confirm({
          title: '删除',
          content: '此操作将删除该餐段，是否继续？',
          loading: true,
          onOk: () => {
            this.delId = [];
            this.delId.push(this.shiftData[index].id);
            setTimeout(() => {
              this.delData(index);
              this.$Modal.remove();
            }, 1000);
          },
          onCancel: () => {
            this.loading = false;
            this.$Modal.remove();
          }
        });
      },
      change(index){ // 开关切换时
        if (this.shiftData[index].isUsedMealperiod === 0) {
          this.$Modal.confirm({
            title: '停用',
            content: '此操作将停用该餐段，是否继续？',
            loading: true,
            onOk: () => {
              setTimeout(() => {
                this.shiftData[index].isUsedMealperiod = 1;
                this.selectedItemId = this.shiftData[index].id;
                this.shiftName = this.shiftData[index].mealperiodName;
                this.startTime = this.shiftData[index].mealperiodStartTime;
                this.endTime = this.shiftData[index].mealperiodEndTime;
                this.status = false;
                this.editData();
                this.$Modal.remove();
              }, 1000);
            },
            onCancel: () => {
              this.getData();
            }
          });
        } else {
          this.shiftData[index].isUsedMealperiod = 0;
          this.selectedItemId = this.shiftData[index].id;
          this.shiftName = this.shiftData[index].mealperiodName;
          this.startTime = this.shiftData[index].mealperiodStartTime;
          this.endTime = this.shiftData[index].mealperiodEndTime;
          this.status = true;
          this.editData();
        }
      },
      asyncOK() { // 弹窗中的确定按钮
        if (this.type === 'edit') {
          this.editData();
        } else {
          this.addData();
        }
      },
      getParam(name) {
        if (name === 'get') {
          return {
            reqId: 0,
            channel: 0,
            os: "web",
            ver: "v2",
            appVer: "v2",
            model: "string",
            lng: "0",
            lat: "0",
            signType: "string",
            sign: "string",
            token: localStorage.getItem('token'),
            param: {
              page: {
                pageSize: PAGESIZE,
                currentPage: this.currentPage
              },
              id: localStorage.currentMerchantId
            }
          }
        } else if (name === 'add') {
          return {
            reqId: 0,
            channel: 0,
            os: "web",
            ver: "v2",
            appVer: "v2",
            model: "string",
            lng: "0",
            lat: "0",
            signType: "string",
            sign: "string",
            token: localStorage.getItem('token'),
            param: {
              merchantId: localStorage.currentMerchantId,
              mealperiodName: this.shiftName,
              mealperiodStartTime: this.startTime,
              mealperiodEndTime: this.endTime,
              mealperiodType:1,
              isUsedMealperiod: this.status === true ? 0 : 1
            }
          }
        } else if (name === 'edit') {
          return {
            reqId: 0,
            channel: 0,
            os: "web",
            ver: "v2",
            appVer: "v2",
            model: "string",
            lng: "0",
            lat: "0",
            signType: "string",
            sign: "string",
            token: localStorage.getItem('token'),
            param: {
              id: this.selectedItemId,
              merchantId: localStorage.currentMerchantId,
              mealperiodName: this.shiftName,
              mealperiodStartTime: this.startTime,
              mealperiodEndTime: this.endTime,
              mealperiodType:1,
              isUsedMealperiod: this.status === true ? 0 : 1
            }
          }
        } else if (name === 'del') {
          return {
            reqId: 0,
            channel: 0,
            os: "web",
            ver: "v2",
            appVer: "v2",
            model: "string",
            lng: "0",
            lat: "0",
            signType: "string",
            sign: "string",
            token: localStorage.getItem('token'),
            param: this.delId
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .add {
    width: 88px;
    height: 36px;
    border-radius: 2px;
    background-color: #20a0ff;
    color: #fff;
    font-size: 14px;
    border: none;
    outline: none;
    cursor: pointer;
    &:hover {
      opacity: .9;
    }
  }

  .modal-wrapper {
    .startTime {
      .ivu-select-dropdown {
        left: 16px !important;
        top: 190px !important;
      }
    }
    .endTime {
      .ivu-select-dropdown {
        left: 136px !important;
        top: 190px !important;
      }
    }
  }
</style>
