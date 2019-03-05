import axios from '../axios';
import qs from 'querystring';
import moment from 'moment';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		section:[],
	},
	getters:{
		section:state => state.section,
	},
	mutations:{
		allSection:(state,val) => {
			state.section = val;
		}
	},
	actions:{
		saveSection:(context,form) => {
			form.class_section_start = dateFormat(form.class_section_start);
			form.class_section_end = dateFormat(form.class_section_end);
			function dateFormat(time){//时间处理。
				if(time == undefined){
					time = '8:00:00';
				}else if(time){
					var str = moment(time).format('HH:mm:ss');//处理后时间是1:30-下午，不符合要求（13:30）。
					time = str;
				}
				return time;
			}
			return new Promise((resolve,reject)=>{
			//add:
				if(form.class_section_id==undefined){//如果id不存在，执行添加。
					axios.post(bp+'/manager/add_section',qs.stringify(form)).then((result)=>{
						context.dispatch('findAllSection');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
			//update:
				}else{  //否则执行修改。
					axios.post(bp+'/manager/update_section',qs.stringify(form)).then((result)=>{
						context.dispatch('findAllSection');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
				}
			});
		},
		//find:
		findAllSection:(context) => {
			axios.post(bp+'/manager/show_section').then(({data})=>{
				context.commit('allSection',data);
			}).catch(function(err){
				console.log('error:',err);
			});
		},
		//queryKeys:
		findSection:(context,section) => {
			axios.post(bp+'/manager/show_section',qs.stringify(section)).then(({data})=>{
				context.commit('allSection',data);
			});
		},
		//delete:
		deleteByIdSection:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/delete_section',qs.stringify(ids)).then((result)=>{
					context.dispatch('findAllSection');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	}
}


