<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <Row>
        <Col span="12">
        <Form-item label="套餐名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入套餐名称"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="套餐编码">
          <Input v-model="formValidate.code" placeholder="请输入套餐编码"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="名称首字母">
          <Input v-model="formValidate.short" placeholder="请输入名称首字母"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="条形码">
          <Input v-model="formValidate.barCode" placeholder="请输入条形码"></Input>
        </Form-item>
        </Col>
        <Col span="24">
        <Form-item label="套餐图片" prop="picUrl">
          <Input type="text" v-model="formValidate.picUrl" style="display:none"></Input>

          <div v-if="formValidate.picUrl" class="store-upload">
            <img class="img" :src="formValidate.picUrl" width="220" height="145">
            <div class="store-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(formValidate.picUrl)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
            </div>
          </div>

          <Upload v-else style="width: 220px;" type="drag" :show-upload-list="false" :on-success="setMeal"
                  :format="['jpg','jpeg','png']" :max-size="5120" :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize" :action="resourceUrl">
            <div style="width: 220px;height: 145px;margin:0 auto;padding-top: 30px;">
              <Icon type="ios-cloud-upload" size="52" style="color: #99a9bf"></Icon>
              <p>点击或将图片拖拽到这里上传</p>
            </div>
          </Upload>
        </Form-item>
        </Col>
        <Col span="24">
        <Form-item label="套餐组成" prop="setmeal">
          <!-- <Input type="text" v-model="formValidate.dishes" style="display:none"></Input> -->
          <CheckboxGroup v-model="formValidate.dishes" style="display:none;">
            <Checkbox v-for="item in formValidate.dishes" :label="item.id" :key="item.id">{{item.dishName}}</Checkbox>
          </CheckboxGroup>

          <p class="button" v-if="!formValidate.dishes" @click="addModal = true">+添加</p>
          <p class="button" v-else @click="showModal">+编辑</p>
          <Table v-if="formValidate.dishes.length>0" stripe :columns="dishesColumns"
                 :data="formValidate.dishes"></Table>
          <div class="total-wrapper" v-if="formValidate.dishes.length>0">
            <Row>
              <Col span="12" style="padding-left: 18px;">
              商品总数：{{getGoodsAmount}}
              </Col>
              <Col span="12" style="padding-right: 18px;text-align: right">
              合计：
              <span class="price">￥{{getPriceAmount}}</span>
              </Col>
            </Row>
          </div>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="销售价格" prop="price">
          <Input v-model="formValidate.price" placeholder="请输入销售价格" number>
          <span slot="append">元</span>
          </Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="会员价格" prop="memberPrice">
          <Input v-model="formValidate.memberPrice" placeholder="请输入会员价格" number>
          <span slot="append">元</span>
          </Input>
        </Form-item>
        </Col>
        <Col span="24">
        <Form-item label="套餐描述" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :rows="4" placeholder="请输入套餐描述(最多50字)"></Input>
        </Form-item>
        </Col>
      </Row>
      <Form-item class="btn-group">
        <Button type="ghost" @click="reset" class="reset">取消</Button>
        <Button type="primary" @click="add('formValidate')" class="submit" v-if="!setMealInfo">提交</Button>
        <Button type="primary" @click="edit('formValidate')" class="submit" v-else>提交</Button>
      </Form-item>
    </Form>

    <Modal v-model="addModal" width="880">
      <p slot="header">
        <span>套餐成分</span>
      </p>
      <div class="modal-content clearfix">
        <div class="left">
          <h3 class="title">可选商品</h3>
          <div class="content">
            <ul>
              <li class="category-item" v-for="(item,index) in data" :class="{active: index === selectedIndex}"
                  @click="handleActive(index)">
                <h4 class="category-title">
                  <Icon class="icon" size="24" color="#c0ccda"
                        :type="index === selectedIndex?'ios-minus-outline':'ios-plus-outline'"></Icon>
                  <span class="category-name">{{item.name}}</span>
                </h4>
                <ul class="dishes-list">
                  <li class="item" v-for="item in item.dishesInfos" @click.stop="selectItem(item)">
                    <span class="dishes-name">{{item.dishName}}</span>
                    <!--<span class="dishes-price">{{item.price | getFixed}}</span>-->
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="right">
          <h3 class="title">已选商品</h3>
          <div class="content">
            <ul>
              <li class="item" v-for="(item,index) in selectedData">
                <span class="close" @click="delDish(index)">
                  <Icon size="24" type="ios-close-empty"></Icon>
                </span>
                <span class="name">{{item.dishName}}</span>
                <span class="price">{{item.totalPrice}}</span>
                <Select class="specification" size="small" :value="item.specificationId"
                        @on-change="changeSpecification(index,$event)">
                  <Option v-for="item in item.specificationList" :value="item.specificationId"
                          :key="item.specificationId">{{item.specificationName}}
                  </Option>
                </Select>
                <!--<Select v-if="item.makingList" class="makings" size="small" :value="item.makingId"-->
                        <!--@on-change="changeMaking(index,$event)">-->
                  <!--<Option v-for="item in item.makingList" :value="item.makingId" :key="item.makingId">-->
                    <!--{{item.makingName}}-->
                  <!--</Option>-->
                <!--</Select>-->
                <!--<Button v-else type="ghost" disabled-->
                        <!--style="width: 62px;height: 22px;padding: 0;margin-right: 18px;margin-top: -13px;">默认-->
                <!--</Button>-->
                <InputNumber class="dishes-num" size="small" :min="1" :value="item.count"
                             @on-change="changeCount(index,$event)"></InputNumber>
                <span class="unit">份</span>
              </li>
            </ul>
          </div>
          <div class="foot">
            <span class="amount">商品总数:
              <span class="num">{{getNum()}}</span>
            </span>
            <span class="total-amount">合计:
              <span class="totalNum">{{totalNum()}}</span>
            </span>
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <!--<Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>-->
        <Button type="ghost" @click="cancel" class="reset">取消</Button>
        <Button type="primary" @click="addSubmit" class="submit">保存</Button>
      </div>
    </Modal>

    <Modal title="查看图片" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from "../../../vuex/api";

  export default {
    props: {
      setMealInfo: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      const validateMemberPrice = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入会员价"));
        } else if (value > this.formValidate.price) {
          callback(new Error("会员价必须小于或等于原价"));
        } else {
          callback();
        }
      };

      const validateSetmeal = (rule, value, callback) => {
        if (value === []) {
          callback(new Error("请编辑套餐组成"));
        } else {
          callback();
        }
      };

      return {
        formValidate: {
          name: "",
          code: null,
          short: "",
          barCode: "",
          picUrl: "",
          dishes: [],
          price: null,
          memberPrice: null,
          desc: ""
        },
        dishesColumns: [
          {
            title: "菜品名称",
            key: "dishName"
          },
          {
            title: "规格",
            key: "specificationName"
          },
          {
            title: "做法",
            key: "makingName"
          },
          {
            title: "数量",
            key: "count"
          },
          {
            title: "价格",
            key: "totalPrice"
          }
        ],
        ruleValidate: {
          name: [{required: true, message: "套餐名不能为空", trigger: "blur"}],
          picUrl: [{required: true, message: "请上传套餐图片"}],
          price: [
            {
              required: true,
              type: "number",
              trigger: "blur",
              message: "请输入正确的价格"
            }
          ],
          memberPrice: [
            {type: "number", trigger: "blur", validator: validateMemberPrice}
          ],
          setmeal: [
            {
              required: true,
              message: "请编辑套餐组成",
              validator: validateSetmeal
            }
          ],
          desc: [
            {trigger: "blur", max: 50, type: "string", message: "最多只能输入50字"}
          ]
        },
        resourceUrl: api.RESOURCE,
        addModal: false, // 添加框
        data: [],
        selectedData: [],
        selectedIndex: "",
        dishId: null,
        isRepeat: false,
        imgName: "",
        visible: false,
        goodsAmount: 0,
        priceAmount: 0
      };
    },
    created() {
      this.getDetailData();
    },
    mounted() {
      this.$nextTick(() => {
        this.getData();
        // console.log(this.formValidate.dishes)
      });
    },
    computed: {
      getGoodsAmount() {
        this.goodsAmount = 0;
        for (let i = 0; i < this.formValidate.dishes.length; i++) {
          this.goodsAmount += this.formValidate.dishes[i].count;
        }
        return this.goodsAmount;
      },
      getPriceAmount() {
        this.priceAmount = 0;
        for (let i = 0; i < this.formValidate.dishes.length; i++) {
          // console.log(this.formValidate.dishes[i].totalPrice);
          this.priceAmount += Number(this.formValidate.dishes[i].totalPrice);
        }
        return this.priceAmount.toFixed(2);
      }
    },
    methods: {
      getData() {
        this.$http.post(api.PACKAGE + "dishesInfo",
          JSON.stringify(this.getParam("dishes")))
          .then(res => {
            console.log(res);
            let response = res.body;
            if (response.code === 0) {
              this.data = response.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      getDetailData() {
        if (this.setMealInfo) {
          this.formValidate.name = this.setMealInfo.name;
          this.formValidate.code = this.setMealInfo.code;
          this.formValidate.barCode = this.setMealInfo.barCode;
          this.formValidate.short = this.setMealInfo.initials;
          this.formValidate.picUrl = this.setMealInfo.picUrl;
          this.formValidate.price = Number(this.setMealInfo.price) / 100;
          this.formValidate.memberPrice =
            Number(this.setMealInfo.memberPrice) / 100;
          this.formValidate.desc = this.setMealInfo.desc;
          if (this.setMealInfo.dishes.length > 0) {
            for (let i = 0; i < this.setMealInfo.dishes.length; i++) {
              this.formValidate.dishes.push({
                dishId: this.setMealInfo.dishes[i].dishesId,
                dishName: this.setMealInfo.dishes[i].dishesName,
                makingName: this.setMealInfo.dishes[i].makingName
                  ? this.setMealInfo.dishes[i].makingName
                  : "",
                makingId: this.setMealInfo.dishes[i].makingId
                  ? this.setMealInfo.dishes[i].makingId
                  : "",
                makingList: this.setMealInfo.dishes[i].specifications.makings
                  ? this.setMealInfo.dishes[i].specifications.makings
                  : [],
                specificationName: this.setMealInfo.dishes[i].specificationName,
                specificationId: this.setMealInfo.dishes[i].specificationId,
                specificationList: this.setMealInfo.dishes[i].specifications
                  .specifications,
                count: this.setMealInfo.dishes[i].amount,
                totalPrice: (Number(this.setMealInfo.dishes[i].price) / 100
                ).toFixed(2)
              });
              this.selectedData.push({
                dishId: this.setMealInfo.dishes[i].dishesId,
                dishName: this.setMealInfo.dishes[i].dishesName,
                makingName: this.setMealInfo.dishes[i].makingName
                  ? this.setMealInfo.dishes[i].makingName
                  : "",
                makingId: this.setMealInfo.dishes[i].makingId
                  ? this.setMealInfo.dishes[i].makingId
                  : "",
                makingList: this.setMealInfo.dishes[i].specifications.makings
                  ? this.setMealInfo.dishes[i].specifications.makings
                  : [],
                specificationInfo: {
                  specificationName: this.setMealInfo.dishes[i].specificationName,
                  specificationId: this.setMealInfo.dishes[i].specificationId,
                  price: Number(this.setMealInfo.dishes[i].specificationPrice)
                },
                makingInfo: {
                  makingName: this.setMealInfo.dishes[i].makingName
                    ? this.setMealInfo.dishes[i].makingName
                    : "",
                  makingId: this.setMealInfo.dishes[i].makingId
                    ? this.setMealInfo.dishes[i].makingId
                    : "",
                  price: this.setMealInfo.dishes[i].makingPrice
                    ? Number(this.setMealInfo.dishes[i].makingPrice)
                    : ""
                },
                specificationName: this.setMealInfo.dishes[i].specificationName,
                specificationId: this.setMealInfo.dishes[i].specificationId,
                specificationList: this.setMealInfo.dishes[i].specifications
                  .specifications,
                count: this.setMealInfo.dishes[i].amount,
                totalPrice: (Number(this.setMealInfo.dishes[i].price) / 100
                ).toFixed(2)
              });
            }
          } else {
            this.formValidate.dishes = [];
          }
        }
      },
      add(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.formValidate.dishes.length > 0) {
              this.$http.post(api.PACKAGE + "add",
                JSON.stringify(this.getParam("add")))
                .then(res => {
                  // console.log(res)
                  let response = res.body;
                  if (response.code === 0) {
                    this.$Message.success("新增成功");
                    setTimeout(() => {
                      this.$router.go(-1);
                    }, 1000);
                  } else if (response.code === 11027) {
                    this.$Message.error("套餐名重复");
                  } else if (response.code === "11028") {
                    this.$Message.error("套餐编码重复");
                  } else if (response.code === "11029") {
                    this.$Message.error("条形码重复");
                  } else {
                    this.$Message.error(response.msg);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              this.$Message.error('请编辑套餐组成')
            }
          } else {
            this.$Message.error("表单验证失败!");
          }
        });
      },
      reset() {
        this.$router.go(-1);
      },
      edit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (!this.formValidate.dishes) {
              this.$Message.error("请选择菜品");
              return false;
            } else {
              this.$http.post(api.PACKAGE + "edit",
                JSON.stringify(this.getParam("edit")))
                .then(res => {
                  // console.log(res)
                  let response = res.body;
                  if (response.code === 0) {
                    this.$Message.success("修改成功");
                    setTimeout(() => {
                      this.$router.go(-1);
                    }, 1000);
                  } else if (response.code === 11027) {
                    this.$Message.error("套餐名重复");
                  } else if (response.code === "11028") {
                    this.$Message.error("套餐编码重复");
                  } else if (response.code === "11029") {
                    this.$Message.error("条形码重复");
                  } else if (response.msg === "异常回滚") {
                    this.$Message.error("编辑时必须添加套餐组成");
                  } else {
                    this.$Message.error(response.msg);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
        });
      },
      handleActive(index) {
        if (this.selectedIndex !== index) {
          this.selectedIndex = index;
        } else {
          this.selectedIndex = '';
        }
      },
      totalNum() {
        let num = 0;
        if (this.selectedData.length > 0) {
          for (let i = 0; i < this.selectedData.length; i++) {
            if (this.selectedData[i].makingInfo) {
              num +=
                Number(
                  this.selectedData[i].specificationInfo.price +
                  this.selectedData[i].makingInfo.price
                ) * this.selectedData[i].count;
            } else {
              num +=
                Number(this.selectedData[i].specificationInfo.price) *
                this.selectedData[i].count;
            }
          }
        }
        return "￥" + (num / 100).toFixed(2);
      },
      getNum() {
        let num = 0;
        if (this.selectedData.length > 0) {
          for (let i = 0; i < this.selectedData.length; i++) {
            num += this.selectedData[i].count;
          }
        }
        return num;
      },
      changeSpecification(index, value) {
        for (let i = 0; i < this.selectedData[index].specificationList.length; i++) {
          if (this.selectedData[index].specificationList[i].specificationId === value) {
            this.selectedData[index].specificationInfo = this.selectedData[index].specificationList[i];
            this.selectedData[index].specificationName = this.selectedData[index].specificationList[i].specificationName;
          }
        }
        if (this.selectedData[index].makingList) {
          this.$set(this.selectedData[index], "totalPrice", (Number(this.selectedData[index].specificationInfo.price + this.selectedData[index].makingInfo.price) * this.selectedData[index].count / 100).toFixed(2));
          //          this.$set(this.selectedData[index], 'memberPrice', (Number(this.selectedData[index].specificationInfo.memberPrice + this.selectedData[index].makingInfo.memberPrice) / 100).toFixed(2));
        } else {
          this.$set(this.selectedData[index], "totalPrice", (Number(this.selectedData[index].specificationInfo.price) * this.selectedData[index].count / 100).toFixed(2));
          //          this.$set(this.selectedData[index], 'memberPrice', (Number(this.selectedData[index].specificationInfo.memberPrice) / 100).toFixed(2));
        }
        this.totalNum();
      },
      changeMaking(index, value) {
        for (let i = 0; i < this.selectedData[index].makingList.length; i++) {
          if (this.selectedData[index].makingList[i].makingId === value) {
            this.selectedData[index].makingInfo = this.selectedData[index].makingList[i];
            this.selectedData[index].makingName = this.selectedData[index].makingList[i].makingName;
            this.selectedData[index].makingId = this.selectedData[index].makingList[i];
          }
        }
        this.$set(
          this.selectedData[index],
          "totalPrice",
          (Number(
              this.selectedData[index].specificationInfo.price +
              this.selectedData[index].makingInfo.price
            ) *
            this.selectedData[index].count /
            100
          ).toFixed(2)
        );
        //        this.$set(this.selectedData[index], 'memberPrice', (Number(this.selectedData[index].specificationInfo.memberPrice + this.selectedData[index].makingInfo.memberPrice) / 100).toFixed(2));
        this.totalNum();
      },
      changeCount(index, value) {
        this.selectedData[index].count = value;
        if (this.selectedData[index].makingList) {
          this.$set(
            this.selectedData[index],
            "totalPrice",
            (Number(
                this.selectedData[index].specificationInfo.price +
                this.selectedData[index].makingInfo.price
              ) *
              this.selectedData[index].count /
              100
            ).toFixed(2)
          );
        } else {
          this.$set(
            this.selectedData[index],
            "totalPrice",
            (Number(this.selectedData[index].specificationInfo.price) *
              this.selectedData[index].count /
              100
            ).toFixed(2)
          );
        }
        this.totalNum();
        this.getNum();
      },
      selectItem(item) {
        this.dishId = item.dishId;
        this.isRepeat = this.selectedData.indexOf(item) > -1? true : false;
        if (this.isRepeat === false) {
          this.$http.post(api.PACKAGE + "dishesDetail",
            JSON.stringify(this.getParam("dishesDetail")))
            .then(res => {
              // console.log(res)
              let response = res.body;
              if (response.code === 0) {
                item.specificationList = response.data.specificationList;
                item.specificationInfo = response.data.specificationList[0];
                item.specificationName = response.data.specificationList[0].specificationName;
                item.specificationId = response.data.specificationList[0].specificationId;
                item.count = 1;
                if (response.data.makingList.length > 0) {
                  item.makingList = response.data.makingList;
                  item.makingInfo = response.data.makingList[0];
                  item.makingName = response.data.makingList[0].makingName;
                  item.makingId = response.data.makingList[0].makingId;
                  this.$set(
                    item,
                    "totalPrice",
                    (Number(
                        item.specificationInfo.price + item.makingInfo.price
                      ) *
                      item.count /
                      100
                    ).toFixed(2)
                  );
                  //                  this.$set(item, 'memberPrice', (Number(item.specificationInfo.memberPrice + item.makingInfo.memberPrice) / 100).toFixed(2));
                } else {
                  this.$set(
                    item,
                    "totalPrice",
                    (Number(item.specificationInfo.price) *
                      item.count /
                      100
                    ).toFixed(2)
                  );
                  //                  this.$set(item, 'memberPrice', (Number(item.specificationInfo.memberPrice) / 100).toFixed(2));
                }
                this.selectedData.push(item);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      },
      delDish(index) {
        this.selectedData.splice(index, 1);
      },
      showModal() {
        this.addModal = true;
      },
      setMeal(res, file) {
        if (res.code === 0) {
          this.formValidate.picUrl = res.data.fullFilename;
        } else {
          this.$Message.error("网络异常，请重新上传");
        }
      },
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove() {
        this.formValidate.picUrl = "";
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: "文件格式不正确",
          desc: "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "超出文件大小限制",
          desc: "文件 " + file.name + " 太大，不能超过 5M。"
        });
      },
      cancel() {
        this.addModal = false;
      },
      addSubmit() {
        this.formValidate.dishes = null;
        this.formValidate.dishes = this.selectedData;
        this.addModal = false;
        console.log(this.formValidate.dishes);
      },
      getDishesList() {
        let arr = [];
        if (this.formValidate.dishes) {
          for (let i = 0; i < this.formValidate.dishes.length; i++) {
            arr.push({
              dishesId: this.formValidate.dishes[i].dishId,
              dishesName: this.formValidate.dishes[i].dishName,
              specificationId: this.formValidate.dishes[i].specificationId,
              specificationName: this.formValidate.dishes[i].specificationName,
              makingId: this.formValidate.dishes[i].makingId
                ? this.formValidate.dishes[i].makingId
                : "",
              makingName: this.formValidate.dishes[i].makingName
                ? this.formValidate.dishes[i].makingName
                : "",
              amount: this.formValidate.dishes[i].count,
              price: Number(this.formValidate.dishes[i].totalPrice) * 100
              //              memberPrice: Number(this.formValidate.dishes[i].memberPrice) * 100
            });
          }
        }
        return arr;
      },
      getParam(name) {
        if (name === "dishes") {
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
              merchantId: localStorage.currentMerchantId
            }
          };
        } else if (name === "dishesDetail") {
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
              id: this.dishId
            }
          };
        } else if (name === "add") {
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
              merchantId: localStorage.currentMerchantId,
              name: this.formValidate.name,
              code: this.formValidate.code,
              initials: this.formValidate.short,
              barCode: this.formValidate.barCode,
              picUrl: this.formValidate.picUrl,
              price: Number(this.formValidate.price) * 100,
              memberPrice: !this.formValidate.memberPrice
                ? Number(this.formValidate.price) * 100
                : Number(this.formValidate.memberPrice) * 100,
              desc: this.formValidate.desc,
              minSaleNum: 1,
              status: 0,
              dishes: this.getDishesList()
            }
          };
        } else if (name === "edit") {
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
              id: this.setMealInfo.id,
              merchantId: localStorage.currentMerchantId,
              name: this.formValidate.name,
              code: this.formValidate.code,
              initials: this.formValidate.short,
              barCode: this.formValidate.barCode,
              picUrl: this.formValidate.picUrl,
              price: Number(this.formValidate.price) * 100,
              memberPrice: !this.formValidate.memberPrice
                ? Number(this.formValidate.price) * 100
                : Number(this.formValidate.memberPrice) * 100,
              desc: this.formValidate.desc,
              minSaleNum: 1,
              status: 0,
              dishes: this.getDishesList()
              // newName: this.formValidate.name === this.setMealInfo.name ? this.setMealInfo.name : this.formValidate.name
            }
          };
        }
      }
    },
    filters: {
      getFixed(value) {
        return "￥" + (Number(value) / 100).toFixed(2);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .button {
    font-size: 14px;
    color: #20a0ff;
    cursor: pointer;
  }

  .store-upload {
    display: inline-block;
    width: 220px;
    height: 145px;
    text-align: center;
    line-height: 145px;
    border: 1px solid transparent;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 40px;
    img {
      width: 100%;
      height: 100%;
    }
    &:hover {
      .store-upload-list-cover {
        display: block;
      }
    }
    .store-upload-list-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      i {
        color: #fff;
        font-size: 50px;
        cursor: pointer;
        margin: 0 20px;
      }
    }
  }

  .btn-group,
  .ivu-modal-footer {
    text-align: center;
    .reset {
      width: 144px;
      height: 36px;
      border-radius: 2px;
      background-color: #ffffff;
      border: solid 1px #c0ccda;
      color: #475669;
      font-size: 14px;
      &:hover {
        opacity: 0.9;
      }
    }

    .submit {
      margin-left: 12px;
      width: 144px;
      height: 36px;
      border-radius: 2px;
      background-color: #ff4949;
      font-size: 14px;
      &:hover {
        opacity: 0.9;
      }
    }
  }

  .total-wrapper {
    height: 48px;
    line-height: 48px;
    border: 1px solid #e9eaee;
    margin-top: -1px;
    font-size: 14px;
    .price {
      font-size: 24px;
      color: #ff4949;
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
        padding: 18px;
        width: 100%;
        height: 434px;
        overflow: scroll;
        .category-item {
          margin-bottom: 24px;
          font-size: 0;
          color: #1f2d3d;
          cursor: pointer;
          .category-title {
            height: 24px;
            line-height: 24px;
            font-weight: normal;
            .icon {
              display: inline-block;
              margin-right: 17px;
              vertical-align: top;
            }
            .category-name {
              display: inline-block;
              font-size: 16px;
              color: #1f2d3d;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }

          .dishes-list {
            display: none;
            padding: 16px 0 0 37px;
            .item {
              margin-bottom: 22px;
              cursor: pointer;
              &:hover {
                .dishes-name {
                  color: #1f2d3d;
                }
              }
              .dishes-name {
                display: inline-block;
                width: 50%;
                font-size: 14px;
                text-align: left;
                color: #5e6d82;
              }
              .dishes-price {
                display: inline-block;
                width: 50%;
                font-size: 14px;
                text-align: right;
                color: #ff4949;
              }
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
          &.active {
            .dishes-list {
              display: block;
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
        .item {
          height: 48px;
          line-height: 48px;
          font-size: 0;
          cursor: pointer;
          .close {
            display: inline-block;
            padding-top: 10px;
            visibility: hidden;
            vertical-align: top;
            width: 32px;
            height: 48px;
            line-height: 48px;
            text-align: center;
          }
          .name {
            display: inline-block;
            vertical-align: top;
            width: 141px;
            height: 48px;
            line-height: 48px;
            text-overflow: ellipsis;
            white-space: normal;
            overflow: hidden;
            font-size: 16px;
            color: #1f2d3d;
          }
          .price {
            display: inline-block;
            vertical-align: top;
            margin-right: 18px;
            width: 88px;
            height: 48px;
            line-height: 48px;
            color: #ff4949;
            font-size: 16px;
          }
          .specification {
            display: inline-block;
            padding-top: 12px;
            vertical-align: top;
            margin-right: 18px;
            width: 64px;
            height: 24px;
          }
          .makings {
            display: inline-block;
            padding-top: 12px;
            vertical-align: top;
            margin-right: 18px;
            width: 64px;
            height: 24px;
          }
          .dishes-num {
            display: inline-block;
            margin-top: 12px;
            vertical-align: top;
            margin-right: 2px;
            width: 48px;
          }
          .unit {
            display: inline-block;
            font-size: 16px;
          }
          &:hover {
            background: #f9fafc;
            .close {
              visibility: visible;
            }
          }
        }
      }
      .foot {
        height: 48px;
        font-size: 0;
        border-top: 1px dashed #e4e9ef;
        .amount {
          display: inline-block;
          padding-left: 32px;
          vertical-align: top;
          width: 50%;
          height: 46px;
          line-height: 46px;
          font-size: 12px;
          color: #5e6d82;
          .num {
            color: #ff4949;
          }
        }
        .total-amount {
          display: inline-block;
          padding-right: 32px;
          width: 50%;
          height: 46px;
          line-height: 46px;
          font-size: 14px;
          color: #1f2d3d;
          text-align: right;
          .totalNum {
            color: #ff4949;
            font-size: 24px;
          }
        }
      }
    }
  }
</style>
