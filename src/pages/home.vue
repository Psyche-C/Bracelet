<template>
  <div class="home">
    <div class="jp-app-container">
      <div class="jp-home-header">
        <div class="logo">
          <div id='logoDiv' style='display:inline-block;'>
            <img :src="school_logo" alt="" id='homeLogo' width='54px' height='42px'>
          </div>
          <!-- <i class="fa fa-graduation-cap" style="font-size:42px"></i> -->
          <div id='homeDiv'>{{msg}}</div>
        </div>
        <div class="right">
          <ul class="userInfo">
            <li><i class="userInfoIcon fa fa-user-circle-o"></i></li>
            <li>{{power.user_account}}</li>
          </ul>
          <div class="logout" @click='quit'>
            退出
          </div>
        </div>
      </div>
      <div class="jp-home-body">
        <div class="jp-home-body-left">
          <el-header class='bodyHeader' height='48px'>
            <div class="head-left">
              <ul class="shortcuts" v-for="i in power.module_info">
                <li @click="downMenu" v-show="i.module_name=='班级监测'"><i class="fa fa-eye fa-fw"></i></li>
                <li @click="downMenu" v-show="i.module_name=='开始上课'"><i class="fa fa-bell-o "></i></li>
                <li @click="downMenu" v-show="i.module_name=='数据报表'"><i class="fa fa-line-chart"></i></li>
                <li @click="downMenu" v-show="i.module_name=='平台设置'"><i class="fa fa-cog"></i></li>
              </ul>
            </div>
          </el-header>
          <el-menu unique-opened router background-color="#f2f2f2" text-color="#737373"
            :default-active='flag' >
            <el-submenu v-for='i in power.module_info' :index='i.module_web_url' :key='i.module_web_url'>
              <template slot='title'><i :class='i.module_web_icon'></i>&nbsp;&nbsp;{{i.module_name}}</template>
              <el-menu-item  @click='routerName(i.module_name,j.module_name)' v-for='j in i.module_level2' :index='j.module_web_url' :key='j.module_web_url' :t='j.module_name'><i class='fa fa-angle-double-right'></i>&nbsp;&nbsp;{{j.module_name}}</el-menu-item>
            </el-submenu>
          </el-menu> 
        </div>
        <div class="jp-home-body-right">
          <el-header class='bodyHeader' height='48px'>
            <div class="head-right">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{firstRouter}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{secondRouter}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-header>
          <!-- 路由 -->
          <router-view id='router'></router-view>
        </div>
      </div>
      <!-- <div class="jp-home-footer">bottom</div> -->
  </div>
</div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
import $ from 'jquery';
import path from 'path';

export default {
  name: 'home',
  data () {
    return {
      msg: '学生实时心率监测系统',
      token:'',
      firstRouter:'',
      secondRouter:'',
      flag:'',
    }
  },
  created(){
  //一定要放在这否则token拿的是上次的。
    this.token = sessionStorage.getItem('token');
    let obj = {
    //  token:this.token,
      action:'index'
    }
    this.getPower(obj).then((data)=>{
      sessionStorage.setItem('user_type',data.user_type);
      sessionStorage.setItem('teach_id',data.user_id);
      if(data.user_type != 1){
      //查看单位信息，获取图标
        this.findAllUnit();
      }
      //真实登录要放开：
      if(data.code == 350){//如果token为空或token不正确
        this.$message({type:'error',message:'非法登录！请重新登录！'
        });
        this.$router.push('/login');
      }
      if(this.power.module_info == null){
        this.$notify({title:'提示',type:'warning',message:'该用户没有任何权限，请先请求管理员进行授权！',}); 
        var vm = this;
        setTimeout(function(){
          sessionStorage.removeItem('token');
          vm.$router.push('/login');
        },1000);
        
      }else{
      //默认页面（从后台的1级路由得到前端的2级路由）：
        var m = this.power.module_info;
        for(var i=0;i<m.length;i++){
          if(m[i].module_level2.length == 0){
            if(m[i].module_name == '班级监测'){
              var obj = {
                module_name:'班级心率实时曲线',
                module_web_url:'/clazzMonitor/clazzHeartRateCurves',
              }
              m[i].module_level2.push(obj);
            }else if(m[i].module_name == '开始上课'){
              var obj = {
                module_name:'班级心率实时曲线',
                module_web_url:'/clazzBegin/clazzHeartRateCurves',
              }
              m[i].module_level2.push(obj);
            }else if(m[i].module_name == '数据报表'){
              var temp = i;
              var vm = this;
              if(!$('.el-submenu').length){
                setTimeout(function(){
                  $('.el-submenu').eq(temp).click(function(){
                    vm.$notify({
                      title: '友情提示',
                      message: '该功能尚未开放，请访问别的页面！',
                      position: 'top-right',
                    });
                  });
                },2000);
              }else{
                $('.el-submenu').eq(temp).click(function(){
                  vm.$notify({
                    title: '友情提示',
                    message: '该功能尚未开放，请访问别的页面！',
                    position: 'top-right',
                  });
                });
              } 
            } 
          }
        }
        var n = m[m.length-1].module_level2;
        if(n[n.length-1]){//非空判断。
          var url = n[n.length-1].module_web_url;
          this.flag = url;//设置默认页。
          this.$router.push(this.flag);//加载最后一个页面的路由
        }
        //处理默认选中与默认路由跳转，根据用户身份选择用户的默认进入路由
        var path='/';
        var vm = this;
        switch(data.user_type){
          case '1':
            path = '/settings/usersClouds';
            vm.firstRouter = '平台设置';//设置右侧上部导航栏默认导航
            vm.secondRouter = '用户管理';
            break;
          case '2':
            path = '/clazzMonitor/clazzHeartRateCurves';
            vm.firstRouter = '班级监测';
            vm.secondRouter = '班级心率实时曲线';
            break;
          case '3':
            path = '/clazzBegin/clazzHeartRateCurves';
            vm.firstRouter = '开始上课';
            vm.secondRouter = '班级心率实时曲线';
            break;
        }
        //加载第一个页面的路由
        this.flag = path;
        //查看单位信息，获取图标
        this.$router.push(path);
      }
    }).catch((error)=>{
      var vm = this;
      sessionStorage.removeItem('token');
      vm.$notify({type:'error',message:'获取权限失败，请重新登录！'});
      setTimeout(function(){
        vm.$router.push('/login');
      },1000);
      console.log(error)
    });
  },
  computed:{
    ...mapGetters(['school_logo','power']),
  },
  methods:{
  /*同步相应的页面*/
    routerName(name1,name2){
      this.firstRouter = name1;
      this.secondRouter = name2;
    },
    downMenu(event){
      var icon;
      var target = $(event.target);
      if(target.children().length>0){  
        icon = $(target.children()[0]).prop("class").trim();
      }else{
        icon = target.prop("class").trim();
      }
      this.flag='';
      this.firstRouter ='';
      this.secondRouter = '';
      this.power.module_info.forEach((item)=>{
        if(item.module_level2.length==0){
          this.flag = item.module_web_url;
          // this.$router.push(this.flag);
          this.firstRouter = item.module_name;
        }
        //解决只有没有二级菜单的元素才弹出未开放的提示
        if(item.module_level2.length==0 && item.module_web_icon.trim()===icon){
          this.$notify({
            title: '友情提示',
            message: '该功能尚未开放，请访问别的页面！',
            position: 'top-right',
          });
        }
        if(item.module_level2.length!=0 && item.module_web_icon.trim()===icon){
          this.flag = item.module_level2[0].module_web_url;
          this.$router.push(this.flag);
          this.firstRouter = item.module_name;
          this.secondRouter = item.module_level2[0].module_name;
        }
      });
    },
  //登录退出：
    quit(){
    //  window.location.href = 'about:blank';//空白页的网址。
      this.$confirm('您确定要退出登录吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
        //  token:this.token,
          action:'logout'
        }
        this.loginOut(obj).then((result)=>{
          if(result.data.code == 350){//如果token为空或token不正确
            this.$notify({
              type: 'error',
              message: '非法登录！请重新登录！'
            });
          }else if(result.data.code == 200){
            this.$router.push('/blank/loading');//转到加载页。
            this.$router.push('/login');//登出到登录页。
            sessionStorage.removeItem('token');//同时清空token。
            sessionStorage.removeItem('school_prefix');//清空学校前缀
            sessionStorage.removeItem('user_type');//清空用户类型。
          }else if(result.data.code == 400){
            this.$notify({
              type: 'error',
              message: '登出失败！请检查网络！'
            });
          }else{
            console.log('登出失败！后台返回状态码：'+result.data.code);
          }
        }).catch((error)=>{
          console.log('登出操作失败，后台报错'+error);
        });
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消登出'
        });          
      });
    },
    ...mapActions(['findAllUnit','getPower','loginOut']),
  },
}
</script>

<style>
.el-submenu.is-active .el-submenu__title {
  border-bottom-color: #448db8;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*取消菜单栏右侧边框*/
  .el-menu {
    border-right: none;
  }
  .el-menu-item.is-active {
    color: #448db8;
  }
  *{
    margin: 0px;
    padding:0px;
  }
  #app{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .jp-home-header {
    background-color: #448db8;
  }
  .jp-home-header:after {
    content: "";
    display: block;
    clear: both;
  }
  .jp-home-header .logo {
    float: left;
    height: 60px;
    line-height: 64px;
    margin: auto 25px;
    color: #FFFFFF;
  }
  .jp-home-header .right{
    float: right;
  }
  .jp-home-header .right>*{
    float: left;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .jp-home-header .right:after{
    content: '';
    display: block;
    clear: both;
  }
  .jp-home-header .userInfo{
    width: 10em;
    background-color: #7daf6a;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
  .jp-home-header .userInfo > li {
    float: left;
    background-color: #7daf6a;
    color: #ffffff;
  }
  .jp-home-header .userInfo i.userInfoIcon{
    line-height: 60px;
    font-size: 40px;
  }
  .jp-home-header .userInfo>li:first-child{
    width: 4em;
    text-align: center;
  }
  .jp-home-header .right>div.logout{
    width: 5em;
    border-left: 1px solid #94d6ee;
    cursor: pointer;
    color: #ffffff;
  }
  .jp-home-body .bodyHeader{
    background-color: #f2f2f2;
    border-bottom: 1px solid #ccc;
  } 
  .jp-home-body-left {
    background-color: #f2f2f2;
    border-right: 1px solid #ccc;
    overflow-y:auto;
  }
  .jp-home-body-left > .bodyHeader > .head-left > .shortcuts > li{
    line-height: 42px;
    float: left;
    width: 42px;
    border-radius: 2px;
    margin: 2px;
    text-align: center;
    color: #FFF;
    cursor: pointer;
  }
  .jp-home-body-left > .bodyHeader> .head-left > .shortcuts > li:nth-child(1){
    background-color: #448db8;
  }
  .jp-home-body-left > .bodyHeader> .head-left > .shortcuts > li:nth-child(2){
    font-weight: bolder;
    background-color: #7daf6a;
  }
  .jp-home-body-left > .bodyHeader> .head-left > .shortcuts > li:nth-child(3){
    background-color: #EB9E05;
  }
  .jp-home-body-left > .bodyHeader> .head-left > .shortcuts > li:nth-child(4){
    background-color: #FA5555;
  }
  .jp-home-body-right {
    overflow:auto;
  }
  .jp-home-footer{
    background-color: #414141;
  }
  .jp-home-footer {
    color: #FFFFFF;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item{
    height:38px;
    line-height: 38px;
  }
  .el-breadcrumb {
    line-height: 48px;
    padding: 0 20px;
  }
  #logoDiv{
    display:inline-block;
    width:60px;
    height:60px;
  }
  #homeDiv{
    display:inline-block;
    height:60px;
    vertical-align:24px;
    font-size: 22px;
  }
  #homeLogo{
    vertical-align:10px;
  }
  #router{
    margin: 10px;
  }
</style>


