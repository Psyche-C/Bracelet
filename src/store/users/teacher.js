import axios from '../axios';
import qs from 'querystring';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		teachers:[],
		pageTeach:0,//分页
		teacherAdmin:[],
		hideTeach:false,//分页显示状态。
		teaadminOne:[],
	},
	getters:{
		teachers:state => state.teachers,
		pageTeach:state => state.pageTeach,
		teacherAdmin:state => state.teacherAdmin,
		hideTeach:state => state.hideTeach,
		teaadminOne:state => state.teaadminOne,
	},
	mutations:{
		allTch:(state,val) => {
			val[0].forEach(function(item,index){
				item.teach_gender == 1 ? item.teach_gender = '女' : item.teach_gender = '男';
				item.teach_status == 1 ? item.teach_status = '启用' : item.teach_status = '禁用';
			});
			state.teachers = val[0];
			state.pageTeach = val[1];
			state.pageTeach = (+state.pageTeach)*10;//转化为分页，ele框架要求乘以10.
			// state.teacherAdmin = val[2];
			if(state.pageTeach < 10){
				state.hideTeach = true;
			}else{
				state.hideTeach = false;
			}
  	},
  	AllteaadminOneAction:(state,val)=>{
  		state.teaadminOne = [];
  		state.teacherAdmin = val[0];
  	},
  	teaadminOneAction:(state,val) =>{
  		state.teacherAdmin = val[0];
  		state.teaadminOne = [];
  		val[1].forEach((item)=>{
				state.teaadminOne.push(item.module_id);
			});
  	}
	},
	actions:{
		saveTch:(context,form) => {
			return new Promise((resolve,reject)=>{
			//add:
				if(form.teach_id==undefined){//如果id不存在，执行添加。
					axios.post(bp+'/manager/add_teach',qs.stringify(form)).then((result)=>{
						context.dispatch('findAllTch');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
			//update:
				}else{  //否则执行修改。
					axios.post(bp+'/manager/update_teach',qs.stringify(form)).then((result)=>{
						// context.dispatch('findAllTch');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
				}
			});
		},
		//授权：
		grantTch:(context,idsAdmin) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/grant_teach',qs.stringify({user_module:idsAdmin})).then((result)=>{
					// context.dispatch('findAllTch');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//find:
		findAllTch:(context) => {
			axios.post(bp+'/manager/show_teach').then(({data})=>{
				context.commit('allTch',data);
			});
		},
		teaadminOneRAll:(context)=>{
			axios.post(bp+'/manager/getUserModel').then(({data})=>{
				context.commit('AllteaadminOneAction',data);
			});
		},
		// 获取单个用户权限
		teaadminOneR:(context,userId) =>{
			axios.post(bp+'/manager/getUserModel',qs.stringify(userId)).then(({data})=>{
				context.commit('teaadminOneAction',data);
			});
		},
		//queryKeys:
		findTch:(context,tch) => {
			axios.post(bp+'/manager/show_teach',qs.stringify(tch)).then(({data})=>{
				context.commit('allTch',data);
			});
		},
		//queryTeach:
		queryTeach:(context,page) => {
			axios.post(bp+'/manager/show_teach',qs.stringify(page)).then(({data})=>{
				context.commit('allTch',data);
			});
		},
		//delete:
		deleteByIdTch:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/delete_teach',qs.stringify(ids)).then((result)=>{
					// context.dispatch('findAllTch');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		batchDeleteByIdTch:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/batchDelete_teach',qs.stringify(ids)).then((result)=>{
					// context.dispatch('findAllTch');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	},
}


//如果用户存在，输入框变红。
