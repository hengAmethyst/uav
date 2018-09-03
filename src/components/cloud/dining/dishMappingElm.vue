<template>
  <div>
    <div class="module-title clearfix">
      <h2 class="title">饿了么商户授权</h2>
    </div>
    <div class="child-container">
      <div class="child-head">
        <h2 class="child-title">关联菜品
          <span class="sub">有 {{getUnMappedLength}} 个外卖菜品未关联至收银系统，请关联或新建至收银系统</span>
        </h2>
        <button class="add" @click="add">+新建</button>
      </div>
      <Table ref="table" stripe :columns="columns" :data="data" no-data-text="没有相关数据"></Table>
    </div>

    <Modal v-model="modal" width="880">
      <p slot="header">
        <span>选择关联菜品</span>
      </p>
      <div class="modal-content clearfix">
        <div class="left">
          <h3 class="title">分类</h3>
          <div class="content">
            <ul class="category-list">
              <li class="list-item" v-for="item in dishesList" @click="selectCategory(item)">{{item.categoryName}}</li>
            </ul>
          </div>
        </div>
        <div class="right">
          <h3 class="title">菜品</h3>
          <div class="content">
            <RadioGroup v-model="selectedDishId" vertical @on-change="selectDish">
              <div v-for="item in selectedItem.dishesList" :key="item.dishId" class="dish-radio">
                <Radio :label="item.dishId">
                  <span>{{item.name}}</span>
                </Radio>
              </div>
            </RadioGroup>
          </div>
          <div class="foot">
            <p class="desc">将 <span class="dish">{{selectedName}}</span> 关联至饿了么菜品：<span class="edish">{{selectedEDish.name}}</span>
            </p>
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="ghost" @click="cancel" class="reset">取消</Button>
        <Button type="primary" @click="mapped" class="submit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as api from '../../../vuex/api';

  export default {
    data() {
      return {
        data: [],
        columns: [
//          {
//            title: '菜品分类',
//            key: 'category'
//          },
          {
            title: '饿了么菜品',
            key: 'name'
          },
          {
            title: '本地菜品',
            render: (h, params) => {
              return h('span', params.row.mappedDishDataVo ? params.row.mappedDishDataVo.name : '')
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
                }, '关联')
//                h('Button', {
//                  style: {
//                    padding: '0',
//                    width: '40px',
//                    height: '24px',
//                    borderRadius: '2px',
//                    border: '1px solid #ff4949',
//                    lineHeight: '24px',
//                    textAlign: 'center',
//                    color: '#ff4949',
//                    fontSize: '13px',
//                    background: '#fff'
//                  },
//                  on: {
//                    click: () => {
//                      this.remove(params.index)
//                    }
//                  }
//                }, '删除')
              ]);
            }
          },
          {
            title: '关联状态',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('span', {
                style: {
                  color: params.row.mappedDishDataVo ? '#20a0ff' : '#ff4949'
                }
              }, params.row.mappedDishDataVo ? '已关联' : '未关联')
            }
          }
        ],
        modal: false,
        unMapped: [],
        dishesList: [],
        selectedItem: {},
        selectedDishId: '',
        selectedName: '',
        selectedEDish: {},
        eMerchantId: ''
      }
    },
    created() {
      this.getData();
    },
    computed: {
      getUnMappedLength() {
        return this.unMapped.length;
      }
    },
    methods: {
      getData() {
        this.$http.post(api.ELM_URL + 'dishes?merchantId=' + localStorage.currentMerchantId + '&userId=' + JSON.parse(localStorage.userInfo).userData.userDetail.userId)
          .then(res => {
            let response = res.body;
            if (response.code === 0) {
              this.data = response.data.edishes;
              this.unMapped = response.data.dishes;
              this.eMerchantId = response.data.eMerchantId;
              this.processData(response.data.dishes);
            } else {
              this.$Message.error('获取饿了么菜品失败');
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      add() {
      },
      edit(index) {
        this.modal = true;
        this.selectedEDish = this.data[index];
      },
      selectCategory(item){
        this.selectedItem = item;
      },
      selectDish(value){
        let dish = this.unMapped.find(it => it.dishId === value);
        this.selectedName = dish ? dish.name : '';
      },
      cancel() {
        this.selectedItem = {};
        this.selectedName = '';
        this.selectedId = '';
        this.modal = false;
      },
      mapped() {
        this.$http.post(api.ELM_URL + 'dishData/mapping',
          JSON.stringify(this.getParam('mapping')))
          .then(res => {
            console.log(res)
            let response = res.body;
            if (response.code === 0) {
              this.$Message.success('关联成功');
              this.modal = false;
              this.getData();
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      processData(data){
        let res = [];
        let json = {};
        for (let i = 0; i < data.length; i++) {
          if (!json[data[i].categoryId]) {
            res.push({
              categoryId: data[i].categoryId,
              categoryName: data[i].categoryName,
              dishesList: []
            });
            json[data[i].categoryId] = 1;
          }
        }
        for (let i = 0; i < res.length; i++) {
          for (let k = 0; k < data.length; k++) {
            if (res[i].categoryId === data[k].categoryId) {
              res[i].dishesList.push({
                dishId: data[k].dishId,
                name: data[k].name
              })
            }
          }
        }
        this.dishesList = res;
      },
      getParam(name){
        if (name === 'mapping') {
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
              eMerchantId: this.eMerchantId,
              dishId: this.selectedDishId,
              edishId: this.selectedEDish.dishId,
              edishName: this.selectedEDish.name
            }
          }
        }
      }
    }
  };

</script>
<style scoped lang="scss" rel="stylesheet/scss">
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

  .child-container {
    padding: 24px 24px 40px;
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid #d3dce6;
    .child-head {
      display: flex;
      flex-direction: row;
      .child-title {
        flex: 1;
        margin-bottom: 24px;
        position: relative;
        padding-left: 16px;
        height: 25px;
        line-height: 25px;
        color: #1f2d3d;
        &:before {
          display: block;
          position: absolute;
          content: '';
          width: 4px;
          height: 18px;
          background: #ff4949;
          left: 0;
          top: 4px;
        }
        .sub {
          padding-left: 12px;
          font-size: 12px;
          color: #8492a6;
        }
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
    }
  }

  .modal-content {
    .left {
      float: left;
      width: 288px;
      height: 470px;
      border-radius: 2px;
      border: 1px solid #e0e6ed;
      .title {
        position: relative;
        padding-left: 40px;
        height: 36px;
        line-height: 36px;
        font-weight: normal;
        border-bottom: 1px solid #e0e6ed;
        z-index: 1;
        &:before {
          position: absolute;
          display: block;
          content: "";
          width: 4px;
          height: 18px;
          left: 24px;
          top: 9px;
          z-index: 10;
          background: #ff4949;
        }
      }
      .content {
        width: 100%;
        height: 434px;
        overflow: scroll;
        .category-list {
          .list-item {
            height: 48px;
            line-height: 48px;
            padding-left: 58px;
            font-size: 16px;
            cursor: pointer;
            &:hover {
              color: #ff4949;
              background-color: #f9fafc;
            }
          }
        }
      }
    }
    .right {
      float: right;
      width: 528px;
      height: 470px;
      border-radius: 2px;
      border: 1px solid #e0e6ed;
      .title {
        position: relative;
        padding-left: 40px;
        height: 36px;
        line-height: 36px;
        font-weight: normal;
        border-bottom: 1px solid #e0e6ed;
        z-index: 1;
        &:before {
          position: absolute;
          display: block;
          content: "";
          width: 4px;
          height: 18px;
          left: 24px;
          top: 9px;
          z-index: 10;
          background: #ff4949;
        }
      }
      .content {
        width: 100%;
        height: 386px;
        overflow: scroll;
        .dish-radio {
          padding-top: 9px;
          padding-left: 58px;
          width: 526px;
          height: 48px;
          line-height: 48px;
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: #ff4949;
            background-color: #f9fafc;
          }
        }
      }
      .foot {
        height: 48px;
        font-size: 0;
        border-top: 1px dashed #e4e9ef;
        .desc {
          padding: 0 40px;
          width: 100%;
          text-align: right;
          line-height: 48px;
          font-size: 14px;
          .dish {
            color: #ff4949;
          }
          .edish {
            color: #20a0ff;
          }
        }
      }
    }
  }

</style>
