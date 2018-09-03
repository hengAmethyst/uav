<template>
  <div id="taskDetailEdit">
    <Card class="card" >
      <Form label-position="right" :label-width="100">
        <Row>
          <i-col span="12">
            <FormItem label="人员姓名:">
              <Input placeholder="请输入姓名" v-model="personName"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="执行任务:">
              <Select v-model="taskName">
                <Option v-for="(item,index) in taskList" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <div class="height0"></div>
          </i-col>
        </Row>

        <Row>
          <i-col span="12">
            <FormItem label="当前完成巡视:">
              <Input placeholder="请输入" v-model="nowFinished"></Input>
            </FormItem>
          </i-col>
        </Row>
        
        <Row>
          <i-col span="12">
            <FormItem label="状态:">
              <Input placeholder="请输入" v-model="nowState"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="公司:">
              <Input placeholder="请输入" v-model="companyName"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="班组:">
              <Input placeholder="请输入" v-model="group"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="头像:">
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
          }
        ],
        imgName: '',
        visible: false,
        uploadList: this.defaultList,
        ableSubmit: false,//是否可以保存
        personName:null,//人员姓名
        taskName:null,
        taskList:['任务1','任务2','任务3'],
        nowFinished:null,//当前完成巡视
        nowState:null,//当前状态
        companyName:null,//公司名字
        group:null,//班组名字
        needWatchData:null
      }
    },
    mounted() {
    },
    methods: {
      checkSubmit(){
        if(this.personName&&this.taskName&&this.nowFinished&&this.nowState&&this.companyName&&this.group){
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
      personName(){
        if(!this.personName){
          this.ableSubmit = false
        }
      },
      nowFinished(){
        if(!this.nowFinished){
          this.ableSubmit = false
        }
      },
      nowState(){
        if(!this.nowState){
          this.ableSubmit = false
        }
      },
      companyName(){
        if(!this.companyName){
          this.ableSubmit = false
        }
      },
      group(){
        if(!this.group){
          this.ableSubmit = false
        }
      }
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
        margin: 0 40px;
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
