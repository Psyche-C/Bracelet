/*云端用户管理*/
import axios from '../axios';
import qs from 'querystring';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		userClouds:[],
		pageTClouds:0,
		userAdminClouds:[],
		useradminOne:[]
	},
	getters:{
		userClouds:state => state.userClouds,
		pageTClouds:state => state.pageTClouds,
		userAdminClouds:state => state.userAdminClouds,
		useradminOne:state => state.useradminOne,
	},
	mutations:{
		allUserClouds:(state,val) => {
			val[0].forEach(function(item,index){
				item.user_gender == 1 ? item.user_gender = '女' : item.user_gender = '男';
				item.user_status == 1 ? item.user_status = '启用' : item.user_status = '禁用';
			});
			state.userClouds = val[0];
			state.pageTClouds = (+val[1])*10;
		},
		allAdminClouds:(state,val) => {
			state.useradminOne = [];
			state.userAdminClouds = val[0];
		},
		oneAdminClouds:(state,val) =>{
			state.userAdminClouds = val[0];
			state.useradminOne = [];
			val[1].forEach((item)=>{
				state.useradminOne.push(item.module_id);
			})
		}
	},
	actions:{
		saveUserClouds:(context,form) => {    
			return new Promise((resolve,reject)=>{  //异步请求数据
			//add:
				if(form.user_id==undefined){//如果id不存在，执行添加.
					axios.post(bp+'/clouds/add_sysUser',qs.stringify(form)).then((result)=>{
						context.dispatch('findAllUserClouds');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
			//update:
				}else{  //否则执行修改。
					axios.post(bp+'/clouds/update_sysUser',qs.stringify(form)).then((result)=>{
						context.dispatch('findAllUserClouds');//刷新。
						resolve(result)
					}).catch((error)=>{
						reject(error);
					});
				}
			});
		},
		//授权：
		grantUserClouds:(context,idsAdminClouds) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/clouds/grant_user',qs.stringify({user_module:idsAdminClouds})).then((result)=>{
					context.dispatch('findAllUserClouds');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//find:
		findAllUserClouds:(context) => {
			axios.post(bp+'/clouds/get_cloudsUser').then(({data})=>{
				context.commit('allUserClouds',data);
			});
		},
		//获取权限：
		adminAll:(context) => {
			axios.post(bp+'/clouds/get_cloudsModule').then(({data})=>{
				context.commit('allAdminClouds',data);
			});
		},
		// 获取单个用户权限
		adminOne:(context,userId) =>{
			axios.post(bp+'/clouds/get_cloudsModule',qs.stringify(userId)).then(({data})=>{
				context.commit('oneAdminClouds',data);
			});
		},
		//queryKeys: 关键字查询
		findUserClouds:(context,tch) => {
			axios.post(bp+'/clouds/get_cloudsUser',qs.stringify(tch)).then(({data})=>{
				context.commit('allUserClouds',data);
			});
		},
		//queryTeach:查询后台分页中的老师
		queryUserClouds:(context,page) => {
			axios.post(bp+'/clouds/get_cloudsUser',qs.stringify(page)).then(({data})=>{
				context.commit('allUserClouds',data);
			});
		},
		//delete:
		deleteByIdUserClouds:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/clouds/delete_sysUser',qs.stringify(ids)).then((result)=>{
					context.dispatch('findAllUserClouds');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//批量删除
		batchDeleteByIdUserClouds:(context,teacherClouds) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/clouds/delete_sysUser',qs.stringify({user_ids:teacherClouds})).then((result)=>{
					context.dispatch('findAllUserClouds');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	},
}


//如果用户存在，输入框变红。

