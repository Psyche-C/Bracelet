import axios from '../axios';
import qs from 'querystring';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		circle:[],//
		toolsCircle:[],//所有工具箱数据
		circleTools:[],//某工具箱下所有绑定手环
		pagesCircle:0,//分页
		hideCircle:false,//分页显示状态。
	},
	getters:{
		circle:state => state.circle,
		toolsCircle:state => state.toolsCircle,
		circleTools:state => state.circleTools,
		pagesCircle:state => state.pagesCircle,
		hideCircle:state => state.hideCircle,
	},
	mutations:{
		allCircle:(state,val) => {
			val[1].forEach(function(item,index){
				item.handler_status == 1 ? item.handler_status = '启用' : item.handler_status = '已绑定';
				item.handler_login == 1 ? item.handler_login = '良好' : item.handler_login = '已坏';
				item.handler_order = +item.handler_order;//排序要用number型数据。
			});
			state.circle = val[1];
			state.toolsCircle = val[0];
			state.pagesCircle = (+val[2])*10;//分页需要*10.
			if(state.pagesCircle < 10){
				state.hideCircle = true;
			}else{
				state.hideCircle = false;
			}
		},
		allCircleTools:(state,val) => {
			if(val[0]){
				state.circleTools = val[0];
			}
		}
	},
	actions:{
		saveCircle:(context,form) => {
			return new Promise((resolve,reject)=>{
			//add:
				if(form.handler_id==undefined){//如果id不存在，执行添加。
					axios.post(bp+'/manager/add_handler',qs.stringify(form)).then((result)=>{
						// context.dispatch('findAllCircle');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
			//update:
				}else{  //否则执行修改。
					axios.post(bp+'/manager/update_handler',qs.stringify(form)).then((result)=>{
						// context.dispatch('findAllCircle');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
				}
			});
		},
		//find:
		findAllCircle:(context) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/show_handler').then(({data})=>{
					context.commit('allCircle',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//queryKeys:
		findCircle:(context,Circle) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/show_handler',qs.stringify(Circle)).then(({data})=>{
					context.commit('allCircle',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findCircleTools:(context,Circle) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/show_useHandler',qs.stringify(Circle)).then(({data})=>{
					context.commit('allCircleTools',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//delete:
		deleteByIdCircle:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/delete_handler',qs.stringify(ids)).then((result)=>{
					// context.dispatch('findAllCircle');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//batchdelete:
		batchDeleteByIdCircle:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/batch_delete_handler',qs.stringify(ids)).then((result)=>{
					// context.dispatch('findAllCircle');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		uploadCircle:(context,file) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/handler_up',qs.stringify(file)).then((result)=>{
					context.dispatch('findAllCircle');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	}
}


