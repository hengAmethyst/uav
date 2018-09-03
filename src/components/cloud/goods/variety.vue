<template>
    <div>
		<Form>
	        <Form-item class="row-1 order-type" label="菜品分类">
	            <Select style="width: 380px;">
	              <Option v-for="type in orderType" :key="type" :value="type"></Option>
	            </Select>
	          </Form-item>
	          <Form-item class="row-1 order-source" label="菜品名称">
	          	<Input style="width: 380px;" v-model="value" placeholder="请输入..." class="classifyInput"></Input>
	          </Form-item>
	          <Form-item class="row-1 payment-method" label="菜品编号">
	          	<Input style="width: 380px;" v-model="value" placeholder="请输入..." class="classifyInput"></Input>
	          </Form-item>
	          <FormItem style='text-align: center;'>
	          	<Button  class="order-dates">重置</Button>
	            <Button type="primary"  class="order-dates">查询</Button>
	        </FormItem>
       </Form>
        <div class="result-newly">
    			<div class="result-total">共有 112 个相关结果 </div>
	        	<div class="result-button">
	        		<Button class="result-buttons" name="varietyNew" ><Icon type="plus-round" ></Icon>新建</Button>
	        		<Button class="result-buttons" style=" background-color: #ffffff;color: #475669; width: 110px;">批量删除(10)</Button>
	        	</div>
    	</div>
        <Table border :columns="columns" :data="items"></Table>
        <div class="variety-button">
        	<Button class="variety-buttons">模板下载</Button>
        	<Button class="variety-buttons">批量导出</Button>
        	<Button class="variety-buttons">批量导入</Button>
        </div>
        <Page :total="100"></Page>
       <Modal
		      class="modal-wrapper"
		      v-model="addShift"
		      title="新建分类"
		      :loading="loading"
		      @on-ok="asyncOK">
		      <h4 class="modal-title"><b style="color: #ff4949;margin-right: 5px;">*</b>分类名称</h4>
		      <Input v-model="shiftName" placeholder="请输入..."></Input>
    	</Modal>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  
  data() {
    return {
      orderType: ['全部', '堂吃', '外带', '外送', '自提', '第三方外卖'],
      orderSource: ['B端PC', 'S端', 'H5', '第三方外卖'],
      orderStatus: ['待审核', '已支付', '已拒绝', '买单待审', '已完成', '已退单', '已取消', '已关闭'],
      paymentMethod: ['全部', '现金'],
      showDetail: false,
      columns: [
      	{
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
          title: '菜品品名',
          key: 'cuisine'
        },
        {
          title: '分类',
          key: 'table'
        },
        {
          title: '编号',
          key: 'numbers'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '会员价',
          key: 'VIPprice'
        },
        {
          title: '创建时间',
          key: 'amount',
          width:'10%',
        },
        {
          title: '创建人',
          key: 'type'
        },
        {
          title: '状态',
          key: 'source'
        },
        {
          title: '操作',
          width:'10%',
          render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                            },
                         style: {
                            marginRight: '5px',
                            width: '40px',
						    height: '24px',
						    'font-family': 'PingFangSC',
							'font-size': '13px',
							'line-height': '1',
							'text-align': 'center',
							color: '#20a0ff',
							'background-color': '#FFFFFF',
							'border-color': '#20a0ff',
							'margin-right': '20px',
								       
                            },
                            }, '编辑'),
                            h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                               		style: {
                                        marginRight: '5px',
                                        width: '40px',
										height: '24px',
										'font-family': 'PingFangSC',
									    'font-size': '13px',
									    'line-height': '1',
									    'text-align': 'center',
									   	color:'#ff4949',
								       'background-color': '#FFFFFF',
								       'border-color':'#ff4949',
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                        ]);
                }
        },
       {
          title: '切换状态',
          key: '',
          width: 120,
          render: (h, params) => {
                return h('div', [
                    h('i-switch', {
                        props: {
                            type: 'primary',
                            size: 'large'
                            },
                           
           
                            },),
                           
                        ]);
	          }
        },
        
      ],
      items: Array(10).fill({
        cuisine: '韭菜',
        table: '热菜',
        numbers:'HS003',
        price:'30元',
        VIPprice:'20元',
        amount: '2017-06-09 14:15:01',
        type: '朱梓骁',
        source: '启用',
      })
   }
  },
  methods: {
          remove (index) {
              this.items.splice(index, 1);
          }
      },
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.result-newly{
     	display: flex;
     	.result-total{
     		flex: 1;
	        font-size: 14px;
	        line-height: 1;
	        margin: 12px 0 8px 0;
	       } 
        .result-button{
        	
        	margin-bottom: 10px;
        	.result-buttons{
        		width: 88px;
        		height: 36px;
        		font-family: PingFangSC;
				  font-size: 14px;
				  line-height: 1;
				  text-align: center;
				  color: #ffffff;
				  background-color: #20a0ff;
        	}
        }
      
    }  
.variety-button{
	width: 100%;
	.variety-buttons{
		width: 88px;
	  	height: 36px;
	  	border-radius: 2px;
	  	border: solid 1px #ff4949;
	  	font-family: PingFangSC;
	  font-size: 14px;
	  line-height: 1;
	  text-align: center;
	  color: #ff4949;
	  margin-right: 16px;
	}
}
</style>