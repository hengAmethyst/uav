<template>
  <div>
    <div class="query-wrapper">
      <div class="query-inner">
        <span class="query-label">属性名称</span>
        <Input class="query-input" v-model="attrName" placeholder="请输入属性名称"></Input>
        <Button type="primary" class="query-inner-btn" @click="search">搜索</Button>
      </div>
      <div class="right-btn-group">
        <button class="add" @click="add">+新建</button>
      </div>
    </div>
    <Table ref="table" stripe :columns="colums" :data="data" no-data-text="没有相关数据"></Table>
    <div style="overflow: hidden;margin-top: 16px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="currentPage" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="modal" :title="type" :loading="loading" @on-ok="asyncOK">
      <Form ref="form" :model="value" label-position="top">
        <Form-item label="属性名称" prop="name" :rules="{required: true, message: '属性名称不能为空', trigger: 'blur'}">
          <Input type="text" v-model="value.name" placeholder="请输入属性名称"></Input>
        </Form-item>
        <FormItem :label="index === 0 ?'属性标签':''" v-for="(item, index) in value.items" :key="index"
                  :prop="'items.' + index + '.value'"
                  :rules="{required: true, message: '属性标签' + (index + 1) +'不能为空', trigger: 'blur'}">
          <Row>
            <Col span="18">
            <Input type="text" v-model="item.value" placeholder="请输入属性标签"></Input>
            </Col>
            <Col span="4" offset="1">
            <Button type="ghost" @click="handleRemove(index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="12">
            <Button type="dashed" long @click="handleAdd" icon="plus-round">新增</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';

  const PAGESIZE = 10;

  export default {
    data() {
      return {
        attrName: "",
        data: [],
        colums: [{
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
          {
            title: "属性名称",
            key: "name"
          },
          {
            title: "属性标签",
            key: "items",
            render: (h, params) => {
              let arr = [];
              for (let key in params.row.items) {
                arr.push(params.row.items[key].value)
              }
              return h('span', arr.join("; "))
            }
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button", {
                    style: {
                      padding: "0",
                      marginRight: "32px",
                      width: "40px",
                      height: "24px",
                      borderRadius: "2px",
                      border: "1px solid #20a0ff",
                      lineHeight: "24px",
                      textAlign: "center",
                      color: "#20a0ff",
                      fontSize: "13px",
                      background: "#fff",
                      verticalAlign: "top"
                    },
                    on: {
                      click: () => {
                        this.edit(params.index);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button", {
                    style: {
                      padding: "0",
                      width: "40px",
                      height: "24px",
                      borderRadius: "2px",
                      border: "1px solid #ff4949",
                      lineHeight: "24px",
                      textAlign: "center",
                      color: "#ff4949",
                      fontSize: "13px",
                      background: "#fff"
                    },
                    on: {
                      click: () => {
                        this.del(params.index);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ],
        modal: false,
        type: '添加菜品属性',
        value: {
          items: [{
            value: ''
          }],
          name: ''
        },
        selectedId: '',
        selectedIds: [],
        loading: true,
        currentPage: 1,
        totalResult: 0
      };
    },
    created() {
      this.getData();
    },

    methods: {
      getData() {
        this.$http.post(api.DICTIONARYSETTINGS + '/getDictionary',
          JSON.stringify(this.getParam('get')))
          .then(res => {
            console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.totalResult = response.data.totalResult;
              this.processData(response.data.list);
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      addData(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.DICTIONARYSETTINGS + '/addDictionary',
              JSON.stringify(this.getParam('add')))
              .then(res => {
                let response = res.body;
                if (response.code === 0) {
                  this.loading = false;
                  this.$Message.success("新建成功");
                  this.modal = false;
                  this.getData();
                  this.$store.dispatch('dishesAttr', this.data);
                } else {
                  this.$Message.error(response.msg);
                  this.loading = false;
                }
              })
              .catch(err => {
                console.log(err);
              })
          } else {
            this.$Message.error("表单验证失败！");
            this.loading = false;
          }
        })
      },
      editData(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(api.DICTIONARYSETTINGS + '/updateDictionary',
              JSON.stringify(this.getParam('edit')))
              .then(res => {
                let response = res.body;
                if (response.code === 0) {
                  this.loading = false;
                  this.$Message.success("修改成功");
                  this.modal = false;
                  this.getData();
                  this.$store.dispatch('dishesAttr', this.data);
                } else {
                  this.$Message.error(response.msg);
                  this.loading = false;
                  this.getData();
                }
              })
              .catch(err => {
                console.log(err);
              })
          } else {
            this.$Message.error("表单验证失败！")
            this.loading = false;
          }
        })
      },
      delData() {
        this.$http.post(api.DICTIONARYSETTINGS + '/deleteDictionary',
          JSON.stringify(this.getParam('del')))
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.loading = false;
              this.$Message.success("删除成功");
              this.modal = false;
              this.getData();
              this.$store.dispatch('dishesAttr', this.data);
            } else {
              this.$Message.error(response.msg);
              this.loading = false;
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      search() {
        this.currentPage = 1;
        this.getData();
      },
      changePage(page) {
        this.currentPage = page;
        this.getData();
      },
      add() {
        this.modal = true;
        this.type = '添加菜品属性';
        this.value = {
          items: [{
            value: ''
          }],
          name: ''
        }
      },
      edit(index) {
        this.modal = true;
        this.type = '编辑菜品属性';
        this.value.name = this.data[index].name;
        this.value.items = this.data[index].items;
        this.selectedId = this.data[index].id;
      },
      handleAdd() {
        this.value.items.push({
          value: ''
        });
      },
      handleRemove(index) {
        if (this.value.items.length === 1) {
          this.$Message.error('至少保留一个属性标签');
        } else {
//          this.value.items.splice(index, 1);
          this.removeAttr(index);
        }

      },
      removeAttr(index){
        this.$Modal.confirm({
          title: "删除",
          content: "删除该属性标签后，所有和该属性标签相关的信息都会同时删除,是否继续删除？",
          loading: true,
          onOk: () => {
            this.value.items.splice(index, 1);
            this.$Modal.remove();
          },
          onCancel: () => {
            this.loading = false;
            this.$Modal.remove();
          }
        });
      },
      asyncOK() {
        if (this.isRepeat(this.value.items)) {
          this.$Message.error('属性标签存在重复');
          this.loading = false;
          this.getData();
        } else {
          if (this.type === '添加菜品属性') {
            this.addData('form');
          } else {
            this.editData('form');
          }
        }
      },
      del(index) {
        this.$Modal.confirm({
          title: "删除",
          content: "删除该属性分类后，所有和该属性分类相关的信息都会同时删除，是否继续删除？",
          loading: true,
          onOk: () => {
            this.selectedIds.push(this.data[index].id);
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
      processData(data) {
        this.data = [];
        let obj = {};
        for (let key in data) {
          obj = {
            id: data[key].id,
            name: JSON.parse(data[key].value).name,
            items: JSON.parse(data[key].value).items
          };
          this.data.push(obj);
        }
      },
      isRepeat(arr){
        let hash = {};
        for (let i in arr) {
          if (hash[arr[i].value]) {
            return true;
          }
          hash[arr[i].value] = true;
        }
        return false;
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
            token: localStorage.getItem("token"),
            param: {
              page: {
                pageSize: PAGESIZE,
                currentPage: this.currentPage
              },
              typeCode: 11,
              merchantId: localStorage.currentMerchantId,
              value: this.attrName
            }
          };
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
            token: localStorage.getItem("token"),
            param: {
              typeCode: 11,
              merchantId: localStorage.currentMerchantId,
              value: JSON.stringify(this.value)
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
            token: localStorage.getItem("token"),
            param: {
              id: this.selectedId,
              typeCode: 11,
              merchantId: localStorage.currentMerchantId,
              value: JSON.stringify(this.value)
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
            token: localStorage.getItem("token"),
            param: {
              ids: this.selectedIds
            }
          }
        }
      }
    }
  };

</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .query-wrapper {
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
    .query-inner {
      display: flex;
      flex-direction: row;
      flex: 1;
      .query-label {
        margin-right: 12px;
        width: 80px;
        height: 32px;
        background: #e5e9f2;
        text-align: center;
        line-height: 32px;
      }
      .query-input {
        margin-right: 12px;
        width: 240px;
      }
      .query-inner-btn {
        width: 88px;
        height: 32px;
      }
    }
    .right-btn-group {
      display: flex;
      flex-direction: row;
      width: 88px;
    }
  }

  .add {
    margin-right: 0;
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
      opacity: 0.9;
    }
  }

</style>
