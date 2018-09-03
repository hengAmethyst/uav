<template>
  <div>
    <div style="margin-bottom: 16px;overflow: hidden">
      <div style="float: right;margin-left:16px">
        <button class="delAll" @click="removeAll">批量删除({{getNum}})</button>
      </div>
      <div style="float: right;">
        <button class="add" @click="add">+新建</button>
      </div>
    </div>

    <Table @on-selection-change="handleSelection" :width="width" ref="tableData" stripe :columns="storesColumns" :data="storesData" no-data-text="没有相关数据"></Table>

    <div style="overflow: hidden;margin-top: 32px;">
      <div style="float: right;">
        <Page :total="totalResult" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as api from "../../../vuex/api";

const PAGESIZE = 10;

export default {
  data() {
    return {
      storesData: [],
      storesColumns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed:'left'
        },
//        {
//          title: "序号",
//          type: "index",
//          width: 60,
//          align: "center"
//        },
        {
          title: "子门店名称",
          key: "name",
          width:0,
          fixed:'left'
        },
        {
          title: "地址",
          key: "address",
          width:0,
        },
        {
          title: "固定电话",
          key: "landlinePhone",
          width:0,
        },
        {
          title: "部门数",
          key: "departmentCount",
          width:0,
        },
        {
          title: "员工数",
          key: "employeeCount",
          width:0,
        },
        {
          title: "负责人姓名",
          key: "contactPersonName",
          width:0,
        },
        {
          title: "负责人手机",
          key: "contactPhone",
          width:0,
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          fixed:'right',
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
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
                      this.edit(params.row.id);
                    }
                  }
                },
                "编辑"),
              h(
                "Button",
                {
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
                      this.remove(params.index);
                    }
                  }
                },
                "删除")
            ]);
          }
        }
      ],
      currentPage: 1,
      totalResult: 0,
      selection: [],
      loading: true,
      delId: [],
      width:0
    };
  },
  mounted() {
    this.width = this.$refs.tableData.$el.clientWidth;
    if (window.outerWidth < 1440) {
      this.storesColumns[1].width = this.width / 5;
      this.storesColumns[2].width = this.width / 5;
      this.storesColumns[3].width = this.width / 6;
      this.storesColumns[4].width = this.width / 9;
      this.storesColumns[5].width = this.width / 9;
      this.storesColumns[6].width = this.width / 6;
      this.storesColumns[7].width = this.width / 6;
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
      return 0;
    }
  },
  methods: {
    getData() {
      this.$http
        .post(
          api.MERCHANT + "getAllMcntInfoList",
          JSON.stringify(this.getParam("get"))
        )
        .then(res => {
          // console.log(res);
          let response = res.body;
          if (response.code === 0) {
            this.totalResult = response.data.totalResult;
            if (response.data.list) {
              this.storesData = response.data.list;
              if(this.$store.getters['storeListLength'] !== response.data.list.length){
                this.$store.dispatch('storeListLength',response.data.list.length)
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delData() {
      this.$http
        .post(
          api.MERCHANT + "batchDeleteMcnt",
          JSON.stringify(this.getParam("del"))
        )
        .then(res => {
          let response = res.body;
          if (response.code === 0) {
            this.loading = false;
            this.getData();
            this.$Message.success("删除成功");
          } else {
            this.loading = false;
            this.$Message.error("删除失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePage(page) {
      this.currentPage = page;
      this.getData();
    },
    handleSelection(selection) {
      this.selection = selection;
      this.delId = [];
      for (let i = 0; i < this.selection.length; i++) {
        this.delId.push(this.selection[i].id);
      }
    },
    remove(index) {
      this.$Modal.confirm({
        title: "删除",
        content: "此操作将删除该门店，是否继续？",
        loading: true,
        onOk: () => {
          this.delId = [];
          this.delId.push(this.storesData[index].id);
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
      this.$Modal.confirm({
        title: "删除",
        content: "此操作将批量删除门店，是否继续？",
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
    },
    add() {
      this.$router.push("/cloud/addStore");
    },
    edit(id) {
      this.$router.push({ path: "/cloud/editStore", query: { id: id } });
    },
    getParam(name) {
      if (name === "get") {
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
            merchantId: localStorage.currentMerchantId,
            userType: JSON.parse(localStorage.userInfo).userType
          }
        };
      } else if (name === "del") {
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
            mcntIds: this.delId
          }
        };
      }
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
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
    opacity: 0.9;
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
    opacity: 0.9;
  }
}
</style>
