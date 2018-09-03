<template>
  <div id="taskDetailEdit">
    <Card class="card" >
      <Form label-position="right" :label-width="100">
        <Row>
          <i-col span="8">
            <FormItem label="缺陷名称:">
              <Input placeholder="请输入名称" v-model="flawName"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="4">
            <FormItem label="缺陷位置:">
              <Select v-model="voltageLevel">
                <Option v-for="(item,index) in voltageLevelList" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem>
              <Select v-model="line">
                <Option v-for="(item,index) in lineList" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem>
              <Select v-model="ganta">
                <Option v-for="(item,index) in gantaList" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="缺陷类别:">
              <Input placeholder="请输入类别" v-model="flawType"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="发现缺陷任务:">
              <Select v-model="flawTask">
                <Option v-for="(item,index) in findFlawTaskList" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="缺陷级别:">
              <Select v-model="flawLevel">
                <Option v-for="(item,index) in flawLevelList" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="缺陷图片:">
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                multiple
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>

            </FormItem>
          </i-col>
        </Row>
      <Row>
        <div class="list-content">
          <div class="demo-upload-list" v-for="(item,index) in defaultList" :key="index">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <!--<Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>-->
                <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
              </div>
          </div>
        </div>
      </Row>
      </Form>

    </Card>
    <div class="stopSubmit" v-show="!ableSubmit" @click="checkSubmit"></div>
  </div>
</template>
<script>
  import ICol from "iview/src/components/grid/col";
  export default {
    components: {ICol},
    data() {
      return {
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        imgName: '',
        visible: false,
        uploadList: this.defaultList,
        ableSubmit: false,//是否可以保存
        flawName:null,// 缺陷名称
        flawPos:null,//  缺陷位置
        voltageLevel:null,
        voltageLevelList:['1000v','2000v'],
        line:null,
        lineList:['线1','线2'],
        ganta:null,
        gantaList:['1','2','3'],
        flawType:null,// 缺陷类别
        findFlawTaskList:['任务1','任务2','任务3'],
        flawTask: null,
        flawLevelList:['低','一般','严重','特别'],//缺陷级别
        flawLevel:null
      }
    },
    mounted() {
    },
    methods: {
      checkSubmit(){
        if(this.flawName&&this.flawType&&this.flawTask&&this.flawLevel&&this.voltageLevel&&this.line&&this.ganta){
          this.ableSubmit = true
          this.toSubmit()
          this.$emit('closeModal', true)
        }
        else{
          this.$Notice.open({
              title: '请完善信息'
          });
        }
      },
      toSubmit(){
        console.log('我要提交数据了')
      }
    },
    watch:{
      // 这里监控数据是为了返回来的时候，数据为空时，使提交按钮不可点
      flawName(){
        if(!this.flawName){
          this.ableSubmit = false
        }
      },
      flawPos(){
        if(!this.flawPos){
          this.ableSubmit = false
        }
      },
      flawType(){
        if(!this.flawType){
          this.ableSubmit = false
        }
      },
      flawTask(){
        if(!this.flawTask){
          this.ableSubmit = false
        }
      },
      flawLevel(){
        if(!this.flawLevel){
          this.ableSubmit = false
        }
      },
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  #taskDetailEdit {
    padding: 40px;
    .card {
      margin-bottom: 10px;
    }
    .height0{
      height:1px;
    }
    .date-picker {
      display: inline-block;
    }
    .list-content{
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .demo-upload-list{
        margin: 0 10px;
      }
    }
    .stopSubmit{
      position: fixed;
      bottom: 0;
      right: 0;
      width: 136px;
      height: 61px;
      background: red;
      z-index: 2000;
      opacity: 0;
    }
  }

</style>
