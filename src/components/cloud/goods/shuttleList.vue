<template>
   <div>
		<Row>
			<Col span=10>
				<div class="newConstruction">
					<div class="choosable"><span style="width: 4px;height: 18px;background-color: #ff4949;"></span><span style="margin-left: 40px;">可选商品</span></div>
					<ul class="newConstructionul">
						<li class="newConstructionli" v-for='(item,index) in data' @click="handleChangeToNewData(index)">{{item.name}}</li>
				    </ul>
				</div> 
			</Col>
			<Col span=14>
				<div class="selectedCommodity" style="margin-left: -40px;">
					<div class="selectedCommodityspan"><span style="margin-left: 40px;">已选商品</span></div>
					<ul class="selectedCommodityul">
						<li class="selectedCommodityli" v-for='(item,index) in newData'>
							<span class="name" @click="handleChangeToData(index)">{{item.name}}</span>
							<span style="color: #ff4949;padding-left: 10%;" class="price"><Icon type="social-yen"></Icon>{{item.change}}</span>
							<Select @on-change="selectType($event,index)" style="width: 100px;margin-left: 10%;">
								<Option v-for="item in otherData" :value="item.price" :key="item.id">{{item.name}}</Option>
							</Select>
							<Select @on-change="selectDo($event,index)" style="width: 100px;margin-left: 10%;">
								<Option v-for="item in otherData2" :value="item.price" :key="item.id">{{item.name}}</Option>
							</Select>
						</li>
					</ul>
					
				</div>
				
			</Col>
		</Row>   	
   </div>
</template>

<script type="text/ecmascript-6">
	import * as api from '../../../vuex/api';
	
    export default {
    	data() {
    		return {
    			data:[],
    			newData:[],
    			otherData:[],
    			otherData2:[]
    		}
    	},
    	created(){
          this.getsidedishData();
       },
    	methods:{
    		getsidedishData() {
		        this.$http.post(api.COMMODITY + '/getSideDishesList',
		          JSON.stringify(this.getParam('get')))
		          .then(res => {
		            console.log(res);
		            let response = res.body;
		            if (response.code === 0) {
		              if (response.data.list) {
		                this.data = response.data.list;
		              }
		              
		            }
		          })
		          .catch(err => {
		            console.log(err);
		          })
		     },
    		handleChangeToNewData(index){
    			this.newData.push(this.data[index]);
    			this.data.splice(index,1);
    		},
    		handleChangeToData(index){
    			//this.data.push(this.newData[index]);
    			//this.newData.splice(index,1);
    		},
    		selectType(value,index){
    			this.newData[index].change  = this.newData[index].price;
    			this.newData[index].change += value;
    		},
    		selectDo(value,index){
    			
    			this.newData[index].change += value;
    		},
    		getParam(name) {
		        if (name === 'get') {
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
		            param: 117
		            
		          }
              }  
    	}
       }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	.newConstruction{
		width: 288px;
		border: 1px solid #e0e6ed;
		margin-top: 32px;
		font-family: PingFangSC;
		 .choosable{
			font-size: 16px;
			color: #1f2d3d;
			height: 36px;
			line-height: 36px;
		    border-bottom: 1px solid #e0e6ed;
		}
		.newConstructionul{
			margin-top: 14px;
			margin-left: 34px;
			margin-bottom: 20px;
			.newConstructionli{
				font-size: 16px;
			    color: #1f2d3d;
			    margin-top: 14px;
			    text-decoration:none;
			}
		}
	}
	.selectedCommodity{
		width: 528px;
		border: 1px solid #e0e6ed;
		margin-top: 32px;
		.selectedCommodityspan{
			font-size: 16px;
			color: #1f2d3d;
			height: 36px;
			line-height: 36px;
		    border-bottom: 1px solid #e0e6ed;
		   
		}
		.selectedCommodityul{
			margin-top: 14px;
			margin-left: 34px;
			 margin-bottom: 100px;
			text-decoration:none;
			.selectedCommodityli{
				font-size: 16px;
			    color: #1f2d3d;
			    margin-top: 14px;
			    text-decoration:none;
			}	
		}
	}
</style>