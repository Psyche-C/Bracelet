import axios from '../axios';
import qs from 'querystring';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		tools:[],//工具箱表格展示数据  el-transfer不兼容状态管理机制。
		circleData:[],//所有未绑定的工具箱
		//bindCircleData:[],//所有已绑定的手环
		//bindCircleAllData:[],//所有未绑定和已绑定的手环
	},
	getters:{
		tools:state => state.tools,
		circleData:state => state.circleData,
		//bindCircleData:state => state.bindCircleData,
		//bindCircleAllData:state => state.bindCircleAllData,
	},
	mutations:{
		allTool:(state,val) => {
			val.forEach(function(item,index){
				if(item.tools_status == 1){
					item.tools_status = '启用'
				}else if(item.tools_status == 2){
					item.tools_status = '禁用';
				}else if(item.tools_status == 4){
					item.tools_status = '正在使用';
				}
			});
			state.tools = val;
		},
		allCircleData:(state,val) => {
			state.circleData = val;
		},
		allCirclesOfTool:(state,val) => {
			/*state.bindCircleData = [];
			state.bindCircleAllData = [];
			if(val[0]){
				val[0].forEach(function(item){
					state.bindCircleData.push(+item.handler_id);
				});
			}
			if(val[1]){
				val[1].forEach(function(item){
					var o = {
						key: +item.handler_id,
						label: item.handler_number,
					}
					state.bindCircleAllData.push(o);
				});
				val[0].forEach(function(item){
					var o = {
						key: +item.handler_id,
						label: item.handler_number,
					}
					state.bindCircleAllData.push(o);
				});
			}*/
		}
	},
	actions:{
		saveTool:(context,form) => {
			return new Promise((resolve,reject)=>{
			//add:
				if(form.tools_id==undefined){//如果id不存在，执行添加。
					axios.post(bp+'/manager/add_tools',qs.stringify(form)).then((result)=>{
						context.dispatch('findAllTool');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
			//update:
				}else{  //否则执行修改。
					axios.post(bp+'/manager/update_tools',qs.stringify(form)).then((result)=>{
						context.dispatch('findAllTool');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
				}
			});
		},
		//find:
		findAllTool:(context) => {
			axios.post(bp+'/manager/show_tools').then(({data})=>{
				context.commit('allTool',data);
			});
		},
		//queryKeys:
		findTool:(context,Tool) => {
			axios.post(bp+'/manager/show_tools',qs.stringify(Tool)).then(({data})=>{
				context.commit('allTool',data);
			});
		},
		reqCirclesOfTool:(context,form) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/show_useHandler',qs.stringify(form)).then(({data})=>{
					context.commit('allCirclesOfTool',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//delete:
		deleteByIdTool:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/delete_tools',qs.stringify(ids)).then((result)=>{
					context.dispatch('findAllTool');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//请求所有未绑定的手环
		reqCircleData:(context) => {
			axios.post(bp+'/manager/show_useHandler').then(({data})=>{
				context.commit('allCircleData',data);
			});
		},
		//保存手环与工具箱的绑定
		saveBindCircle:(context,form) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/toolsHandler_bind',qs.stringify(form)).then((result)=>{
					context.dispatch('reqCircleData');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	}
}


