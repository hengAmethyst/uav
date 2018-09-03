<template>
  <div>
    <div style="margin-bottom: 16px;overflow: hidden">
      <div style="display: flex;">
      	<div class="result-total" style="flex: 1;margin-top:20px;font-size: 14px;color: #1f2d3d;">共有<span style="color: #ea5853;padding: 0 5px;">{{totalResult}}</span>个相关结果 </div>
        <button class="add" @click="add">+新建</button>
      </div>
    </div>
    <Table ref="tableData" stripe :columns="shiftColumns" :data="classifyData" no-data-text="没有相关数据"></Table>
    <div style="overflow: hidden;margin-top: 32px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal
      class="modal-wrapper"
      v-model="addShift"
      title="新建分类"
      :loading="loading"
      @on-ok="asyncOK" width="420">
      <h4 class="modal-title"><b style="color: #ff4949;margin-right: 5px;">*</b>分类名称</h4>
      <Input :maxlength="10" v-model="shiftName" placeholder="请输入分类名称..." style="margin-top: 10px;"></Input>
    </Modal>
    <Modal
      class="modal-wrapper"
      v-model="editShift"
      title="编辑分类"
      :loading="loading"
      @on-ok="asyncOK" width="420">
      <h4 class="modal-title"><b style="color: #ff4949;margin-right: 5px;">*</b>编辑名称</h4>
      <Input :maxlength="10" v-model="shiftName" placeholder="请输入编辑名称..." style="margin-top: 10px;"></Input>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
  import * as api from '../../../vuex/api';

/** 接口地址 */
const SvcUrl = {
  UpdateIndex: api.COMMODITY + '/api/pc/batchUpdateDishesCategoryDispIndex'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiUpdateIndex(categoryId, offsetIndex) {
      let param = {
        merchantId: this.getMerchantId(),
        categoryId: categoryId,
        offsetIndex: offsetIndex
      };
      return this.request(SvcUrl.UpdateIndex, param);
    }
  }
};

  const PAGESIZE = 10;
  export default {
  mixins: [SvcApi],

    data() {
      return {
        shiftColumns: [
          {
            title: '序号',
            type: 'index',
            width: 70,
            align: 'center'
          },
          {
            title: '分类名称',
            key: 'name'
          },
          {
            title: '创建时间',
            render: (h, p) => Tool.formatDate(p.row.createTime)
          	},
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              return h('span', params.row.status === 0 ? '开启' : '禁用')
            }
          },
        {
          title: '排序',
          width: 70,
          render: (h, p) => {
            return h('Button', {
              class: {
                'top-btn': true
              },
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
                  this.apiUpdateIndex(p.row.id, 10)
                    .then(() => {
                      // this.fetchList();
                      this.getResultData();
                    });
                }
              }
            }, '置顶');
          }
        },
          {
            title: '操作',
            key: 'action',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  style: {
                    padding: '0',
                    marginRight: '20px',
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
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: params.row.status === 0
                  },
                  on: {
                    'on-change': () => {
                      this.changeButtonclassify(params.index);
                    }
                  }
                }),
              ])
            }
          }
        ],
        classifyData: [],
        loading: true,
        type: '',
        shiftName: '',
        selectedItemId: '',
        addShift: false,
        editShift: false,
        status: false,
        totalResult: 0,
        currentPage: 1,
        delId: [],
        classifyStatus:false,
      }
    },
    created(){
      this.getResultData();
    },
    methods: {
      getResultData() {
        this.$http.post(api.COMMODITY + '/getGoodsCategoryList',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            //console.log(res);
            let response = res.body;
            if (response.code === 0) {
              if (response.data.list) {
                  this.classifyData = response.data.list;
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
        } else {
          this.$http.post(api.COMMODITY + '/insertOrUpdateGoodsCategoryInfo',
            JSON.stringify(this.getParam('add')))
            .then(res => {
              let response = res.body;
              if (response.code === 0) {
                this.loading = false;
                this.$Message.success('创建成功');
                this.addShift = false;
                this.getResultData();
                this.$emit('categories-changed');
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
        } else {
          this.$http.post(api.COMMODITY + '/insertOrUpdateGoodsCategoryInfo',
            JSON.stringify(this.getParam('edit')))
            .then(res => {
              console.log(res);
              let response = res.body;
              if (response.code === 0) {
                this.loading = false;
                this.$Message.success('修改成功');
                this.editShift = false;
                this.getResultData();
                this.$emit('categories-changed');
              } else {
                this.$Message.error(response.msg);
                this.loading = false;
              }
            })
            .catch(err => {
              //console.log(err)
            })
        }
      },
      delData() {
        this.$http.post(api.COMMODITY + '/deleteGoodsCategories',
          JSON.stringify(this.getParam('del')))
          .then(res => {
            console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.loading = false;
              this.getResultData();
              this.$Message.success('删除成功');
                this.$emit('categories-changed');
            } else {
              this.loading = false;
              this.$Modal.info({
                title: '提示',
                content: response.showMsg
              });
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      changePage(page){
        this.currentPage = page;
        this.getResultData();
      },
      deleteData() {
        this.$http.post()
      },
      add(){ // 添加班次操作弹窗
        this.type = 'add';
        this.addShift = true;
        this.shiftName = '';

      },
      edit(index) { // 编辑操作弹窗
        this.type = 'edit';
        this.editShift = true;
        this.selectedItemId = this.classifyData[index].id;
        this.shiftName = this.classifyData[index].name;
        //this.classifyData[index].status === 0 ? this.statuse = true : this.statuse = false;
      },
      remove(index){ // 删除逻辑
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除？',
          loading: true,
          onOk: () => {
              this.delId = [];
              this.delId.push(this.classifyData[index].id);
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
      changeClassify() {      //分类管理开关切换
        this.$http.post(api.COMMODITY + '/updateCategoryStatus',
          JSON.stringify(this.getParam('classifyDredge')))
          .then(res => {
            console.log(res);
            let response = res.body;
            if (response.code === 0) {
                this.$emit('categories-changed');
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
    changeButtonclassify(index){          // 分类管理开关切换时
        if (this.classifyData[index].status === 0) {
          this.$Modal.confirm({
          	//console.log('===============================')
            title: '停用',
            content: '此操作将停用该分类，是否继续？',
            loading: true,
            onOk: () => {
              setTimeout(() => {
                this.classifyData[index].status = 1;
                this.selectedItemId = this.classifyData[index].id;
                this.classifyStatus = false;
                this.changeClassify();
                this.$Modal.remove();
              }, 1000);
            },
            onCancel: () => {
              this.getResultData();
            }
          });
        } else {
          this.classifyData[index].status = 0;
          this.selectedItemId = this.classifyData[index].id;
          this.classifyStatus = true;
          this.changeClassify();
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
             	id:localStorage.currentMerchantId,
             	isPublicCategory:1,
             	isOtherProperties:1,
             	type:this.type,

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
              name: this.shiftName,
              status:0
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
              name: this.shiftName,
              status:0
            }
           }
        }else if (name === 'classifyDredge') {
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
              id:this.selectedItemId,
              merchantId: localStorage.currentMerchantId,
              status:this.classifyStatus === true ? 0 : 1,
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
</style>
