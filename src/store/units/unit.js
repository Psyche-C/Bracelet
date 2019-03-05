import axios from '../axios';
import qs from 'querystring';
import cg from '../configure.js';
var bp = cg.bp;

export default {
	state:{
		unit:[],
		schoolYear:[],
		school_logo:'',//网站logo的图标。
	},
	getters:{
		unit:state => state.unit,
		schoolYear:state => state.schoolYear,
		school_logo:state => state.school_logo,
	},
	mutations:{
		allUnit:(state,val) => {
		//默认：
	    var year1 = new Date().toLocaleString().split('/')[0];//取得年份。
	    state.schoolYear = getTime(year1);
	  //后台学年数据为空：
      if(val.school_year){
        if(val.school_year.length == 9){//如果非空，根据值进行更改。
          var year2 = val.school_year.split('-')[1];//取得年份。
          state.schoolYear = getTime(year2);
        }else if(val.school_year == 1111){//如果为1111，则表示为空。
          val.school_year = '';
        }
      }
	    function getTime(year){
	      var year = +year;
	      var arr = [];//清空数组。
	      var obj1 = {
	        school_year:''+year+'-'+(year+1),
	      }
	      var obj2 = {
	        school_year:''+(year-1)+'-'+year,
	      }
	      arr.push(obj1);
	      arr.push(obj2);
	      return arr;
	    }
			state.unit = val;
			state.school_logo = 'http://'+val.school_logo;
		}
	},
	actions:{
		saveUnit:(context,form) => {
		//update:
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/update_unit',qs.stringify(form)).then((result)=>{
					context.dispatch('findAllUnit');//刷新。
					resolve(result);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//find:
		findAllUnit:(context) => {
			return new Promise((resolve,reject)=>{
				axios.post(bp+'/manager/show_unit').then(({data})=>{
					context.commit('allUnit',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	},
}
