/**
	axios的配置文件
	1、设置post数据格式为表单格式
	2、设置基路径
	3、序列化字符串
*/
import axios from 'axios';
import router from '../router';
import Vue from 'vue';
import path from 'path';
//配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//配置前后端数据交互的请求头：
axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//拦截请求：
axios.interceptors.request.use((config) => {
	let token = sessionStorage.getItem('token');
	let user_type = sessionStorage.getItem('user_type');
	if(user_type){//请求拦截验证。
		if(user_type == 3){//不该访问的不让你访问。
		//	let p = window.location.href.split('settings/')[1].split('/')[1];//这样写报错。
			let p = window.location.href.split('settings/')[1];
			if(p){
				p = p.split('/')[1];
				if(p){
					switch(p){
						case 'teacher' : //教师用户没有操作教师用户的权限，管理员才有，如果教师想通过手动改变网址的方式来访问，则强制退出。
						case 'unitInfo' : 
						case 'courseSetting' : 
						case 'gradeSetting' : 
						case 'courseSection' : 
							sw();break;
					}
				}
			}
		}
	}
	if(token){
		config.url+='?token='+token;//将所有异步请求拦截，统一为其拼上get方式的token。
	}
  return config;
}, (error) => {
    return Promise.reject(error);
});
//拦截响应：
axios.interceptors.response.use(
response => {
	if(response.data.code == '350'){//返回350，说明越权，清除token信息并跳转到登录页面
		sw();
	}
  return response;
},
error => {
  if (error.response) {
  	return Promise.reject(error.response.data) //返回接口返回的错误信息
  }
});
function sw(){//越权访问，清除token信息并跳转到登录页面
//	window.history.go(-1);//返回上一页。
	new Vue().$notify({title:'警告',message:'请不要越权访问！'}); 
	window.location.reload();//刷新。
	sessionStorage.removeItem('token');//清除token。
  router.replace({path:'/login',});//跳转至登录页。
}
export default axios;



/*function sw(){//越权访问，清除token信息并跳转到登录页面
	window.location.reload();//刷新。
	sessionStorage.removeItem('token');//清除token。
  router.replace({//跳转至登录页。
    path: '/login',
  });
}*/