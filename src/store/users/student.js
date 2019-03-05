import axios from '../axios';
import qs from 'querystring';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		student:[],
		gradeStudent:[],
		classStudent:[],
		pagesStu:0,//学生分页
		hideStu:false,//分页显示状态。
		rateStu:[],
	},
	getters:{
		student:state => state.student,
		gradeStudent:state => state.gradeStudent,
		classStudent:state => state.classStudent,
		pagesStu:state => state.pagesStu,
		hideStu:state => state.hideStu,
		rateStu:state => state.rateStu,
	},
	mutations:{
		allStu:(state,val) => {
			val[1].forEach(function(item,index){
				item.stu_gender == 1 ? item.stu_gender = '女' : item.stu_gender = '男';
				item.stu_status == 1 ? item.stu_status = '启用' : item.stu_status = '禁用';
				let arr = item.rate.split(',');
				for(var k=0;k<arr.length;k++){//为心率值绑定属性名。
					item['rate'+k] = arr[k];
				}
			});
			state.student = val[1];
			state.gradeStudent = val[0];
			state.pagesStu = (+val[2])*10;
			if(state.pagesStu < 10){
				state.hideStu = true;
			}else{
				state.hideStu = false;
			}
		},
		gradeStu:(state,val) => {
			state.classStudent = val;
		},
		allRateNameStu:(state,val) => {//为心率设置属性名。
			state.rateStu = [];
			for(var i=0;i<val.length;i++){
				let name = val[i].heartrate_name;
				let prop = 'rate'+i;
				let obj = {
					name : name,
					prop : prop,
				}
				state.rateStu.push(obj);
			}
		}
	},
	actions:{
		saveStu:(context,form) => {
			return new Promise((resolve,reject)=>{
			//add:
				if(form.stu_id==undefined){//如果id不存在，执行添加。
					axios.post(bp+'/manager/add_student',qs.stringify(form)).then((result)=>{
						// context.dispatch('findAllStu');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
			//update:
				}else{  //否则执行修改。
					axios.post(bp+'/manager/update_student',qs.stringify(form)).then((result)=>{
						// context.dispatch('findAllStu');//刷新。
						resolve(result);
					}).catch((error)=>{
						reject(error);
					});
				}
			});
		},
		//findRateNameStu:
		findRateNameStu:(context) => {
			axios.post(bp+'/manager/get_rateName').then(({data})=>{
				context.commit('allRateNameStu',data);
			});
		},
		//find:
		findAllStu:(context) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/show_student').then(({data})=>{
					context.commit('allStu',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//queryKeys:
		findStu:(context,stu) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/show_student',qs.stringify(stu)).then(({data})=>{
					context.commit('allStu',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	//请求班级：
		findClassStudent:(context,gid) => {
			axios.post(bp+'/manager/show_classinfo',qs.stringify(gid)).then(({data})=>{
				context.commit('gradeStu',data);
			});
		},
		/*gradeAndClass:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/delete_student',qs.stringify(ids)).then((result)=>{
					context.dispatch('findAllStu');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},*/
		//delete:
		deleteByIdStu:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/delete_student',qs.stringify(ids)).then((result)=>{
					// context.dispatch('findAllStu');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		batchDeleteByIdStu:(context,ids) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/batchDelete_stu',qs.stringify(ids)).then((result)=>{
					// context.dispatch('findAllTch');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	//下载学生表：
		/*downLoadStuTable:(context) => {
			axios.post(bp+'/manager/show_student',qs.stringify({dowload_stuInfo:1})).then(()=>{});
		},*/
	}
}


//年级、班级需要数据，我这边只是不展示。