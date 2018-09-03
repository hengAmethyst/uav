<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">套餐管理</h2>
    </div>
    <div style="width: 100%;background-color: #FFFFFF;border: 1px solid #d3dce6;">
      <div style="width: 100%;margin: 32px 24px;">
        <Form>
          <Form-item class="row-1 order-type" label="套餐管理">
            <Input placeholder="请输入套餐名称或者套餐编号" style="width: 200px;height: 36px;" v-model="queryParam"></Input>
            <button class="add" style="border-radius: 2px;background-color: #ff4949;margin-left: 32px;height: 36px;" @click="search">查询
            </button>
          </Form-item>
        </Form>
      </div>
      <div style="display: flex;margin: 0 24px;">
        <div style="flex: 1;font-size: 14px;color: #1f2d3d;padding-bottom:10px;">共有
          <span style="color: #ea5853;padding: 0 5px;">{{totalResult}}</span>个相关结果
        </div>
        <div style="margin-right:16px;padding-bottom: 10px;">
          <button class="add" @click="add">+新建</button>
        </div>
        <div>
          <button class="delAll" @click="removeAll">批量删除({{getNum}})</button>
        </div>
      </div>
      <div style="margin:0px 24px;">
        <Table @on-selection-change="handleSelection" :width="width" ref="tableData" stripe :columns="dictionariesSet" :data="dictionariesData" no-data-text="没有相关数据"></Table>
        <!--<div style="margin-top: 16PX;">-->
        <!--<button class="delAll">导出Excel</button>-->
        <!--</div>-->
        <div style="overflow: hidden;margin-top: 16px;margin-bottom: 40px;">
          <div style="float: right;">
            <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import * as api from '../../../vuex/api';

const PAGESIZE = 10;

export default {
  data() {
    return {
      totalResult: 0,
      currentPage: 1,
      queryParam: '',
      selection: [],
      dictionariesData: [],
      dictionariesSet: [
        {
          type: 'selection',
          width: 50,
          fixed:'left',
          align: 'center'
        },
        {
          title: '套餐品名',
          key: 'packageName',
          width:0
        },
        {
          title: '套餐编码',
          key: 'packageCode',
          width:0
        },
        {
          title: '价格',
          key: 'packagePrice',
          width:0,
          render: (h, params) => {
            return h('span', (Number(params.row.packagePrice) / 100).toFixed(2) + '元')
          }
        },
        {
          title: '会员价',
          key: 'memberPrice',
          width:0,
          render: (h, params) => {
            return h('span', (Number(params.row.memberPrice) / 100).toFixed(2) + '元')
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          width:0
        },
        {
          title: '创建人',
          key: 'createByName',
          width:0
        },
        {
          title: '状态',
          key: 'status',
          width:0,
          render: (h, params) => {
            return h('span', params.row.status === 0 ? '启用' : '禁用')
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          fixed:'right',
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
                    this.edit(params.row.id)
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
                    this.remove(params.row.id)
                  }
                }
              }, '删除')
            ]);
          }
        },
        {
          title: '状态切换',
          key: 'switch',
          width: 100,
          fixed:'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.status === 0
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
      selectedId: null,
      selectedStatus: false,
      loading: true,
      delId: [],
      width:0
    };
  },
  mounted() {
    this.width = this.$refs.tableData.$el.clientWidth;
    if (window.outerWidth < 1440) {
      this.dictionariesSet[1].width = this.width / 7;
      this.dictionariesSet[2].width = this.width / 7;
      this.dictionariesSet[3].width = this.width / 7;
      this.dictionariesSet[4].width = this.width / 7;
      this.dictionariesSet[5].width = this.width / 5;
      this.dictionariesSet[6].width = this.width / 6;
      this.dictionariesSet[7].width = this.width / 6;
    }
  },
  created() {
    this.getData();
  },
  computed: {
    getNum() {
      if (this.selection.length > 0) {
        return this.selection.length;
      }
      return 0
    }
  },
  methods: {
    search() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
        this.getData();
      } else {
        this.getData();
      }
    },
    getData() {
      this.$http.post(api.PACKAGE + 'list',
        JSON.stringify(this.getParam('get')))
        .then(res => {
          // console.log(res);
          let response = res.body;
          if (response.code === 0) {
            this.totalResult = response.data.totalResult;
            this.dictionariesData = response.data.list;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    changeStatus() {
      this.$http.post(api.PACKAGE + 'changeStatus',
        JSON.stringify(this.getParam('change')))
        .then(res => {
          // console.log(res);
          let response = res.body;
          if (response.code === 0) {
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    delData() {
      this.$http.post(api.PACKAGE + 'delete',
        JSON.stringify(this.getParam('del')))
        .then(res => {
          // console.log(res)
          let response = res.body;
          if (response.code === 0) {
            this.$Message.success('删除成功')
            this.getData();
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    add() {
      this.$router.push('/cloud/setMealAdd')
    },
    edit(id) {
      this.$router.push({ path: '/cloud/setMealEdit', query: { id: id } })
    },
    changePage(page) {
      this.currentPage = page;
      this.getData();
    },
    change(index) { // 开关切换时
      if (this.dictionariesData[index].status === 0) {
        this.$Modal.confirm({
          title: '停用',
          content: '此操作将停用该套餐，是否继续？',
          loading: true,
          onOk: () => {
            setTimeout(() => {
              this.dictionariesData[index].status = 1;
              this.selectedId = this.dictionariesData[index].id;
              this.selectedStatus = false;
              this.changeStatus();
              this.$Modal.remove();
            }, 1000);
          },
          onCancel: () => {
            this.getData();
          }
        });
      } else {
        this.dictionariesData[index].status = 0;
        this.selectedId = this.dictionariesData[index].id;
        this.selectedStatus = true;
        this.changeStatus();
      }
    },
    remove(id) {
      this.$Modal.confirm({
        title: '删除',
        content: '此操作将删除该套餐，是否继续？',
        loading: true,
        onOk: () => {
          this.delId = [];
          this.delId.push(id);
          setTimeout(() => {
            this.delData();
            this.$Modal.remove();
          }, 1000);
        },
        onCancel: () => {
          this.loading = false;
          this.$Modal.remove();
        }
      });
    },
    removeAll() {
      if (this.selection.length > 0) {
        this.$Modal.confirm({
          title: '删除',
          content: '此操作将批量删除套餐，是否继续？',
          loading: true,
          onOk: () => {
            setTimeout(() => {
              this.delData();
              this.selection = []; //批量删除后，重置选中数量
              this.$Modal.remove();
            }, 1000);
          },
          onCancel: () => {
            this.loading = false;
            this.$Modal.remove();
          }
        });
      } else {
        this.$Message.error('请选择删除项');
      }
    },
    handleSelection(selection) {
      this.selection = selection;
      this.delId = [];
      for (let i = 0; i < this.selection.length; i++) {
        this.delId.push(this.selection[i].id);
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
            // merchantId: JSON.parse(localStorage.getItem('userInfo')).userData.merchantId,
            //              merchantId: 117,
            merchantId: localStorage.currentMerchantId,
            queryParam: this.queryParam
          }
        }
      } else if (name === 'change') {
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
            id: this.selectedId,
            type: this.selectedStatus === true ? 0 : 1
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
          param: {
            ids: this.delId
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.module-title {
  margin: 14px 0;
  .title {
    font-size: 20px;
    width: 200px;
    height: 32px;
    line-height: 32px;
    color: #1f2d3d;
    font-weight: normal;
  }
}

.ivu-form .ivu-form-item-label {
  font-size: 12px;
  color: #1f2d3d;
}

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

.delAll {
  width: 88px;
  height: 36px;
  border-radius: 2px;
  background-color: #ffffff;
  border: solid 1px #c0ccda;
  font-size: 14px;
  color: #475669;
  cursor: pointer;
  &:hover {
    opacity: .9;
  }
}
</style>
