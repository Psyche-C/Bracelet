import $ from 'jquery';
import configure from '../../store/configure.js';
let echarts = require('echarts');
var symbol = 'circle';
var symbolSize = 5;//线中点的大小
var legendSelected = {
  '班级平均心率':true,
  '男生平均心率':false,
  '女生平均心率':false,
};
var legendSelected2 = {};

export default {
  /*back(){
    $('#main').css('display','block');
    $('#main2').css('display','none');
    $('#main3').css('display','none');
    $('#main4').css('display','none');
    $('.button').css('display','block');
    $('.err').css('display','none');
  },*/
  backBegin(){
    this.form.rate = '班级心率实时曲线';
    this.ifBool(1);
  },
	tdClick(sid,name,no){
    $('#main').css('display','none');
    $('#main2').css('display','none');
    $('#main3').css('display','block');
    $('.button').css('display','block');
    this.stu_id = sid;//学生id
    this.stu_name = name;//被点击的学生姓名。
    this.stu_number = no;//学号
    this.course_name = '乒乓球';
  },
  rateB(){//处理实时心率数据
    this.move1B();
    this.move2B();
  },
  requestBegin(){   
    //请求班级心率：
    if(this.form.grade_id && this.form.class_id){
      this.reqClazzHeartBegin({class_id:this.form.class_id}).then(()=>{
      }).catch((error)=>{
        this.$notify({title:'失败',type:'error',message:'操作失败，该班没有设置班级心率!'});
      });
    }
    //全选触发：
    if(this.form.grade_id && this.form.class_id && this.form.course_type_id){
    //往本地保存当前课程类型：
      for(var i=0;i<this.courseBegin.length;i++){
        if(this.form.course_type_id == this.courseBegin[i].course_type_id){
          localStorage.setItem('course_type_name',this.courseBegin[i].course_type_name);
          this.course_type_name = this.courseBegin[i].course_type_name;
        }
      }
      for(var i=0;i<this.gradeBegin.length;i++){
        if(this.form.grade_id == this.gradeBegin[i].grade_id){
          this.grade_name = this.gradeBegin[i].grade_name;
        }
      }
      for(var i=0;i<this.clazzBegin.length;i++){
        if(this.form.class_id == this.clazzBegin[i].class_id){
          this.class_name = this.clazzBegin[i].class_name;
        }
      }
      if(this.slectData.length!=0){
        this.slectData[0].emit('user_close', "关闭之前的连接");
        this.slectData=[];
      }
      if(this.socket){
        this.socket.emit('user_close', "关闭之前的连接");
      }
    //请求实时所有数据：
      var vm = this;
      var school_prefix = sessionStorage.getItem('school_prefix');
    // 连接服务端
      var uid = school_prefix+'_'+this.form.grade_id+'_'+this.form.class_id+'_'+this.form.course_type_id;//学校_年级_班级_课程类型;
      console.log(uid)
      var socket = io(configure.ip+':'+configure.port);
      this.socket = socket;
      this.slectData[0]=this.socket;
    // 连接后登录
      socket.on('connect',function(){
        socket.emit('login',uid);
        //socket.emit('btn_start','开始');
      });
    //当用户点击左侧二级菜单的时候绑定事件，关闭连接
      var el = document.getElementsByClassName('el-menu');
      Array.prototype.slice.call(el,0).forEach(function(item){
        item.onclick=function(){
          vm.socket.emit('user_close',"关闭之前的连接");
        }
      });
    // 后端推送来在线数据时
      socket.on('update_online_count',function(online_stat){});
      this.socket.on('msg',function(msg){
        var s = msg.split('_')[0];
        if(s == 'end'){
          if(vm.endTitleFlag == 1){
            vm.$notify({type:'success',message:'上课时间到，已结束上课！'});
          }else{
            vm.endTitleFlag = 1;
          }
          //vm.bindOff();//当实时端自动结束上课后，前端也结束上课，隐藏备注上课内容，此时可以进行解绑操作。
          vm.hideRemark = true;
        }
      });
      this.socket.on('is_start',function(msg){
        if(msg == '1'){//正在上课。
          vm.beginOn = true;
          vm.hideRemark = false;//显示备注上课内容。
        }else if(msg == '0'){//不在上课。
          vm.beginOn = false;
          vm.hideRemark = true;
        }
      });
    // 后端推送来数据时
      socket.on('a1', function(msg){
        var data;
        data = eval('('+msg+')');       
        vm.start_time = data.start_time;
        console.log(data);
        console.log(data.init);
        console.log(vm);
        vm.abnormalBegin = JSON.stringify(data);//保存实时来的数据，为下载异常汇总做准备
        vm.arrxCB = timeToSeconds(objToArr(data.collection.time_stamp));
        vm.arry1CB = objToArr(data.collection.class_avg);
        vm.arry2CB = objToArr(data.collection.boy_avg);
        vm.arry3CB = objToArr(data.collection.girl_avg);
        vm.arrxPB = timeToSeconds(objToArr(data.collection.time_stamp));
        vm.arry1PB = objToArr(data.collection.class_avg);
        vm.arry2PB = objToArr(data.collection.personal[vm.stu_id]);
        vm.collectionB = data.init.number;
        vm.clazzHeartData = data.class_baseHeart[0];
        vm.listBegin = objToArr2(data.init.stu_info);
        vm.listBegin.forEach(function(item){
          let arr = [],len = +item.star;
          for(let g=0;g<len;g++){
            arr[g] = {k:g}
          }
          item.stars = arr;
        });
        vm.errBegin = [];//清空。
        vm.errBegin = objToArr2(data.abnormal);
        vm.errBegin.forEach(function(item){
          item.stu_gender = item.stu_gender == 0 ? '男' : '女';
          item.course_type_name = localStorage.getItem('course_type_name');
          var j=localStorage.getItem('lessonChangeArr');
          if(j){
             JSON.parse(j).forEach(function(it){
              if(it.stu_name==item.stu_name){
                item.course_id=it.course_id;
                item.course_name=it.course_name;
              }else{
                if(!item.course_id){
                  item.course_id='';
                  item.course_name='';
                }
              }
            });
          }else{
            item.course_id='';
            item.course_name='';
          }
          var t = (+item.start_time)*1000;
          var h = new Date(t).getHours();
          var m = new Date(t).getMinutes();
          var s = new Date(t).getSeconds();
          item.start_time = qq(h)+':'+qq(m)+':'+qq(s);
        });
        vm.rateB();
        styles(vm);
      });
    //对象转为数组：（曲线数据）
      function objToArr(obj){
        var arr = [];
        for(var i in obj){
          arr.push(obj[i]);
        }
        return arr;
      }
    //对象转为数组：（列表数据）
      function objToArr2(obj){
        var arr = [];
        for(var j in obj) {//j : 性别
          for(var z in obj[j]){//z：学生id
          //此处需要转换为数组后push进新数组即可:
            arr.push(obj[j][z]);
          }
        }
        return arr;
      }
    //时间戳提取时间：
      function timeToSeconds(timeArr){
        var arr = [];
        for(var i=0;i<timeArr.length;i++){
          var h = new Date(Number(timeArr[i])*1000).getHours();
          var m = new Date(Number(timeArr[i])*1000).getMinutes();
          var s = new Date(Number(timeArr[i])*1000).getSeconds();
          h = kk(h);
          m = qq(m);
          s = qq(s);
          arr.push(h+':'+m+':'+s);
        }
        return arr;
      }
    //补0：（分和秒）
      function qq(t){
        var t = ''+t;
        var s = '00';
        var a = s.slice(0,2-t.length)+t;
        return a;
      }
    //24进制转12进制：（小时）
      function kk(h){
        h = h>12 ? (h-12) : h;
        return h;
      }
    //分析异常学生，并突出其颜色：
      function styles(vm){
        //vm.errListBegin = [];//清空。
        var arr = vm.listBegin,arr2 = vm.rateBegin,arr3 = vm.errListBegin;
        for(var i=0;i<arr.length;i++){
          if(arr[i].conn != 0){//设备已连接。
            if(arr[i].abnormal_state == 2){//接近最高心率异常：
              $('.td').eq(i).css({'background':'#CC33CC',color:'white'});
              var obj = {
                stu_name:arr[i].stu_name,
                heart:arr[i].heartvalue,
                state:'接近最高心率',
              }
              arr3.push(obj);
            }else if(arr[i].abnormal_state == 3){//接近最低心率异常：
              $('.td').eq(i).css({'background':'#CC33CC',color:'white'});
              var obj = {
                stu_name:arr[i].stu_name,
                heart:arr[i].heartvalue,
                state:'接近最低心率',
              }
              arr3.push(obj);
            }else if(arr[i].abnormal_state == 1){//超过最高心率异常：
              $('.td').eq(i).css({'background':'#FA5555',color:'white'});
              var obj = {
                stu_name:arr[i].stu_name,
                heart:arr[i].heartvalue,
                state:'超过最高心率',
              }
              arr3.push(obj);
            }else if(arr[i].abnormal_state == 4){//低于最低心率异常：
              $('.td').eq(i).css({'background':'#FA5555',color:'white'});
              var obj = {
                stu_name:arr[i].stu_name,
                heart:arr[i].heartvalue,
                state:'低于最低心率',
              }
              arr3.push(obj);
            }else{
              $('.td').eq(i).css({'background':'#009900',color:'white'});
            }
            if(arr3.length>0){
              $('#music2')[0].play();//播放警报音乐。
            }
          }else if(arr[i].conn == 0){//设备未连接：
            $('.td').eq(i).css({'background':'#ccc',color:'white'});
            /*$('.maximum').eq(i).html('设备未连接');
            $('.minimum').eq(i).html('');
            $('.star').eq(i).html('');*/
            //arr[i].dongtai.max = '';
            //arr[i].dongtai.min = '';
            //arr[i].heartvalue = '';
            //arr[i].dongtai.avg = '';
            //arr[i].stars = [];//清空阶段心率五星标志。
            for(let k=0;k<arr[i].heartrate[2].length;k++){
              arr[i].heartrate[2][k] = '';
            }
            $('.td').eq(i).off();//解绑。
            /*$('.td').eq(i).on('click',function(){
              vm.$notify({
                title: '提示',
                message: '设备未连接，无法展示其心率曲线',
                type: 'info'
              });
            });*/
          }
        }
        setTimeout(function(){//延迟10ms，因为列表还未生成，需要延迟才能$('.flag').eq(j)。
          for(var j=0;j<arr3.length;j++){
            if(arr3[j].state == '接近最高心率'){
              $('.flag').eq(j).css('color','#CC33CC');
            }else if(arr3[j].state == '接近最低心率'){
              $('.flag').eq(j).css('color','#CC33CC');
            }else if(arr3[j].state == '超过最高心率'){
              $('.flag').eq(j).css('color','#FA5555');
            }else if(arr3[j].state == '低于最低心率'){
              $('.flag').eq(j).css('color','#FA5555');
            }
          }
        },10); 
      }
    }else{
      //this.$notify({title: '提示', message: '请选择年级、班级、工具箱和当前课程！', type: 'info'});
    }
  },
  //班级心率曲线：
  curvePicture(){
  	var colors = ['#67C23A','#EB9E05','#409EFF'];
    var myChart = echarts.init(document.getElementById('main'));
    var vm = this;
    function time(){//获取当前时间。
      var date = new Date();
      date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" &nbsp; "+repair(date.getHours())+':'+repair(date.getMinutes());
      return date;
    }
    function repair(n){//时间补0函数
      n = n + '';
      var str = '00';
      return str.slice(0,2-n.length)+n;
    }
    // 绘制图表
    function curve(){
      var option = {
        color: colors,
        title:{
          text:'班级心率实时曲线',
          left:'center',
          top:'20',
        //  subtext:'四年级  1班   体育课程',
          subtext:vm.grade_name+' '+vm.class_name+' '+vm.course_type_name,
          subtextStyle:{
            color:'#aaa',
            fontWeight:'bolder',
            align:'left'
          },
        },
        tooltip: {
          show:true,
          trigger:'axis',
          axisPointer:'shadow',
          snap:'snap',
          formatter: function(params){
            var date = time();
            var str = date + '<br/>'; 
            var ban = '班级平均心率：',nan = '男生平均心率：',nv = '女生平均心率：',t1 = '次/分钟<br/>',t2 = '次/分钟';
            if(params){
              str += hwj('',legendSelected,params,ban,nan,nv,t1,t2);
            }
            //var str = date + '<br/>' + '班级平均心率：' + params[0].value + '次/分钟<br/>' + '男生平均心率：' + params[1].value + '次/分钟<br/>' + '女生平均心率：' + params[2].value + '次/分钟';
            return str;
          },
          textStyle:{//文本样式。
            color:['white'],
          },
        },
        legend: {
          orient:'vertical',
          data:['班级平均心率','男生平均心率','女生平均心率'],
          selected:legendSelected,
          x:'right',
          top:40,
        },
        calculable : true,
        grid: {  //图表的内外边距
          top:140,
          bottom:25,
          left:60,
        },
        xAxis: [{  //X轴坐标参数
          name:'时间/秒',
          type: 'category',
          boundaryGap : false, //分界线范围
          data: vm.arrxCB,
          show: false,
        }],
        yAxis: [{
          name:'心率/次数',
          type: 'value',
          scale:true,
        }],
        series: [{
          name:'班级平均心率',
          smooth:true,//曲线平滑属性。
          //type:'scatter',//曲线类型（点状）
          type:'line',//曲线类型（线状）
          symbol:symbol,
          symbolSize:symbolSize,//曲线点的大小
          data: vm.arry1CB,
          markPoint : {
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type :'average', name:'平均值'}
            ]
          },
        },{    
          name:'男生平均心率',
          smooth:true,//曲线平滑属性。
          type:'line',
          symbol:symbol,
          symbolSize:symbolSize,
          data: vm.arry2CB,
          markPoint : {
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type :'average', name:'平均值'}
            ]
          },
        },{
          name:'女生平均心率',
          smooth:true,//曲线平滑属性。
          type:'line',
          symbol:symbol,
          symbolSize:symbolSize,
          data: vm.arry3CB,
          markPoint : {
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type :'average', name:'平均值'}
            ]
          },
        }],
      }
    //  myChart.clear();
      myChart.setOption(option);
      myChart.on('legendselectchanged',function(params){
        legendSelected = params.selected;
      });
    }
    return curve;
  },
//个人心率曲线：
  curvePicture2(){
  	var colors = ['#EB9E05','#409EFF'];
    var myChart = echarts.init(document.getElementById('main3'));
    var vm = this; 
    function time(){//获取当前时间。
      var date = new Date();
      date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" &nbsp; "+repair(date.getHours())+':'+repair(date.getMinutes());
      return date;
    }
    function repair(n){//时间补0函数
      n = n + '';
      var str = '00';
      return str.slice(0,2-n.length)+n;
    }
    // 绘制图表
    function curve(){
      var option = {
        color: colors,
        title:{
          text:'个人心率曲线',
          left:'center',
          top:'20',
          subtext:vm.stu_number+' '+vm.stu_name+' '+vm.course_name,
          subtextStyle:{
            color:'#aaa',
            fontWeight:'bolder',
            align:'left'
          },
        },
        tooltip: {
          show:true,
          trigger:'axis',
          axisPointer:'shadow',
          snap:'snap',
          formatter: function(params){
            var date = time();
            var str = date + '<br/>'; 
            var ban = '班级平均心率：',ge = '个人实时心率：',t1 = '次/分钟<br/>',t2 = '次/分钟';
            if(params){
              str += hwj2('',legendSelected2,params,ban,ge,t1,t2);
            }
            return str;
          },
          textStyle:{//文本样式。
            color:['white'],
          },
        },
        legend: {
          orient:'vertical',
          data:['班级平均心率','个人实时心率'],
          x:'right',
          top:40,
        },
        calculable : true,
        grid: {  //图表的内外边距
          top:120,
          bottom:25,
          left:60,
        },
        xAxis: [{  //X轴坐标参数
          name:'时间/秒',
          type: 'category',
          boundaryGap : false, //分界线范围
          data: vm.arrxPB,
          show: false,
        }],
        yAxis: [{
          name:'心率/次数',
          type: 'value',
          scale:true,
        }],
        series: [{
          name:'班级平均心率',
          smooth:true,//曲线平滑属性。
          type:'line',
          symbol:symbol,
          symbolSize:symbolSize,
          data: vm.arry1PB,
          markPoint : {
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type :'average', name:'平均值'}
            ]
          },
        },{    
          name:'个人实时心率',
          smooth:true,//曲线平滑属性。
          type:'line',
          symbol:symbol,
          symbolSize:symbolSize,
          data: vm.arry2PB,
          markPoint : {
            data : [
              {type : 'max', name: '最大值'},
              {type : 'min', name: '最小值'}
            ]
          },
          markLine : {
            data : [
              {type :'average', name:'平均值'}
            ]
          },
        }],
      }
    //  myChart.clear();
      myChart.setOption(option);
      myChart.on('legendselectchanged',function(params){
        legendSelected2 = params.selected;
      });
    }
    return curve;
  }
}

function hwj(str,legendSelected,params,ban,nan,nv,t1,t2){
  if(legendSelected['班级平均心率'] == true){
    if(legendSelected['男生平均心率'] == true){
      if(legendSelected['女生平均心率'] == true){
        str += ban+params[0].value+t1 + nan+params[1].value+t1 + nv+params[2].value+t2;
      }else{
        str += ban+params[0].value+t1 + nan+params[1].value+t2;
      }
    }else{
      if(legendSelected['女生平均心率'] == true){
        str += ban+params[0].value+t1 + nv+params[1].value+t2;
      }else{
        str += ban+params[0].value+t1;
      }
    }
  }else{
    if(legendSelected['男生平均心率'] == true){
      if(legendSelected['女生平均心率'] == true){
        str += nan+params[0].value+t1 + nv+params[1].value+t2;
      }else{
        str += nan+params[0].value+t2;
      }
    }else{
      if(legendSelected['女生平均心率'] == true){
        str += nv+params[0].value+t2;
      }else{
        str += "";
      }
    }
  }
  return str;
}
function hwj2(str,legendSelected2,params,ban,ge,t1,t2){
  if(legendSelected2['班级平均心率'] == true){
    if(legendSelected2['个人实时心率'] == true){
      str += ban+params[0].value+t1 + ge+params[1].value+t2;
    }else{
      str += ban+params[0].value+t2;
    }
  }else{
    if(legendSelected2['个人实时心率'] == true){
      str += ge+params[0].value+t2;
    }else{
      str += "";
    }
  }
  return str;
}