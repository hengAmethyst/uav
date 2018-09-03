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

    <Modal class="new-discount-modal" :title="value.modalTitle" v-model="showingModal" width="520">
      <Form ref="form" :model="value" :rules="rules" :label-width="80">
        <Form-item class="name" label="优惠名称" required prop="name" :show-message="false">
          <i-input v-model="value.name"></i-input>
        </Form-item>
        <Form-item class="type" label="优惠类型">
          <i-select v-model="value.typeCode">
            <i-option v-for="(val, key) in discountType" v-if="!isNaN(Number(key))" :value="Number(key)" :label="val" :key="key"></i-option>
          </i-select>
        </Form-item>
        <Form-item class="discount" label="优惠" prop="discountRatio" :show-message="false">
          <i-input v-model="value.discountRatio">
            <span slot="append">元</span>
          </i-input>
        </Form-item>
        <Form-item class="start-date" label="开始时间">
          <DatePicker type="date" v-model="value.effectiveStarttime" :options="datePickerOptions" placeholder="选择日期"></DatePicker>
        </Form-item>
        <Form-item class="end-date" label="结束时间">
          <DatePicker type="date" v-model="value.effectiveEndtime" :options="datePickerOptions" placeholder="选择日期"></DatePicker>
        </Form-item>
        <Form-item class="remark" label="备注">
          <Input type="textarea"></Input>
        </Form-item>
        <Form-item class="on-off">
          <Checkbox v-model="value.status">启用</Checkbox>
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

const SvcUrl = {
  List: API.FINANCE + 'preference/list',
  Update: API.FINANCE + 'preference/update',
  Delete: API.FINANCE + 'preference/delete',
  UpdateStatus: API.FINANCE + 'preference/valid'
};

// 优惠类型
const DiscountTypeEnum = {
  /** 全单折扣 */
  QDZK: 1,
  /** 方案折扣 */
  FAZK: 2
};
DiscountTypeEnum[DiscountTypeEnum.QDZK] = '全单折扣';
DiscountTypeEnum[DiscountTypeEnum.FAZK] = '方案折扣';

// 对话框类型
const ModalTypeEnum = {
  New: 'new', // 新建
  Edit: 'edit' // 编辑
};

// 默认新建对话框中绑定的数据
const DefaultModalValue = {
  modalTitle: '新建优惠方式',
  modalType: ModalTypeEnum.New,
  id: 0,
  name: '',
  typeCode: 1,
  discountRatio: '',
  effectiveStarttime: undefined,
  effectiveEndtime: undefined,
  status: false
};

const ValueConvertor = {
  /**
   * 把服务器上的数据项转为对话框中绑定的数据
   */
  toLocal(item) {
    let value = {
      id: item.id,
      name: item.name,
      typeCode: item.typeCode,
      discountRatio: item.discountRatio,
      effectiveStarttime: undefined,
      effectiveEndtime: undefined,
      status: item.status === Tool.SwitchStatusEnum.On
    };

    if (item.effectiveStarttime) {
      value.effectiveStarttime = new Date(item.effectiveStarttime);
    }
    if (item.effectiveEndtime) {
      value.effectiveEndtime = new Date(item.effectiveEndtime);
    }

    return value;
  },
  /**
   * 把对话框中绑定的数据转为服务器接收的数据项
   */
  toRemote(value) {
    let item = {
      name: value.name,
      typeCode: value.typeCode,
      discountRatio: value.discountRatio,
      effectiveStarttime: undefined,
      effectiveEndtime: undefined,
      status: value.status ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off
    };

    if (value.effectiveStarttime) {
      item.effectiveStarttime = value.effectiveStarttime.toISOString();
    }
    if (value.effectiveEndtime) {
      item.effectiveEndtime = value.effectiveEndtime.toISOString();
    }

    return item;
  }
};

export default {
  data() {
    return {
      // 控制是否显示对话框
      showingModal: false,
      discountType: DiscountTypeEnum,

      // 新建、编辑对话框中绑定的数据
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
          width: 70,
          align: 'center',
          render: (h, p) => Tool.padSecond(p.index + 1)
        },
        {
          title: '优惠名称',
          key: 'name'
        },
        {
          title: '优惠类型',
          render: (h, p) => DiscountTypeEnum[p.row.typeCode]
        },
        {
          title: '优惠',
          render: (h, p) => {
            let discount = '';
            if (p.row.discountRatio) {
              discount = p.row.discountRatio + '%';
            }
            return h('span', discount);
          }
        },
        {
          title: '开始时间',
          key: 'effectiveStarttimeStr'
        },
        {
          title: '结束时间',
          key: 'effectiveEndtimeStr'
        },
        {
          title: '状态',
          render: (h, p) => Tool.SwitchStatusEnum[p.row.status]
        },
        {
          title: '操作',
          render: (h, p) => {
            let editBtn = h('Button', {
              class: {
                'edit-btn': true
              },
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
              nativeOn: {
                click: () => {
                  this.apiDeleteItem(p.row.id)
                    .then(data => {
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

      datePickerOptions: {
        shortcuts: [
          {
            text: '今天',
            value() {
              return new Date();
            }
          },
          {
            text: '昨天',
            value() {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              return date;
            }
          },
          {
            text: '一周前',
            value() {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              return date;
            }
          }
        ]
      },

      rules: {
        name: [{ required: true }],
        discountRatio: [{ pattern: /^\d+(?:.\d*)?$/ }]
      }
    };
  },

  methods: {
    ...Tool.ApiMethods,
    apiCreateItem(item) {
      return this.apiUpdateItem({ edit: false, ...item });
    },
    apiReadList() {
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
      let param = { id, valid: on };

      return this.request(SvcUrl.UpdateStatus, param);
    },
    apiDeleteItem(id) {
      let param = { id };
      return this.request(SvcUrl.Delete, param);
    },

    search() {
      this.apiReadList()
        .then(data => {
          this.items = data.list;
          this.page.totalNum = data.totalResult;
          this.page.currentPage = data.currentPage;
        }, err => {
          this.$Message.error(err.message);
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
        modalTitle: '编辑优惠设置'
      };

      this.$refs.form.resetFields();
      this.showingModal = true;
    },
    onModalOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let item = ValueConvertor.toRemote(this.value);
          let promise = null;
          if (this.value.modalType === ModalTypeEnum.New) {
            promise = this.apiCreateItem(item);

          } else if (this.value.modalType === ModalTypeEnum.Edit) {
            item.id = this.value.id;
            promise = this.apiUpdateItem(item);
          }

          promise && promise
            .then(data => {
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
    this.search();
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
