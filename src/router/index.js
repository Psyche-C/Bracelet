import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home.vue'
import Login from '@/pages/login.vue'

import clazzBegin from '@/pages/clazzBegin/index'
//import clazzHeartRateList from '@/pages/clazzBegin/clazzList'
import clazzHeartRateCurves from '@/pages/clazzBegin/clazzRate'
//import exceptionsSummary from '@/pages/clazzBegin/err'
import remarksCourseContent from '@/pages/clazzBegin/remark'
//import personalHeartRateCurves from '@/pages/clazzBegin/singleHeartRate'
import bind from '@/pages/clazzBegin/bind'

import clazzMonitor from '@/pages/clazzMonitor/index'
//import clazzHeartRateList2 from '@/pages/clazzMonitor/clazzList'
//import clazzHeartRateCurves2 from '@/pages/clazzMonitor/clazzRate'
import clazzHeartRateCurves2 from '@/pages/clazzBegin/clazzRate'
//import exceptionsSummary2 from '@/pages/clazzMonitor/err'
import remarksCourseContent2 from '@/pages/clazzMonitor/remark'
//import personalHeartRateCurves2 from '@/pages/clazzMonitor/singleHeartRate'

import reports from '@/pages/reports/index'
import clazzReport from '@/pages/reports/data'
import exceptionReport from '@/pages/reports/err'
import clazzCurves from '@/pages/reports/curve'

import settings from '@/pages/settings/index.vue'
import users from '@/pages/settings/users'
import teacher from '@/pages/settings/users/teacher'
import student from '@/pages/settings/users/student'

import unit from '@/pages/settings/units'
import unitInfo from '@/pages/settings/units/unitInfo'
import courseSetting from '@/pages/settings/units/courseSetting'
import clazzSetting from '@/pages/settings/units/clazzSetting'
import gradeSetting from '@/pages/settings/units/gradeSetting'
import courseSection from '@/pages/settings/units/courseSection'

import unitsClouds from '@/pages/settings/unitsClouds'
import usersClouds from '@/pages/settings/usersClouds'

import tools from '@/pages/settings/tools'
import addTool from '@/pages/settings/tools/addTool'
import circleList from '@/pages/settings/tools/circleList'

import timeTable from '@/pages/settings/timeTable/timeTable'
import heartSetting from '@/pages/settings/heartSetting/heartRate'

import blank from '@/pages/blank/index';
import loading from '@/pages/blank/loading';

Vue.use(Router)

let router = new Router({
  routes: [
  	{
  		path:'/login',//登录
      component:Login,
  	},{
      path: '/',//主页
      name: 'Home',
      component: Home,
      // 1-设置
	    children:[{
	    	path: 'blank',
	    	name: 'blank',
	    	component: blank,
	    	children:[{
	    		path: 'loading',
		    	name: 'loading',
		    	component: loading,
	    	}],
	    },{
	      path: 'settings',
	      name: 'settings',
	      component: settings,
	      //1-1 单位管理
	      children:[{
		      path: 'units',
		      component: unit,
		      children:[{
		      	//1-1-1 单位信息
		      	path:'unitInfo',
		      	name:'unitInfo',
		      	component:unitInfo,
		      },{
		      	//1-1-2 课程设置
		      	path:'courseSetting',
		      	name:'courseSetting',
		      	component:courseSetting,
		      },{
		      	//1-1-3 班级设置
		      	path:'clazzSetting',
		      	name:'clazzSetting',
		      	component:clazzSetting,
		      },{
		      	//1-1-4 年级设置
		      	path:'gradeSetting',
		      	name:'gradeSetting',
		      	component:gradeSetting,
		      },{
		      	//1-1-5 上课节次
		      	path:'courseSection',
		      	name:'courseSection',
		      	component:courseSection,
		      }],
		    },{
		    	path: 'users',
		    	name: 'users',
		      component: users,
		      children:[{
		      	path:'teacher',
		      	component:teacher,
		      },{
		      	path:'student',
		      	component:student,
		      }]
		    },{
		    	path: 'usersClouds',
		      component: usersClouds,
		    },{
		    	path: 'unitsClouds',
		      component: unitsClouds,
		    },{
		    	path: 'tools',
		      component: tools,
		      children:[{
		      	path:'addTool',
		      	component:addTool,
		      },{
		      	path:'circleList',
		      	component:circleList,
		      }]
		    },{
		    	path: 'timeTable',
		      component: timeTable,
		    },{
		    	path: 'heartSetting',
		      component: heartSetting,
		    }],
		  },{
	    	path: 'clazzBegin',
	      component: clazzBegin,
	      children:[/*{
	      	path:'clazzHeartRateList',
	      	component:clazzHeartRateList,
	      },*/{
	      	path:'clazzHeartRateCurves',
	      	component:clazzHeartRateCurves,
	      },{
	      	path:'remarksCourseContent',
	      	component:remarksCourseContent,
	      }/*,{
	      	path:'exceptionsSummary',
	      	component:exceptionsSummary,
	      },{
	      	path:'personalHeartRateCurves',
	      	component:personalHeartRateCurves,
	      }*/,{
	      	path:'bind',
	      	component:bind,
	      }],
	    },{
	    	path: 'clazzMonitor',
	      component: clazzMonitor,
	      children:[/*{
	      	path:'clazzHeartRateList',
	      	component:clazzHeartRateList2,
	      },*/{
	      	path:'clazzHeartRateCurves',
	      	component:clazzHeartRateCurves2,
	      },/*{
	      	path:'exceptionsSummary',
	      	component:exceptionsSummary2,
	      },*/{
	      	path:'remarksCourseContent',
	      	component:remarksCourseContent2,
	      }/*,{
	      	path:'personalHeartRateCurves',
	      	component:personalHeartRateCurves2,
	      }*/],
	    },{
	    	path: 'reports',
	      component: reports,
	      children:[{
	      	path:'clazzReport',
	      	component:clazzReport,
	      },{
	      	path:'exceptionReport',
	      	component:exceptionReport,
	      },{
	      	path:'clazzCurves',
	      	component:clazzCurves,
	      }],
	    }],
    }
  ]
})

// 路由导航钩子
router.beforeEach((to, from, next) => {
	//console.log('~~~~~',to);

	next();
/*
	console.log('to',to);
	console.log('from',from);

	let token = sessionStorage.getItem('token');
	if (!token && to.path == '/login') {
      next();
      return false;
  };
  if(token){
  	// 登录，再进login自动跳走
    if (to.path == '/login') {
      router.push('/');
      return false;
    }
    next();
    return false;
  }
 */

   /*
    let user = sessionStorage.getItem('user');
    if ((!user && to.path == '/login') ||
        (to.meta && to.meta.noLoginRequired) ||
        to.fullPath.indexOf('/rc') !== -1) {
        next();
        return false;
    };
    if (user) {

        // 登录，再进login自动跳走
        if (to.path == '/login') {
            router.push('/');
            return false;
        }

        next();
        return false;
    } else {
        if (!user) {
            sessionStorage.removeItem('user');
            let res = $.ajax({
                url: ShiYue.base + '/api/uaa/oauth/me',
                type: 'get',
                async: false
            }).responseJSON;
            if (res && res.status == 200) {
                sessionStorage.setItem('user', JSON.stringify(res));
                location.reload();
                return false;
            }
        }
        router.push({
            name: 'login',
            params: {
                redirect: to.fullPath
            }
        });
        return false;
    }
    // to 和 from 都是 路由信息对象
    // to Route: 即将要进入的目标 路由对象
    // from: Route: 当前导航正要离开的路由
    // next: Function: 一定要调用该方法来 resolve 这个钩子。
    // next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
    // next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
    // next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
	*/
})



export default router;



