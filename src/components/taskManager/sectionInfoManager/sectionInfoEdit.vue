<template>
  <div id="taskDetailEdit">
    <Card class="card" >
      <Form label-position="right" :label-width="100">
        <Row>
          <i-col span="12">
            <FormItem label="区间名称:">
              <Select>
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="杆塔范围:">
              <Select>
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <div class="height0"></div>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="倾斜摄影图:">
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
        uploadList: this.defaultList
      }
    },
    mounted() {
    },
    methods: {}
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
  }

</style>
