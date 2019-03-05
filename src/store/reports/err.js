import axios from '../axios';
import qs from 'querystring';
import moment from 'moment';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		gradeErr:[],
		clazzErr:[],
		courseErr:[],
		tableErr:[],
		errNum:{},
		pagesErr:0,//分页
		clazzOnLineErr:[],
		hideErr:false,
	},
	getters:{
		gradeErr:state => state.gradeErr,
		clazzErr:state => state.clazzErr,
		courseErr:state => state.courseErr,
		tableErr:state => state.tableErr,
		errNum:state => state.errNum,
		pagesErr:state => state.pagesErr,
		clazzOnLineErr:state => state.clazzOnLineErr,
		hideErr:state => state.hideErr,
	},
	mutations:{
		allErr:(state,val) => {
			state.gradeErr = val[0];
			state.courseErr = val[1];
		},
		allClazzErr:(state,val) => {
			state.clazzErr = val[0];
		},
		allTableErr:(state,val) => {
			console.log(val[1]);
			state.tableErr = [];
			if(val[1].length>0){//表格数据。
				val[1].forEach(function(item){
					item.stu_gender == 1 ? item.stu_gender = '男' : item.stu_gender = '女';
					if(item.course_name == null){
						item.course_name = '暂无数据';
					}
				});
				let k = 0,contents = [],startTimes = [],durations = [];
				state.tableErr = [];
				dd(0);
			//表格合并算法：
				function dd(n){
					for(var i=n;i<val[1].length;i++){
						if(i == n){
							contents=[{content:val[1][n].content}];//初始化
							startTimes=[{start_time:val[1][n].start_time}];
							durations=[{chixu:val[1][n].chixu}];
							if(i == val[1].length-1){//最后一行的特例。
								ff(k,i+1);
							}
						}else{
							if(val[1][i].stu_number == val[1][i-1].stu_number){
								contents.push({content:val[1][i].content});
								startTimes.push({start_time:val[1][i].start_time});
								durations.push({chixu:val[1][i].chixu});
								if(i == val[1].length-1){//如果一页中所有数据都一样。
									ff(k,i);
								}
							}else{
								if(i <= val[1].length-1){
									ff(k,i);//赋值。
									k++;
									dd(i);
									break;
								}
							} 
						}
					}
				}
				function ff(k,i){
					state.tableErr[k] = {}
					state.tableErr[k].stu_id = val[1][i-1].stu_id;
					state.tableErr[k].stu_number = val[1][i-1].stu_number;
					state.tableErr[k].stu_name = val[1][i-1].stu_name;
					state.tableErr[k].stu_gender = val[1][i-1].stu_gender;
					state.tableErr[k].contents = contents;
					state.tableErr[k].startTimes = startTimes;
					state.tableErr[k].durations = durations;
					state.tableErr[k].course_type_name = val[1][i-1].course_type_name;
					state.tableErr[k].course_name = val[1][i-1].course_name;
				}
			}
			state.pagesErr = (+val[0])*10;			
			state.errNum.total = val[2].total;
			state.errNum.stu_num = val[3].stu_num;
			if(state.pagesErr < 10){
				state.hideErr = true;
			}else{
				state.hideErr = false;
			}
		},
		allClazzOnLineErr:(state,val) => {
			state.clazzOnLineErr = val;
		}
	},
	actions:{
		//获取年级课程数据
		findAllErr:(context) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/report/show_headInfo').then(({data})=>{
					context.commit('allErr',data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//reqClazzErr:
		reqClazzErr:(context,form) => {
			console.log(2);
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/Report/show_class',qs.stringify(form)).then(({data})=>{
					context.commit('allClazzErr',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//ClazzOnLineErr:
		reqClazzOnLineErr:(context,form) => {
			console.log(3);
			if(form.class_start2){
				// form.class_start = Date.parse(form.class_start2)/1000;//转为时间戳。
				form.class_start = form.class_start2.getTime()/1000;
			}
			if(form.class_end2){
				// form.class_end = Date.parse(form.class_end2)/1000;
				form.class_end = (form.class_end2.getTime()+(24*60*60*1000))/1000
			}
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/Report/get_classOnline',qs.stringify(form)).then(({data})=>{
					console.log(data);
					context.commit('allClazzOnLineErr',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//queryErr:查分页
		queryErr:(context,form) => {
			if(form.class_start2){
				// form.class_start = Date.parse(form.class_start2)/1000;//转为时间戳。
				form.class_start = form.class_start2.getTime()/1000;
			}
			if(form.class_start){
				// form.class_end = Date.parse(form.class_end2)/1000;//为什么要用2个名字，因为如果你把vue绑定的值进行转换并除以1000，那么值是正确提交了，但提交完这数据还怎么显示？
				form.class_end = (form.class_end2.getTime()+(24*60*60*1000))/1000;
			}
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/Report/abnormal_report',qs.stringify(form)).then(({data})=>{
					context.commit('allTableErr',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//reqTableErr:
		reqTableErr:(context,form) => {
			if(form.class_start2){
				// form.class_start = Date.parse(form.class_start2)/1000;//转为时间戳。
				form.class_start = form.class_start2.getTime()/1000
			}
			if(form.class_end2){
				// form.class_end = Date.parse(form.class_end2)/1000;
				form.class_end = (form.class_end2.getTime()+(24*60*60*1000))/1000;
			}
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/Report/abnormal_report',qs.stringify(form)).then(({data})=>{
					context.commit('allTableErr',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	}
}


