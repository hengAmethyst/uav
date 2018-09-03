<template>
	  <div>
	  	 <div class="result-newly">
    			<div class="result-total">共有 112 个相关结果 </div>
	        	<div class="result-button">
	        		<Button @click="modal10 = true" class="result-buttons"><Icon type="plus-round"></Icon>新建</Button>
				    	<Modal
					        title="新建分类"
					        v-model="modal10"
					        class-name="vertical-center-modal" width="420">
					        <little-fen></little-fen>
				    	</Modal>
	        	</div>
    		</div>
	      <Table border :columns="columns" :data="items"></Table>
	      <Page :total="100"></Page>
	      <Modal v-model="showDetail" title="编辑分类" width="420" class-name="vertical-center-modal">
	          <div slot=""></div>
	          <little-compile></little-compile>
	      </Modal>
	  </div>
	       
</template>

<script type="text/ecmascript-6">
import littleFen from '@/components/cloud/goods/little'
import littleCompile from '@/components/cloud/goods/compile'

export default {
	components:{
			littleFen,
			littleCompile,
		},
	
  data() {
    return {
    	modal10: false,
      showDetail: false,
      columns: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '小菜名称',
          key: 'name'
        },
        {
          title: '价格',
          key: 'rice'
        },
         {
          title: '创建人',
          key: 'type'
        },
        {
          title: '创建时间',
          key: 'amount'
        },
        {
          title: '排序',
          key: '',
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
                            }, '置顶'),
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
                                   
                                }, '上移'),
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
                                   
                                }, '下移')
              ]);
          }
          
        },
        {
          title: '操作',
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
                            nativeOn: {
							                click: () => {
							                  this.showDetail = true;
                								}
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
          
        
      ],
      items: Array(10).fill({
        id: '1',
        name:'酒水',
        rice:'30元',
        type: '朱梓骁',
        amount: '2017-06-09 14:15:01',
       
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

<style lang="scss" rel="stylesheet/scss">
	.vertical-center-modal{
	        display: flex;
	        align-items: center;
	        justify-content: center;
	
	        .ivu-modal{
	            top: 0;
	        }
	    }





</style>