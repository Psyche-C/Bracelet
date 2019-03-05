import axios from '../axios';
import qs from 'querystring';
import cg from '../configure.js';
var bp = cg.bp;
export default {
	state:{
		remark:[],
	},
	getters:{
		remark:state => state.remark,
	},
	mutations:{
		allRemark:(state,val) => {
			val[0].forEach(function(item){
				item.course_id = ''+item.course_id;//注意id是字符串类型的。
			});
			state.remark = val;
		},
	},
	actions:{
		//findAll:
		findAllRemark:(context,form) => {
			axios.post(bp+'/Report/show_remark',qs.stringify(form)).then(({data})=>{
				context.commit('allRemark',data);
			});
		},
		findAllRemarkAsync:(context,form) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/Report/show_remark',qs.stringify(form)).then(({data})=>{
					context.commit('allRemark',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		saveRemarkBegin:(context,form) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/Report/remarks_course',qs.stringify(form)).then((result)=>{
					resolve(result);
				});
			}).catch((error)=>{
				reject(error);
			});
		},
	}
}
