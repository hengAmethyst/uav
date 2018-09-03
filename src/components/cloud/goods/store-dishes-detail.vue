<template>
  <div class="store-dishes-detail">
    <Steps :current="step">
      <Step title="基础数据"></Step>
      <Step title="菜品配菜"></Step>
      <Step title="菜品属性"></Step>
      <Step title="图片描述"></Step>
    </Steps>

    <div class="step0 step-section" v-show="step === 0">
      <Form ref="step0Form" :model="value" :rules="step0Rules" :label-width="80" inline>
        <Form-item label="菜品名称" required prop="name">
          <Input v-model="value.name" placeholder="请输入菜品名称"></Input>
        </Form-item>
        <Form-item label="菜品编码" prop="code">
          <Input v-model="value.code" placeholder="请输入菜品编码"></Input>
        </Form-item>
        <Form-item label="首字母" prop="shortcutCode">
          <Input v-model="value.shortcutCode" placeholder="请输入首字母"></Input>
        </Form-item>
        <Form-item label="条形码" prop="barCode">
          <Input v-model="value.barCode" placeholder="请输入条形码"></Input>
        </Form-item>
        <Form-item label="所属分类" required prop="categoryId" :show-message="false">
          <Select v-model="value.categoryId">
            <Option v-for="it of categories" :value="it.id" :key="it.id">{{it.name}}</Option>
          </Select>
        </Form-item>
        <Form-item class="cuisine-item" label="所属菜系">
          <Checkbox-group v-model="value.cuisineIds">
            <Checkbox v-for="it of cuisine" :label="it.name" :key="it.id">{{it.name}}</Checkbox>
          </Checkbox-group>
        </Form-item>
        <Form-item class="sale-type-item" label="销售类型">
          <Checkbox v-model="value.isChangeWeight">称重菜</Checkbox>
          <Checkbox v-model="value.isSideDishes">配菜</Checkbox>
        </Form-item>
        <Form-item class="spec-table-item" prop="specificationList">
          <Table border :columns="specColumns" :data="value.specificationList" width="800"></Table>
        </Form-item>
        <Form class="spec-form" ref="specForm" :model="specValue" :rules="specRules" :label-width="68" inline>
          <Form-item label="规格" :label-width="58" required prop="itemName">
            <Input v-model="specValue.itemName"></Input>
          </Form-item>
          <Form-item label="定价" :label-width="58" required prop="itemPrice">
            <Input v-model="specValue.itemPrice"></Input>
          </Form-item>
          <Form-item label="会员价" prop="itemMemberPrice">
            <Input v-model="specValue.itemMemberPrice"></Input>
          </Form-item>
          <Form-item label="起卖数" required prop="minSaleNum">
            <Input v-model="specValue.minSaleNum"></Input>
          </Form-item>
          <Form-item class="action-item">
            <Button @click="addSpec" :loading="specBtnLoading">+添加新规格</Button>
          </Form-item>
        </Form>
      </Form>
      <p style="color:#99a9bf;">注：点单时，系统将自动根据起卖数量，按增量设置的参数增加或减少</p>
    </div>

    <div class="step1 step-section" v-show="step === 1">
      <div class="dishes-select">

        <div class="unselected-list transfer-list">
          <p>可选商品</p>
          <ul class="category-tree">
            <li :class="{ 'category-item': true, 'category-item-disabled': !it.enabled }" v-for="it of sideDishes" :key="it.id" @click="addSideDish(it)">
              <div class="category-name-wrapper">
                <span class="category-name">{{it.name}}</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="selected-list transfer-list">
          <p>已选商品</p>
          <ul class="dish-list">
            <li class="dish-item" v-for="it of value.sideDishesInfoList" :key="it.id">
              <span class="remove-btn-wrapper icon-btn-wrapper">
                <Icon type="close"></Icon>
                <button class="actual-btn" @click="removeSideDish(it)"></button>
              </span>
              <Row>
                <Col span="17">{{getDishName(it.sideDishesId) || '&nbsp;'}}</Col>
                <Col span="7">
                <Select v-model="it.sideDishesSpecId" @on-change="onSideDishChange">
                  <Option v-for="specItem of it.sideSpecials" :value="specItem.id" :key="specItem.id">{{specItem.name}}</Option>
                </Select>
                </Col>
              </Row>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <div class="step2 step-section" v-show="step === 2">
      <div>
        <p>菜品属性</p>
        <ul class="attr-list">
          <li class="attr-item" v-for="(attr, index) of value.dishAttribute" :key="index + '-' + attr.name">
            <Row>
              <Col span="8">
                <Select v-model="attr.name" @on-change="onAttrChange(index)">
                  <Option v-for="(it, index) of dictionaries" :key="index + '-' + it.name" :value="it.name"></Option>
                </Select>
              </Col>
              <Col span="14">
                &nbsp;
                <CheckboxGroup v-model="attr.items" :style="{display:'inline-block'}">
                  <Checkbox v-for="(it, index) of attr.allItems" :key="index + '-' + it" :label="it"></Checkbox>
                </CheckboxGroup>
              </Col>
              <Col span="2">
                <Button @click="delAttr(index)">删除</Button>
              </Col>
            </Row>
          </li>
        </ul>
        <Button @click="addAttr">+添加新属性</Button>
      </div>
    </div>

    <div class="step3 step-section" v-show="step === 3">
      <Form ref="step3Form" :model="value" :rules="step3Rules" :label-width="80">
        <Form-item class="img-item" label="上传图片" required prop="picture">
          <div v-show="value.picture.pictureFilePath">
            <div class="img-showcase">
              <img v-show="value.picture.pictureFilePath" :src="value.picture.pictureFilePath"></img>
              <Button shape="circle" icon="close" @click="removeImage"></Button>
            </div>
          </div>
          <Upload v-show="!value.picture.pictureFilePath" multiple type="drag" :action="uploadUrl" :on-success="uploadSuccess" :show-upload-list="false">
            <div class="bg">
              <Icon type="ios-plus-empty"></Icon>
            </div>
          </Upload>
          <p v-show="!value.picture.pictureFilePath" style="color: #99a9bf;">支持JPG／PNG／SVG格式 图片大小220*145</p>
        </Form-item>
        <Form-item class="ingredient-item" label="菜品配料" prop="dishIngredient" :show-message="false">
          <Input v-model="value.dishIngredient" type="textarea" placeholder="请输入菜品配料"></Input>
          <span class="word-count">{{value.dishIngredient.length}}/66</span>
        </Form-item>
        <Form-item class="story-item" label="菜品故事" prop="dishStory" :show-message="false">
          <Input v-model="value.dishStory" type="textarea" placeholder="请输入菜品故事"></Input>
          <span class="word-count">{{value.dishStory.length}}/66</span>
        </Form-item>
      </Form>
    </div>

    <div class="action-section">
      <Button v-show="step === 0" @click="cancel">取消</Button>
      <Button v-show="step > 0 && step <= 3" @click="step--">上一步</Button>
      <Button class="next-btn" v-show="step >= 0 && step < 3" @click="next">下一步</Button>
      <Button class="ok-btn" v-show="step === 3" @click="ok">完成</Button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';

const SpecMakingTypeEnum = {
  /** 规格 */
  Spec: 1,
  /** 做法 */
  Making: 2
};

/** 接口地址 */
const SvcUrl = {
  AddDishes: API.COMMODITY + '/addDishes',
  ModifyDishes: API.COMMODITY + '/modifyDishes',
  ModifyDishesSide: API.COMMODITY + '/modifyDishesSide',
  Upload: API.RESOURCE,
  AddDishSpc: API.COMMODITY + '/addDishesSpc',
  DeleteDishSpc: API.COMMODITY + '/deleteDishesSpc',
  ToggleDishSpcDefault: API.COMMODITY + '/modifyDefaultSpc'
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,

    apiAddDishes(item) {
      let param = {
        merchantId: this.getMerchantId(),
        ...item
      };
      return this.request(SvcUrl.AddDishes, param);
    },
    apiModifyDishes(item) {
      let param = {
        merchantId: this.getMerchantId(),
        ...item
      };
      return this.request(SvcUrl.ModifyDishes, param);
    },

    apiModifyDishesSide(item) {
      let param = {
        merchantId: this.getMerchantId(),
        dishesId: item.id,
        dihsesVersion: item.dishesVersion, // fuck off dihsesVersion
        sideDishesInfoList: item.sideDishesInfoList.map(it => ({ ...it, merchantId: this.getMerchantId() }))
      };
      return this.request(SvcUrl.ModifyDishesSide, param);
    },

    /**
     * @param {number} item.dishesId
     * @param {string} item.itemName
     * @param {number} item.itemPrice
     * @param {number} item.itemMemberPrice
     * @param {number} item.minSaleNum
     * @param {number} item.addNum
     * @param {SwitchStatusEnum} item.isDefault
     * @param {number} item.dishesVersion
     * @param {SpecMakingTypeEnum} item.itemType
     */
    apiAddDishSpec(item) {
      let param = {
        merchantId: this.getMerchantId(),
        itemType: SpecMakingTypeEnum.Spec,
        ...item,
        dihsesVersion: item.dishesVersion // fuck off dihsesVersion
      };
      delete param.dishesVersion;
      return this.request(SvcUrl.AddDishSpc, param);
    },
    /**
     * @param {number} item.id
     * @param {number} item.dishesId
     * @param {string} item.itemName
     * @param {number} item.itemPrice
     * @param {number} item.itemMemberPrice
     * @param {number} item.minSaleNum
     * @param {number} item.addNum
     * @param {SwitchStatusEnum} item.isDefault
     * @param {number} item.dishesVersion
     * @param {SpecMakingTypeEnum} item.itemType
     */
    apiUpdateDishSpec(item) {
      let param = {
        merchantId: this.getMerchantId(),
        itemType: SpecMakingTypeEnum.Spec,
        ...item,
        dihsesVersion: item.dishesVersion // fuck off dihsesVersion
      };
      delete param.dishesVersion;
      return this.request(SvcUrl.AddDishSpc, param);
    },
    /**
     * @param {number} item.id
     * @param {number} item.dishesId
     * @param {number} item.dishesVersion
     * @param {SpecMakingTypeEnum} item.itemType
     */
    apiDeleteDishSpec(item) {
      let param = {
        merchantId: this.getMerchantId(),
        itemType: SpecMakingTypeEnum.Spec,
        ...item,
        dihsesVersion: item.dishesVersion // fuck off dihsesVersion
      };
      delete param.dishesVersion;
      return this.request(SvcUrl.DeleteDishSpc, param);
    },
    /**
     * @param {number} item.id
     * @param {number} item.dishesId
     * @param {number} item.dishesVersion
     * @param {number} item.isDefault
     * @param {SpecMakingTypeEnum} item.itemType
     */
    apiToggleDishSpecDefault(item) {
      let param = {
        merchantId: this.getMerchantId(),
        itemType: SpecMakingTypeEnum.Spec,
        ...item,
        dihsesVersion: item.dishesVersion // fuck off dihsesVersion
      };
      delete param.dishesVersion;
      return this.request(SvcUrl.ToggleDishSpcDefault, param);
    },

    apiAddDishMaking(item) {
      return this.apiAddDishSpec({ ...item, itemType: SpecMakingTypeEnum.Making });
    },
    apiDeleteDishMaking(item) {
      return this.apiDeleteDishSpec({ ...item, itemType: SpecMakingTypeEnum.Making });
    },
    apiToggleDishMakingDefault(item) {
      return this.apiToggleDishSpecDefault({ ...item, itemType: SpecMakingTypeEnum.Making });
    }
  }
};

// 默认表单数据
const DefaultValue = {
  isOnShelf: Tool.SwitchStatusEnum.On,
  dishesType: 1,

  id: undefined,
  dishesVersion: 1,

  // step: 0
  name: '', // 菜品名称
  code: '', // 菜品编码
  shortcutCode: '', // 首字母
  barCode: '', // 条形码
  categoryId: '', // 所属分类
  cuisineIds: [], // 所属菜系
  isChangeWeight: false, // 称重菜
  isSideDishes: false, // 配菜
  specificationList: [], // 规格

  // step: 1
  sideDishesInfoList: [], // 配菜

  // step: 2
  makingList: [], // 做法
  hotDegreeId: '', // 辣度设置
  dishAttribute: [
    /*
    {
      name: '辣度',
      items: ['不辣', '辣'],
      allItems: ['不辣', '辣']
    }
    */
  ], // 菜品属性

  // step: 3
  picture: {
    // name: undefined,
    // picUrl: undefined,
    // pictureFilePath: undefined,
    // typeCode: 2
  }, // 图片
  dishIngredient: '', // 菜品配料
  dishStory: '' // 菜品故事
};
const generateDefaultValue = () => {
  let value = { ...DefaultValue };
  value.cuisineIds = [];
  value.specificationList = [];
  value.sideDishesInfoList = [];
  value.makingList = [];
  value.dishAttribute = [];
  value.picture = {};
  return value;
};

// 默认规格表单数据
const DefaultSpecValue = {
  itemName: '', // 规格
  itemPrice: '', // 定价
  itemMemberPrice: '', // 会员价
  minSaleNum: '', // 起卖数
  addNum: '' // 增量设置
};

// 默认做法表单数据
const DefaultMakingValue = {
  itemName: '', // 做法
  itemPrice: '', // 加价
  itemMemberPrice: '' // 会员价
};

const ValueConvertor = {
  /**
   * 把服务器上的数据项转为对话框中绑定的数据
   */
  toLocal(item) {
    let value = {
      ...item,
      isChangeWeight: item.isChangeWeight === Tool.SwitchStatusEnum.On,
      isSideDishes: item.isSideDishes === Tool.SwitchStatusEnum.On,
      makingList: item.makings,
      sideDishesInfoList: item.sideDishes.map(it => {
        let dish = {
          id: it.id,
          brandId: item.brandId,
          sideDishesId: it.sideDishesId,
          sideDishesSpecId: it.specificationId,
          sideDishesMakingId: it.makingId,
          sideSpecials: it.sideSpecials,
          sideMakings: it.sideMakings
        };
        return dish;
      })
    };

    if (item.specifications) {
      value.specificationList = item.specifications.map(it => ({ editable: false, v: 0, ...it }));
    } else {
      value.specificationList = [];
    }
    if (item.cuisineIds) {
      value.cuisineIds = item.cuisineIds.split(',');
    } else {
      value.cuisineIds = [];
    }
    if (item.dishAttribute) {
      value.dishAttribute = JSON.parse(item.dishAttribute);
    } else {
      value.dishAttribute = [];
    }
    if (!value.picture) {
      value.picture = {};
    }

    return value;
  },
  /**
   * 把对话框中绑定的数据转为服务器接收的数据项
   */
  toRemote(value) {
    let item = {
      ...value,
      isChangeWeight: value.isChangeWeight ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off,
      isSideDishes: value.isSideDishes ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off,
      cuisineIds: value.cuisineIds.join(','),
      sideDishesInfoList: value.sideDishesInfoList.map(it => {
        let newItem = {
          dishesId: value.id,
          ...it
        };
        delete newItem.sideSpecials;
        delete newItem.sideMakings;
        return newItem;
      }),
      dishAttribute: JSON.stringify(value.dishAttribute.reduce((arr, it) => {
        if (it.name && !arr.find(attr => attr.name == it.name)) {
          arr.push({ name: it.name, items: it.items });
        }
        return arr;
      }, []))
    };
    if (!item.picture.pictureFilePath) {
      delete item.picture;
    }
    return item;
  }
};

export default {
  mixins: [SvcApi],

  props: {
    // 菜品分类
    categories: {
      default: () => []
    },
    // 菜系
    cuisine: {
      default: () => []
    },
    // 辣度
    spicyDegree: {
      default: () => []
    },
    // 配菜
    sideDishes: {
      default: () => []
    },
    // 菜品属性
    dictionaries: {
      default: () => []
    }
  },

  data() {
    return {
      // 当前编辑模式
      editType: Tool.EditTypeEnum.Create,
      // 当前步骤
      step: 0,

      // 上传图片地址
      uploadUrl: SvcUrl.Upload,

      // 绑定数据
      value: { ...DefaultValue },
      step0Rules: {
        name: [{ required: true, message: '必填' }, { max: 60, message: '小于 60 字' }],
        code: [{ max: 30, message: '小于 30 字' }],
        shortcutCode: [{ max: 30, message: '小于 30 字' }],
        barCode: [{ max: 30, message: '小于 30 字' }],
        categoryId: [{ required: true, type: 'number' }],
        specificationList: [{ required: true, type: 'array', min: 1, message: '规格至少有1个' }]
      },

      // 规格
      specBtnLoading: false,
      specValue: { ...DefaultSpecValue },
      specRules: {
        itemName: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('必填'));
              return;
            }
            if (this.value.specificationList.some(it => it.itemName === value)) {
              callback(new Error('名称不能重复'));
              return;
            }
            callback();
          }
        }],
        itemPrice: [{ required: true, pattern: /^\d+(?:\.\d*)?$/, message: '大于等于0' }],
        itemMemberPrice: [{
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^\d+(?:\.\d*)?$/.test(value)) {
                callback(new Error('大于等于0'));
                return;
              }

              let spec = this.specValue;
              if (spec.itemPrice && /^\d+(?:\.\d*)?$/.test(spec.itemPrice)) {
                if (Number(value) > Number(spec.itemPrice)) {
                  callback(new Error('小于等于定价'));
                  return;
                }
              }
            }

            callback();
          }
        }],
        minSaleNum: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('必填'));
              return;
            }

            let minVal = 0;
            if (!this.value.isChangeWeight) {
              minVal = 1;
            }
            if (!/^\d+(?:\.\d*)?$/.test(value) || Number(value) < minVal) {
              callback(new Error('大于等于' + minVal));
              return;
            }

            callback();
          }
        }],
        addNum: [{ pattern: /^\d+/ }]
      },
      specColumns: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (h, p) => Tool.padSecond(p.index + 1)
        },
        {
          title: '规格',
          render: (h, p) => {
            if (!p.row.editable) {
              return p.row.itemName;
            }

            let spec = this.value.specificationList[p.index];
            let input = h('Input', {
              props: {
                value: spec.__.itemName
              },
              on: {
                'on-change': (e) => {
                  spec.__._changed = true;
                  spec.__.itemName = e.target.value.trim();
                }
              }
            });

            return h('div', {
              class: {
                'ivu-form-item-error': spec.__ && spec.__.itemNameError
              }
            }, [input]);
          }
        },
        {
          title: '定价（元）',
          render: (h, p) => {
            if (!p.row.editable) {
              return Tool.formatMoney(p.row.itemPrice);
            }

            let spec = this.value.specificationList[p.index];
            let value = spec.__.itemPrice;
            if (typeof value === 'number') {
              value /= 100;
            }
            let input = h('Input', {
              props: {
                value
              },
              on: {
                'on-change': (e) => {
                  spec.__._changed = true;
                  let val = e.target.value.trim();
                  spec.__.itemPrice = val;
                  if (/^\d+(?:\.\d*)?$/.test(val)) {
                    spec.__.itemPrice = Number(val) * 10 * 10;
                  }
                }
              }
            });

            return h('div', {
              class: {
                'ivu-form-item-error': spec.__ && spec.__.itemPriceError
              }
            }, [input]);
          }
        },
        {
          title: '会员价（元）',
          render: (h, p) => {
            if (!p.row.editable) {
              return Tool.formatMoney(p.row.itemMemberPrice);
            }

            let spec = this.value.specificationList[p.index];
            let value = spec.__.itemMemberPrice;
            if (typeof value === 'number') {
              value /= 100;
            }
            let input = h('Input', {
              props: {
                value
              },
              on: {
                'on-change': (e) => {
                  spec.__._changed = true;
                  let val = e.target.value.trim();
                  spec.__.itemMemberPrice = val;
                  if (/^\d+(?:\.\d*)?$/.test(val)) {
                    spec.__.itemMemberPrice = Number(val) * 10 * 10;
                  }
                }
              }
            });

            return h('div', {
              class: {
                'ivu-form-item-error': spec.__ && spec.__.itemMemberPriceError
              }
            }, [input]);
          }
        },
        {
          title: '起卖数',
          render: (h, p) => {
            if (!p.row.editable) {
              return (p.row.minSaleNum || 0) / 100;
            }

            let spec = this.value.specificationList[p.index];
            let value = spec.__.minSaleNum;
            if (typeof value === 'number') {
              value /= 100;
            }
            let input = h('Input', {
              props: {
                value
              },
              on: {
                'on-change': (e) => {
                  spec.__._changed = true;
                  let val = e.target.value.trim();
                  spec.__.minSaleNum = val;
                  if (/^\d+(?:\.\d*)?$/.test(val)) {
                    spec.__.minSaleNum = Number(val) * 10 * 10;
                  }
                }
              }
            });

            return h('div', {
              class: {
                'ivu-form-item-error': spec.__ && spec.__.minSaleNumError
              }
            }, [input]);
          }
        },
        {
          title: '操作',
          width: 150,
          render: (h, p) => {
            let specList = this.value.specificationList;
            let spec = specList[p.index];

            let editBtn = h('Button', {
              class: {
                'edit-btn': true
              },
              on: {
                click: () => {
                  spec.editable = true;
                  spec.__ = {
                    itemName: spec.itemName,
                    itemPrice: spec.itemPrice,
                    itemMemberPrice: spec.itemMemberPrice,
                    minSaleNum: spec.minSaleNum || 0,
                    _changed: false
                  };
                }
              }
            }, '编辑');

            let okBtn = h('Button', {
              class: {
                'ok-btn': true
              },
              on: {
                click: () => {
                  let __ = spec.__;
                  if (!__._changed) {
                    spec.editable = false;
                    return;
                  }

                  __.itemNameError
                    = !__.itemName
                    || (__.itemName != spec.itemName && specList.some(it => it.itemName === __.itemName));

                  __.itemPriceError = typeof __.itemPrice !== 'number';

                  __.itemMemberPriceError = false;
                  if (__.itemMemberPrice || __.itemMemberPrice === 0) {
                    if (typeof __.itemMemberPrice !== 'number') {
                      __.itemMemberPriceError = true;

                    } else {
                      if (__.itemPrice && typeof __.itemPrice === 'number') {
                        if (__.itemMemberPrice > __.itemPrice) {
                          __.itemMemberPriceError = true;
                        }
                      }
                    }
                  }

                  __.minSaleNumError = false;
                  if (typeof __.minSaleNum !== 'number') {
                    __.minSaleNumError = true;
                  } else {
                    let minVal = 0;
                    if (!this.value.isChangeWeight) {
                      minVal = 100;
                    }
                    if (__.minSaleNum < minVal) {
                      __.minSaleNumError = true;
                    }
                  }

                  if (__.itemNameError || __.itemPriceError || __.itemMemberPriceError || __.minSaleNumError) {
                    spec.v++;
                    return;
                  }

                  let done = () => {
                    spec.editable = false;

                    spec.itemName = __.itemName;
                    spec.itemPrice = __.itemPrice;
                    spec.itemMemberPrice = __.itemMemberPrice;
                    spec.minSaleNum = __.minSaleNum;
                  };


                  if (this.editType === Tool.EditTypeEnum.Create) {
                    done();

                  } else if (this.editType === Tool.EditTypeEnum.Modify) {
                    let item = {
                      ...__,
                      isDefault: spec.isDefault,
                      itemType: SpecMakingTypeEnum.Spec,
                      dishesId: this.value.id,
                      dishesVersion: this.value.dishesVersion,
                      id: spec.id
                    };

                    this.$emit('data-change');
                    this.apiUpdateDishSpec(item)
                      .then(data => {
                        this.value.dishesVersion = data.dihsesVersion;
                        done();
                      }, err => {
                        this.$Message.error(err.message);
                      })
                  }
                }
              }
            }, '确认');

            let delBtn = h('Button', {
              class: {
                'del-btn': true
              },
              props: {
                disabled: this.value.specificationList.length === 1 && p.index === 0
              },
              on: {
                click: () => this.deleteSpec(p.index)
              }
            }, '删除');

            if (!p.row.editable) {
              return h('div', [editBtn, delBtn]);
            } else {
              return h('div', [okBtn, delBtn]);
            }
          }
        },
        {
          title: '设置为默认',
          render: (h, p) => {
            let isDefault = p.row.isDefault === Tool.SwitchStatusEnum.On;

            return h('i-switch', {
              props: {
                value: isDefault,
                disabled: isDefault
              },
              on: {
                'on-change': (on) => this.toggleSpecDefault(p.index, on)
              }
            });
          }
        }
      ],

      // 图片描述
      step3Rules: {
        picture: [{
          validator: (rule, value, callback) => {
            if (!value.pictureFilePath) {
              callback(new Error('必须上传菜品图片'));
            } else {
              callback();
            }
          }
        }],
        dishIngredient: [{ max: 66 }],
        dishStory: [{ max: 66 }]
      }
    };
  },

  computed: {
    categoriesDict() {
      return this.categories.reduce((dict, it) => (dict[it.id] = it, dict), {});
    },
    sideDishesDict() {
      return this.sideDishes.reduce((dict, it) => {
        dict[it.id] = it;
        return dict;
      }, {});
    },
    spicyDegreeNameDict() {
      return this.spicyDegree.reduce((dict, it) => {
        dict[it.busiName] = it.name;
        return dict;
      }, {})
    },
    dictionariesDict() {
      return this.dictionaries.reduce((dict, it) => {
        dict[it.name] = it.items;
        return dict;
      }, {});
    }
  },

  methods: {
    /**
     * 用于父组件调用
     */
    create() {
      this.editType = Tool.EditTypeEnum.Create;
      this.step = 0;
      this.$refs.step0Form.resetFields();
      this.$refs.specForm.resetFields();

      this.sideDishes.forEach(it => it.enabled = it.isOnShelf === Tool.SwitchStatusEnum.On);

      this.value = generateDefaultValue();
    },
    /**
     * 用于父组件调用
     * @param {object} item 父组件列表中的项
     */
    modify(item) {
      this.editType = Tool.EditTypeEnum.Modify;
      this.step = 0;
      this.$refs.step0Form.resetFields();
      this.$refs.specForm.resetFields();

      let value = ValueConvertor.toLocal(item);

      value.dishAttribute.forEach(it => {
        let allItems = this.dictionariesDict[it.name];
        if (allItems) {
          it.allItems = allItems;
        } else {
          it.allItems = [...it.items];
        }
      });

      if (!this.categoriesDict[value.categoryId]) {
        value.categoryId = '';
      }

      let dict = value.sideDishesInfoList.reduce((dict, it) => (dict[it.sideDishesId] = true, dict), {});

      this.sideDishes.forEach(it => {
        if (
          it.isOnShelf === Tool.SwitchStatusEnum.Off
          || dict[it.id]
          || it.id === item.id
        ) {
          it.enabled = false;
        } else if (!it.enabled) {
          it.enabled = true;
        }
      });

      this.value = { ...generateDefaultValue(), ...value };
    },

    addSpec() {
      this.$refs.specForm.validate(valid => {
        if (valid) {
          let item = {
            editable: false,
            v: 0,
            isDefault: Tool.SwitchStatusEnum.Off,
            itemType: SpecMakingTypeEnum.Spec,
            ...this.specValue
          };
          item.itemPrice = Number(item.itemPrice) * 10 * 10;
          if (item.itemMemberPrice) {
            item.itemMemberPrice = Number(item.itemMemberPrice) * 10 * 10;
          } else {
            item.itemMemberPrice = item.itemPrice;
          }
          item.minSaleNum = ~~(Number(item.minSaleNum) * 10 * 10);

          if (!this.value.specificationList.length) {
            item.isDefault = Tool.SwitchStatusEnum.On;
          }

          if (this.editType === Tool.EditTypeEnum.Create) {
            this.value.specificationList.push(item);

          } else if (this.editType === Tool.EditTypeEnum.Modify) {
            this.specBtnLoading = true;

            item.dishesId = this.value.id;
            item.dishesVersion = this.value.dishesVersion;

            this.$emit('data-change');
            this.apiAddDishSpec(item)
              .then(data => {
                this.specBtnLoading = false;

                this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
                delete data.dihsesVersion;

                this.value.specificationList.push({
                  editable: false,
                  v: 0,
                  ...data
                });

                this.$refs.specForm.resetFields();
              }, err => {
                this.specBtnLoading = false;
              });
          }

          this.$refs.specForm.resetFields();
        }
      });
    },
    deleteSpec(index) {
      let handle = () => {
        let removed = this.value.specificationList.splice(index, 1)[0];

        if (this.editType === Tool.EditTypeEnum.Modify) {
          let item = {
            id: removed.id,
            dishesId: this.value.id,
            dishesVersion: this.value.dishesVersion
          };

          this.apiDeleteDishSpec(item)
            .then(data => {
              this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
            });
        }

        // 如果没有一项设为默认，那么把第一项设置为默认
        if (
          this.value.specificationList.length > 0
          && !this.value.specificationList.some(it => it.isDefault === Tool.SwitchStatusEnum.On)
        ) {
          let spec = this.value.specificationList[0];
          spec.isDefault = Tool.SwitchStatusEnum.On;

          if (this.editType === Tool.EditTypeEnum.Modify) {
            let item = {
              id: spec.id,
              dishesId: this.value.id,
              dishesVersion: this.value.dishesVersion,
              isDefault: spec.isDefault
            };
            return this.apiToggleDishSpecDefault(item)
              .then(data => {
                this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
              });
          }
        }
      };

      if (this.editType === Tool.EditTypeEnum.Create) {
        handle();
      } else {
        this.$Modal.confirm({
          content: '删除该规格后，所有和该规格相关的信息都会同时删除。',
          onOk: handle
        });
      }
    },
    toggleSpecDefault(index, on) {
      let chain = Promise.resolve();

      // 先把开启的给取消
      this.value.specificationList.forEach((spec, i) => {
        if (i != index && spec.isDefault === Tool.SwitchStatusEnum.On) {
          spec.isDefault = Tool.SwitchStatusEnum.Off;

          if (this.editType === Tool.EditTypeEnum.Modify) {
            chain = chain.then(() => {
              let item = {
                id: spec.id,
                dishesId: this.value.id,
                dishesVersion: this.value.dishesVersion,
                isDefault: spec.isDefault
              };
              return this.apiToggleDishSpecDefault(item)
                .then(data => {
                  this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
                });
            });
          }
        }
      });

      let spec = this.value.specificationList[index];
      spec.isDefault = on ? Tool.SwitchStatusEnum.On : Tool.SwitchStatusEnum.Off;

      if (this.editType === Tool.EditTypeEnum.Modify) {
        chain = chain.then(() => {
          let item = {
            id: spec.id,
            dishesId: this.value.id,
            dishesVersion: this.value.dishesVersion,
            isDefault: spec.isDefault
          };
          return this.apiToggleDishSpecDefault(item)
            .then(data => {
              this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
            });
        });
      }

      chain.then(() => { }, err => this.$Message.error(err.message + ', 请刷新页面重新操作'));
    },

    getDishName(id) {
      let dish = this.sideDishesDict[id];
      return dish ? dish.name : '';
    },
    addSideDish(dish) {
      if (!dish.enabled) {
        return;
      }

      dish.enabled = false;
      let selectedItem = {
        brandId: this.getBrandId(),
        sideDishesId: dish.id,
        sideDishesSpecId: '',
        sideDishesMakingId: '',

        sideSpecials: dish.specificationList.map(it => ({ id: it.id, name: it.itemName })),
        sideMakings: dish.makingList.map(it => ({ id: it.id, name: it.itemName }))
      };
      if (dish.specificationList.length) {
        let defaultItem = dish.specificationList.find(it => it.isDefault === Tool.SwitchStatusEnum.On);
        if (defaultItem) {
          selectedItem.sideDishesSpecId = defaultItem.id;
        } else {
          selectedItem.sideDishesSpecId = selectedItem.sideSpecials[0].id;
        }
      }
      if (dish.makingList.length) {
        let defaultItem = dish.makingList.find(it => it.isDefault === Tool.SwitchStatusEnum.On);
        if (defaultItem) {
          selectedItem.sideDishesMakingId = defaultItem.id;
        } else {
          selectedItem.sideDishesMakingId = selectedItem.sideMakings[0].id;
        }
      }
      this.value.sideDishesInfoList.push(selectedItem);

      if (this.editType === Tool.EditTypeEnum.Modify) {
        let item = ValueConvertor.toRemote(this.value);

        this.$emit('data-change');
        this.apiModifyDishesSide(item)
          .then(data => {
            this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
          });
      }
    },
    removeSideDish(dish) {
      let index = this.value.sideDishesInfoList.indexOf(dish);
      if (index >= 0) {
        this.value.sideDishesInfoList.splice(index, 1);
      }

      let sideDish = this.sideDishes.find(it => it.id === dish.sideDishesId);
      if (
        sideDish
        && sideDish.isOnShelf === Tool.SwitchStatusEnum.On
        && sideDish.id !== this.value.id
      ) {
        sideDish.enabled = true;
      }

      if (this.editType === Tool.EditTypeEnum.Modify) {
        let item = ValueConvertor.toRemote(this.value);

        this.$emit('data-change');
        this.apiModifyDishesSide(item)
          .then(data => {
            this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
          });
      }
    },
    onSideDishChange() {
      if (this.editType === Tool.EditTypeEnum.Modify) {
        let item = ValueConvertor.toRemote(this.value);

        this.$emit('data-change');
        this.apiModifyDishesSide(item)
          .then(data => {
            this.value.dishesVersion = data.dihsesVersion; // fuck off dihsesVersion
          });
      }
    },

    onAttrChange(index) {
      let attr = this.value.dishAttribute[index];
      attr.allItems = this.dictionariesDict[attr.name] || [];
      attr.items = [...attr.allItems];
    },
    addAttr() {
      this.value.dishAttribute.push({
        name: '',
        items: [],
        allItems: []
      });
    },
    delAttr(index) {
      this.value.dishAttribute.splice(index, 1);
    },

    uploadSuccess(res) {
      this.value.picture = {
        name: res.data.filename,
        picUrl: res.data.serverFilename,
        pictureFilePath: res.data.fullFilename,
        typeCode: 2
      };
      this.$refs.step3Form.validateField('picture');
    },
    removeImage() {
      this.value.picture = {};
    },

    cancel() {
      this.$emit('cancel');
    },
    next() {
      if (this.step === 0) {
        this.$refs.step0Form.validate(valid => {
          if (valid) {
            this.step++;
          }
        })
        return;
      }
      this.step++;
    },
    ok() {
      this.$refs.step3Form.validate(valid => {
        if (!valid) {
          return;
        }

        this.$emit('data-change');

        if (this.editType === Tool.EditTypeEnum.Create) {
          let item = ValueConvertor.toRemote(this.value);
          this.apiAddDishes(item)
            .then(data => {
              this.$Message.success('新建成功');
              this.$emit('ok');
            }, err => {
              this.$Message.error(err.message);
            });

        } else if (this.editType === Tool.EditTypeEnum.Modify) {
          let item = ValueConvertor.toRemote(this.value);
          if (this.cuisine.length) {
            item.cuisineIds = this.value.cuisineIds.reduce((r, name) => {
              if (this.cuisine.find(it => it.name == name)) {
                r.push(name);
              }
              return r;
            }, []).join(',');
          }
          // TODO: 处理下 item
          this.apiModifyDishes(item)
            .then(data => {
              this.$Message.success('修改成功');
              this.$emit('ok');
            }, err => {
              this.$Message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.store-dishes-detail {
  padding: 10px 10px;

  .del-btn {
    width: 40px;
    height: 24px;
    border: solid 1px #ff4949;
    font-size: 13px;
    color: #ff4949;
    padding: 0;
    &.disabled,
    &[disabled] {
      color: #bbbec4;
      border-color: #dddee1;
    }
  }

  .step-section {
    margin: 20px 0 0;
    width: 100%;
  }

  .step0 {
    padding: 0 14px;

    .ivu-form {
      .ivu-form-item {
        margin-right: 0;

        .ivu-input,
        .ivu-select {
          width: 300px;
          height: 36px;
        }
      }

      .cuisine-item,
      .sale-type-item {
        display: block;
        .ivu-checkbox-wrapper {
          width: 102px;
        }
      }

      .spec-table-item {
        .ivu-form-item-content {
          margin-left: 0 !important;
        }

        .ivu-table {
          .ivu-input {
            width: 100%;
          }
          .edit-btn,
          .ok-btn {
            width: 40px;
            height: 24px;
            padding: 0;
            margin-right: 10px;
            border: solid 1px #20a0ff;

            span {
              color: #20a0ff;
            }
          }
          .ivu-switch-disabled {
            border-color: #ea5853;
            background-color: #ea5853;
            &.ivu-switch-checked::after {
              background-color: #fff;
            }
          }
        }
      }

      .spec-form {
        .ivu-input,
        .ivu-select {
          width: 104px;
          height: 36px;
        }
        .action-item {
          .ivu-form-item-content {
            margin-left: 15px !important;
            .ivu-btn {
              width: 95px;
              height: 36px;
              border: solid 1px #20a0ff;
              color: #20a0ff;
            }
          }
        }
      }
    }
  }

  .step1 {
    .dishes-select {
      height: 557px;
      .transfer-list {
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: inset 0 -1px 0 0 #e0e6ed, inset -1px 0 0 0 #e0e6ed,
          inset 1px 0 0 0 #e0e6ed, inset 0 1px 0 0 #e0e6ed;

        p {
          height: 36px;
          line-height: 36px;
          border-bottom: 1px solid #e0e6ed;
          font-size: 16px;
          color: #1f2d3d;
          padding: 0 24px;
        }

        p::before {
          content: "";
          border-left: 4px solid #ff4949;
          padding-right: 12px;
        }
      }

      .icon-btn-wrapper {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        line-height: 1;
        .ivu-icon::before {
          display: inline-block;
          width: 16px;
          height: 16px;
          text-align: center;
          font-size: 16px;
        }
        .ivu-icon {
          color: #c0ccda;
          position: relative;
          top: 0;
          left: 0;
        }
        .actual-btn {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          opacity: 0;
          cursor: pointer;
          border: 0px;
        }
      }

      /* 移除按钮 */
      .remove-btn-wrapper {
        .ivu-icon::before {
          width: 16px;
          height: 16px;
          font-size: 16px;
        }
      }

      .unselected-list {
        width: 288px;
        height: 557px;
        float: left;

        .category-tree {
          height: 521px;
          overflow-y: scroll;
        }

        .category-item {
          cursor: pointer;

          .category-name-wrapper {
            height: 24px;
            margin: 16px 0 0 17px;
            .category-name {
              display: inline-block;
              line-height: 24px;
              font-size: 16px;
              color: #1f2d3d;
              margin-left: 15px;
              vertical-align: top;
            }
          }
        }

        .category-item-disabled {
          cursor: auto;
          .category-name-wrapper {
            .category-name {
              color: grey;
            }
          }
        }
      }

      .selected-list {
        width: 528px;
        height: 557px;
        float: right;

        .dish-list {
          height: 521px;
          overflow-y: scroll;

          .fade-enter-active,
          .fade-leave-active {
            transition: opacity 0.6s;
          }
          .face-enter,
          .fade-leave-to {
            opacity: 0;
          }

          .dish-item {
            height: 48px;
            padding: 12px;
            line-height: 24px;
            font-size: 16px;
            color: #1f2d3d;
            position: relative;

            .remove-btn-wrapper {
              position: absolute;
              top: 16px;
              display: none;
            }

            .ivu-row {
              margin-left: 25px;
              .cost {
                color: #ff4949;
              }
            }
          }
          .dish-item:hover {
            .remove-btn-wrapper {
              display: inline-block;
            }
          }
        }
      }
    }
  }

  .step2 {
    padding: 0 14px;

    p {
      height: 36px;
      line-height: 36px;
      font-size: 18px;
      color: #1f2d3d;
      margin-bottom: 20px;
    }
    p::before {
      content: "";
      border-left: 4px solid #ff4949;
      padding-right: 12px;
    }

    .ivu-table .ivu-switch-disabled {
      border-color: #ea5853;
      background-color: #ea5853;
      &.ivu-switch-checked::after {
        background-color: #fff;
      }
    }

    .ivu-form {
      margin-top: 20px;

      .ivu-form-item {
        display: inline-block;

        .ivu-input,
        .ivu-select {
          width: 128px;
          height: 36px;
        }
      }
      .action-item {
        .ivu-btn {
          width: 104px;
          height: 36px;
          border: solid 1px #20a0ff;
          color: #20a0ff;
        }
      }
    }

    .making-setting {
      width: 100%;
      min-height: 400px;
    }

    .ivu-radio-group {
      .ivu-radio-group-item {
        width: 60px;
      }
    }

    .attr-list {
      .attr-item {
        margin-bottom: 10px;
        .ivu-select {
          width: 240px;
        }
      }
    }
  }

  .step3 {
    .img-item {
      .img-showcase {
        display: inline-block;
        position: relative;
        img {
          max-height: 250px;
        }
        .ivu-btn {
          position: absolute;
          top: -15px;
          right: -15px;
        }
      }

      .ivu-upload.ivu-upload-drag {
        width: 220px;
        height: 145px;
        border: solid 1px #c0ccda;

        .bg {
          height: 145px;
          line-height: 145px;
          font-size: 80px;
          color: #c0ccda;
        }
      }
    }
    .img-item.ivu-form-item-error {
      .ivu-upload.ivu-upload-drag {
        border-color: #ed3f14;
      }
    }
    .ingredient-item {
      .ivu-input {
        width: 720px;
        height: 128px;
        resize: none;
      }
    }
    .story-item {
      .ivu-input {
        width: 720px;
        height: 200px;
        resize: none;
      }
    }
    .word-count {
      position: absolute;
      bottom: 0;
      right: 40px;
      font-size: 14px;
      text-align: right;
      color: #99a9bf;
    }
  }

  .action-section {
    margin: 20px auto 0;
    width: 300px;

    .ivu-btn {
      width: 144px;
      height: 36px;
      font-size: 14px;
    }
    .next-btn,
    .ok-btn {
      background-color: #ff4949;
      color: #fff;
    }
  }
}
</style>