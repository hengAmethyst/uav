<template>
  <div class="table-showcase">
    <div class="query-result">
      <div class="result-total">共有 {{page.totalNum}} 个相关结果</div>
      <div class="extra">
        <Button class="new-btn" @click="showNewModal">+新建</Button>
      </div>
      <Table border :columns="columns" :data="items"></Table>
      <Page :page-size="page.pageSize" :total="page.totalNum" :current="page.currentPage" @on-change="onPageChange"></Page>
      <div class="clean"></div>
    </div>

    <Modal :title="value.modalTitle" v-model="showingModal" width="420">
      <Form ref="form" :model="value" :rules="rules" :label-width="80">
        <Form-item label="支付名称" required prop="channelName">
          <i-input v-model="value.channelName"></i-input>
        </Form-item>
        <!-- <Form-item label="支付类型"> -->
        <!-- <Select></Select> -->
        <!-- </Form-item> -->
        <Form-item label="备注" required prop="comments">
          <i-input type="textarea" v-model="value.comments"></i-input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="showingModal=false">取消</Button>
        <Button type="primary" @click="onModalOk">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';

const CHANNEL_NAME_MAX_LEN = 30;
const COMMENTS_MAX_LEN = 30;

/** 接口地址 */
const SvcUrl = {
  List: API.FINANCE + 'payment/list',
  Update: API.FINANCE + 'payment/change',
  Delete: API.FINANCE + 'payment/delete',
  UpdateStatus: API.FINANCE + 'payment/valid',
  FirstAdd: API.FINANCE + 'payment/firstAdd'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiCreateItem(item) {
      return this.apiUpdateItem({ edit: false, ...item });
    },
    apiReadList(query) {
      let param = {
        page: {
          ...this.page,
          currentResult: 1,
          totalPage: 1,
          totalResult: 1
        },
        merchantId: this.getMerchantId()
      };
      return this.request(SvcUrl.List, param);
    },
    apiUpdateItem(item) {
      let param = {
        merchantId: this.getMerchantId(),
        edit: true,
        ...item
      };
      return this.request(SvcUrl.Update, param);
    },
    apiUpdateStatus(id, on) {
      let param = {
        merchantId: this.getMerchantId(),
        id,
        valid: on
      };
      return this.request(SvcUrl.UpdateStatus, param);
    },
    apiDeleteItem(id) {
      let param = {
        merchantId: this.getMerchantId(),
        id
      };
      return this.request(SvcUrl.Delete, param);
    },
    apiFirstAdd() {
      let param = {
        merchantId: this.getMerchantId()
      };
      return this.request(SvcUrl.FirstAdd, param);
    }
  }
};

const ModalTypeEnum = {
  New: 'new',
  Edit: 'edit'
};

// 默认新建对话框中绑定的数据
const DefaultModalValue = {
  modalTitle: '新建支付方式',
  modalType: ModalTypeEnum.New,
  id: 0,
  channelName: '',
  comments: ''
};

const ValueConvertor = {
  /**
   * 把服务器上的数据项转为对话框中绑定的数据
   */
  toLocal(item) {
    let value = {
      id: item.id,
      channelName: item.channelName,
      comments: item.comments
    };

    return value;
  },
  /**
   * 把对话框中绑定的数据转为服务器接收的数据项
   */
  toRemote(value) {
    let item = {
      id: value.id,
      channelName: value.channelName,
      comments: value.comments
    };

    return item;
  }
};

export default {
  mixins: [SvcApi],

  data() {
    return {
      showingModal: false,

      value: { ...DefaultModalValue },

      // Table 数据
      items: [],
      page: {
        totalNum: 0,
        currentPage: 1,
        pageSize: 10
      },

      // Table 定义
      columns: [
        {
          title: '序号',
          width: 65,
          align: 'center',
          render: (h, p) => Tool.padSecond(p.index + 1)
        },
        {
          title: '支付名称',
          key: 'channelName'
        },
        // {
        //   title: '支付类型',
        //   key: ''
        // },
        {
          title: '备注',
          key: 'comments'
        },
        {
          title: '状态',
          width: 65,
          render: (h, p) => Tool.SwitchStatusEnum[p.row.status]
        },
        // {
        //   title: '排序'
        // },
        {
          title: '操作',
          width: 150,
          render: (h, p) => {
            let disabled = p.row.channelId <= 100;

            let editBtn = h('Button', {
              class: {
                'edit-btn': true
              },
              props: { disabled },
              nativeOn: {
                click: () => {
                  this.showEditModal(p.row);
                }
              }
            }, '编辑');

            let delBtn = h('Button', {
              class: {
                'del-btn': true,
              },
              props: { disabled },
              nativeOn: {
                click: () => {
                  this.apiDeleteItem(p.row.id)
                    .then(data => {
                      this.$Message.success('删除成功');
                      if (this.items.length === 1 && this.page.currentPage > 1) {
                        this.page.currentPage--;
                      }
                      this.search();
                    }, err => {
                      this.$Message.error(err.message);
                    });
                }
              }
            }, '删除');

            return h('div', [editBtn, delBtn]);
          }
        },
        {
          title: '状态切换',
          width: 90,
          render: (h, p) => {
            let isOn = p.row.status === Tool.SwitchStatusEnum.On;
            let options = {
              props: { value: isOn },
              on: {
                'on-change': () => {
                  this.apiUpdateStatus(p.row.id, !isOn)
                    .then(data => {
                      this.search();
                    }, err => {
                      this.$Message.error(err.message);
                    });
                }
              }
            };
            return h('i-switch', options);
          }
        }
      ],

      rules: {
        channelName: [
          { required: true, message: ' ' },
          { max: CHANNEL_NAME_MAX_LEN, message: '不能超过 ' + CHANNEL_NAME_MAX_LEN + ' 字' }
        ],
        comments: [
          { required: true, message: ' ' },
          { max: COMMENTS_MAX_LEN, message: '不能超过 ' + COMMENTS_MAX_LEN + ' 字' }
        ]
      }
    };
  },

  methods: {
    search() {
      this.apiReadList()
        .then(data => {
          this.items = data.list;
          this.page.totalNum = data.totalResult;
          this.page.currentPage = data.currentPage;
        }, err => {
          this.items = [];
          this.page.totalNum = 0;
          this.page.currentPage = 1;
          // this.$Message.error(err.message);
        });
    },
    onPageChange(page) {
      this.page.currentPage = page;
      this.search();
    },
    showNewModal() {
      this.value.modalType = ModalTypeEnum.New;
      this.value = { ...DefaultModalValue };

      this.$refs.form.resetFields();
      this.showingModal = true;
    },
    showEditModal(item) {
      this.value = {
        ...ValueConvertor.toLocal(item),
        modalType: ModalTypeEnum.Edit,
        modalTitle: '编辑支付方式'
      };

      this.$refs.form.resetFields();
      this.showingModal = true;
    },
    onModalOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let successMsg = '';

          let item = ValueConvertor.toRemote(this.value);
          let promise = null;
          if (this.value.modalType === ModalTypeEnum.New) {
            successMsg = '新建成功';
            promise = this.apiCreateItem(item);

          } else if (this.value.modalType === ModalTypeEnum.Edit) {
            successMsg = '修改成功';
            item.id = this.value.id;
            promise = this.apiUpdateItem(item);
          }

          promise && promise
            .then(data => {
              this.$Message.success(successMsg);
              this.showingModal = false;
              this.search();
            }, err => {
              this.$Message.error(err.message);
            });
        }
      });
    }
  },

  created() {
    this.apiFirstAdd()
      .then(() => this.search(), () => this.search());
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
