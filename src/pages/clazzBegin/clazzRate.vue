<!-- 开始上课 -->
<template>
  <div class="clazzRate">
  	<!--头部输入框-->
  	<el-row>
		  <el-col :span="4">
		  	<el-row>
		  		<el-form inline class='form' size='mini'>
	          <el-form-item>
              <el-select v-model="form.grade_id" placeholder="请选择年级" clearable @change='gradeChangeBegin(form.grade_id)'>
                <el-option v-for="item in gradeBegin" :label="item.grade_name" :value="item.grade_id" :key="item.grade_id">
                </el-option>
              </el-select>             
	          </el-form-item>
        	</el-form>
		  	</el-row>		  	
		  </el-col>
		  <el-col :span="4">
		  	<el-row>
		  		<el-form inline class='form' size='mini'>
		  			<el-form-item>
              <el-select v-model="form.class_id" placeholder="请选择班级" clearable @change='clazzchange'>
                <el-option v-for="item in clazzBegin" :label="item.class_name" :value="item.class_id" :key="item.class_id">
                </el-option>
              </el-select> 
            </el-form-item>
        	</el-form>
        </el-row>
		  </el-col>
      <el-col :span="4">
        <el-row>
          <el-form inline class='form' size='mini'>
            <el-form-item>
              <el-select v-model="form.course_type_id" clearable placeholder="请选择当前课程" @change='courseTypechange'>
                <el-option v-for="item in courseBegin" :label="item.course_type_name" :value="item.course_type_id" :key="item.course_type_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-row>
      </el-col>
		  <el-col :span="4"  v-if='user_type != 2'>
		  	<el-row>
		  		<el-form inline class='form' size='mini'>
	          <el-form-item>
              <el-select v-model="form.tools_id" placeholder="请选择工具箱" clearable>
                <el-option v-for="item in toolBegin" :label="item.tools_name" :value="item.tools_id" :key="item.tools_id" :hidden='item.tools_status == 4'>
                </el-option>
              </el-select>   
	          </el-form-item>
        	</el-form>
        </el-row>
		  </el-col>
		  <el-col :span="8" class='list2'>
          <el-row type='flex' justify='start' v-if='user_type !=2'>
            <el-col :span="6">
              <el-button type="primary" @click="startSession" size='small'>开始上课</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="endSession" size='small'>结束上课</el-button>
            </el-col>
            <el-col :span="6">
              <el-row type='flex' justify='start'>
                <el-button type="text" size='mini' @click="remarkBegin" class="btn3" :hidden='hideRemark'>备注上课内容</el-button>
              </el-row>
            </el-col>
          </el-row>
        <!-- </el-button-group> -->
		  </el-col>
		</el-row>
  <!--头部输入框结束--> 
  <!--主题部分开始-->
  	<el-row class="top">
      <el-col :span='19'>
        <el-row>
          <el-col :span='10' style='height:30px;'>
            <el-row>
              <el-col :span='8' class='font'>最高心率：{{clazzHeartData.max}}</el-col>
              <el-col :span='8' class='font'>最低心率：{{clazzHeartData.min}}</el-col>
              <el-col :span='8' class='font'>平均心率：{{clazzHeartData.avg}}</el-col>
            </el-row>
          </el-col>
          <el-col :span='10' class='font' style='height:30px;' v-if='!flagBegin'>
            <el-row>
              <el-col :span='8' v-for='item in rateBegin3' :key='item.name'>{{item.name}}：{{item.value}}</el-col>
            </el-row>
          </el-col>
          <el-col :span='10' class='font' style='height:30px;' v-if='flagBegin'>
            <marquee direction='left' behavior='alternate' scrolldelay='100' onmouseover='this.stop()' onmouseout='this.start()'>
              <el-col :span='24' class='font'>
                <span v-for='item in rateBegin3' :key='item.name'>
                  {{item.name}}：{{item.value}}
                  <b style='display:inline-block;width:10px;'></b>
                </span>
              </el-col>
            </marquee>
          </el-col>
          <el-col :span='4'>
            <el-row type='flex' justify='end'>
             <el-select v-model="form.rate" size='mini' placeholder="班级心率实时曲线" @change='changeBegin'>
                <el-option class="option1" label="班级心率实时曲线" value="班级心率实时曲线"></el-option>
                <el-option class="option2" label="班级心率实时列表" value="班级心率实时列表"></el-option>
             </el-select> 
            </el-row>             
          </el-col> 
        </el-row>
      </el-col> 
      <el-col :span='5'>
        <el-row type='flex' justify='end'>
          <el-button type="primary" size='mini' @click="backBegin" class="back" :hidden='hideBack'>返回</el-button>
        </el-row>
      </el-col>
    </el-row>
    <!--err start-->
    <el-row class="err">
	    <el-table :data="errBegin" border style="width:100%;" class='table3' height='380' stripe :header-row-style="rowClass" size='mini'>
	      <el-table-column prop="stu_number" label="学号" width="180" align='center'></el-table-column>
	      <el-table-column prop="stu_name" label="学生姓名" align='center'></el-table-column>
	      <el-table-column prop="stu_gender" label="性别" align='center'></el-table-column>
	      <el-table-column prop="state" label="异常状况" align='center'></el-table-column>
	      <el-table-column prop="start_time" label="异常开始时间" align='center'></el-table-column>
	      <el-table-column prop="duration" label="异常持续时间" align='center'></el-table-column>
	      <el-table-column prop="course_type_name" label="课程" align='center'></el-table-column>
	      <el-table-column prop="course_name" label="课程内容" align='center'></el-table-column>
	    </el-table>
    <!-- </div>	-->
    </el-row>
    <!--err end-->
    <el-row class="button">
    	<!--左边开始-->
      <el-col :span='19'>        
        <el-row class='content'>
          <div id="main" :style="{height:H2}" v-loading="loading2" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(96,96,96,0.3)"></div>
          <div id="main2" :style="{height:H2}">
          <!-- 班级列表 -->
          	<el-row id="rmove">
  	          <el-col :span='3' v-for='item in listBegin' :key='item.stu_id'>
                <!-- <el-tooltip> -->
    	            <div class='td' @click='tdClick(item.stu_id,item.stu_name,item.stu_number)'>
                    <div style='display:none;'>{{item.stu_id}}</div>
    	              <div>{{item.stu_name}}</div>
    	              <div>{{item.stu_number}}</div>
    	              <div style='color:#AA0000;'><i class="fa fa-heart"></i>{{item.heartvalue}}</div>
                    <div class='maximum'>最高 <span class='hwj'>{{item.dongtai.max}}</span></div>
                    <div class='minimum'>最低 <span class='hwj'>{{item.dongtai.min}}</span></div>
                    <div class='avgimum'>平均 <span class='hwj'>{{item.dongtai.avg}}</span></div>
                    <div class='star' style='color:#AA0000;'>
                      <i class='el-icon-star-off' v-for='j in item.stars' :key='j.k'></i>
                    </div>
  	              </div>
  	          </el-col>
  			    </el-row>
          </div>
          <!-- 个人曲线图 -->
          <div id="main3" :style="{height:H2}"></div>
        </el-row>
      </el-col>
      <!--左边结束-->
      <!--右边-->
      <el-col :span='5' class="right-el">
        <el-row type='flex' justify='end'>
          <el-col :span='22' class="right-col" :style="{height:H3}">
            <el-row>
		      		<el-col :span='10' :offset='1' class='errStudent'>异常学生</el-col>
		          <el-col :span='12'>
                <el-row type='flex' justify='end' class="right-row">
                  <a class='query' id="more" style="color:#448db8">查看更多</a>
                </el-row>
              </el-col>
		      	</el-row>
            <el-row class='errStu'>
              <el-col :span='24'>
                <el-row class='height flag' v-for='item in errListBegin' :key='item.stu_name'>
                  <el-col :span='7'>{{item.stu_name}}</el-col>
                  <el-col :span='6' style='color:red;'><i class="fa fa-heart"></i>&nbsp;{{item.heart}}</el-col>
                  <el-col :span='11'>{{item.state}}</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span='23' :offset='1' class='errStudent'>采集情况</el-col>
            </el-row>
            <el-row class='getInfo'>
              <el-col :span='24'>
                <el-row class='height'>
                  <el-col :span='12'>
                    <el-row type='flex' justify='end'>
                      班级人数：
                    </el-row>
                  </el-col>
                  <el-col :span='2'>&nbsp;</el-col>
                  <el-col :span='10'>{{collectionB.all}}人</el-col>
                </el-row>
                <el-row class='height'>
                  <el-col :span='12'>
                    <el-row type='flex' justify='end'>
                      成功采集人数：
                    </el-row>
                  </el-col>
                  <el-col :span='2'>&nbsp;</el-col>
                  <el-col :span='10'>{{collectionB.coll_nums}}人</el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col> 
        </el-row>
      </el-col>
    </el-row>      
  <!--主题部分结束-->
  <!--手环 -->
    <el-dialog :visible.sync="bindDialog.dialogBindVisible" 
      width='60%'>
      <div slot="title" class="dialog-title" align='center'>
        {{bindDialog.title}}
      </div>
      <div class="options">
        <el-button size='small' type="primary" @click="bindOn" :disabled='disabledBindOn'>一键绑定</el-button>
        <el-button size='small' type="primary" @click="bindOff" :disabled='disabledBindOff'>一键解绑</el-button>
      </div>
      <!-- 绑定列表 -->
      <el-table :data="bind" class='table2' stripe :header-row-style="rowClass" size='mini' border>
        <el-table-column align='center' type='index' label="序号" width="50"></el-table-column>
        <el-table-column prop="stu_number" label="学号" align='center'></el-table-column>
        <el-table-column prop="stu_name" label="姓名" align='center'> </el-table-column>
        <el-table-column prop="stu_gender" label="性别" align='center'></el-table-column>
        <el-table-column align='center' prop="handler_number" width="180" label="已绑定手环编号"></el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope='scope'>
            <i class="options fa fa-edit" @click="edits(scope.$index,scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleBind" size="mini">返 回</el-button>
      </div>
    </el-dialog>

    <!--备注上课内容 -->
    <el-dialog :visible.sync="remarkDialog.dialogRemarkVisible" center width='60%'>
      <div slot="title" class="dialog-title">
        {{remarkDialog.title}}
      </div>
      <!-- 绑定列表 -->
      <el-table height='300' :data="remark[0]" class='table2' stripe :header-row-style="rowClass" size='mini' border> 
        <el-table-column prop="stu_id" label="id" style="width:25%" v-if='false' align='center'></el-table-column>
        <el-table-column prop="stu_number" label="学号" style="width:25%" align='center'></el-table-column>
        <el-table-column prop="stu_name" label="学生姓名" style="width:25%" align='center'></el-table-column>
        <el-table-column label="上课内容" style="width:25%" align='center'>
          <template slot-scope='s'>
            <el-select size='mini' v-model="s.row.course_id" placeholder="请选择上课内容" @change='lessonChange(s.$index,s.row)'>
              <el-option v-for="item in remark[1]" :label="item.course_name" :value="item.course_id" :key="item.course_id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" style="text-align:right">
        <el-button type="primary" size='small' @click="remarkDialog.dialogRemarkVisible = false">取 消</el-button>
        <el-button type="primary" size='small' @click='saveRemark'>保存</el-button>
      </div>
    </el-dialog>
    <!-- 手环修改 -->
    <el-dialog :visible.sync="visible3">
      <div slot="title" class="dialog-title" align='center'>
        {{title3}}
      </div>
      <el-table :data="form3" class='table2' stripe :header-row-style="rowClass" size='mini' border>
        <el-table-column align='center' type='index' label="序号" width="50"></el-table-column>
        <el-table-column prop="stu_number" label="学号" align='center'></el-table-column>
        <el-table-column prop="handler_stu_id" label="id" align='center'></el-table-column>
        <el-table-column prop="stu_name" label="姓名" align='center'> </el-table-column>
        <el-table-column prop="stu_gender" label="性别" align='center'></el-table-column>
        <el-table-column align='center' prop="handler_number" width="180" label="已绑定手环编号"></el-table-column>
      </el-table>
      <el-table :data="noBind" class='table2' stripe :header-row-style="rowClass" size='mini' border @row-click='toggleSelection' @selection-change="handleSelectionChange" ref="table">
        <el-table-column align='center' type='selection' label="序号" width="50"></el-table-column>
        <el-table-column align='center' prop="handler_number" label="未绑定手环编号"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancles" size="mini">取 消</el-button>
        <el-button type="info" @click="submits()" class="yes" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 异常学生警报音乐 -->
    <audio :src="src" volume='0.5' id='music2'></audio>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
import $ from 'jquery';
let echarts = require('echarts');
require('echarts/lib/component/tooltip');
import curveMethods from './curve_methods.js';
import cg from '../../store/configure.js';
var bp = cg.bp;
var IP = cg.ip;
var PORT = cg.port;

export default {
  name: 'clazzRate',
  data(){
    return {
      title3:'手环编辑',
      // a:{},
      form3:[],
      visible3:false,
      multipleSelection:[],
      bindDialog:{
        title:'手环绑定',
        dialogBindVisible:false,
      },
      remarkDialog:{
        title:'备注上课内容',
        dialogRemarkVisible:false,
      },
      H2:0,
      H3:0,
      downloadBeginErrUrl:'',
      form:{rate:'班级心率实时曲线'},
      show_len:12,//曲线展示的长度（上多少数据）
      arrxCB:[],//班级横轴时间
      arry1CB:[],//班级纵轴班级平均心率
      arry2CB:[],//班级纵轴男生平均心率
      arry3CB:[],//班级纵轴女生平均心率
      arrxPB:[],//个人横轴时间
      arry1PB:[],//个人纵轴班级心率
      arry2PB:[],//个人纵轴个人心率
      collectionB:{},//采集情况
      listBegin:[],//学生列表
      clazzHeartData:[],//班级心率数据
      errBegin:[],//错误信息。
      errListBegin:[],//异常学生。
      stu_id:'',
      stu_name:'',
      stu_number:'',
      course_name:'',
      socket:'',
      grade_name:'',
      class_name:'',
      course_type_name:'',
      start_time:'',//用来明确备注上课内容中，学生不同时间的不同的课程内容。
      abnormalBegin:'',
      user_type:'',
      class_id:'',
      slectData:[],
      loading2: false,
      hideRemark:true,//点击开始上课之前，备注上课内容要隐藏。
      promptRepeat:'',//开始上课重复提示。
      promptEnd:'',//结束上课重复提示。
      hideBack:true,
      lessonChangeArr:[],//用来存放学生的课程内容。
      startTime:0,
      disabledBindOn:false,//标志一键绑定启用、禁用的状态。
      disabledBindOff:false,//标志一键解绑启用、禁用的状态。
      src:'',//警报音乐路径。
      beginOn:false,//标志开始上课的启用、禁用状态。
      bindFlag:1,
      endTitleFlag:1,//标志结束上课的提示。
    }
  },
  watch:{
    form:{
      handler(curVal,oldVal){
        //socket连接
        this.requestBegin();      
　　　},
　　　deep:true,
    }
  },
  created(){
    this.findAllClazzBegin();
    this.H2 = $(window).height() - 245 + 'px';
    this.H3 = $(window).height() - 227 + 'px';
    this.user_type = sessionStorage.getItem('user_type');
    this.token = sessionStorage.getItem('token');
    this.downloadBeginErrUrl = bp+'/Report/show_headInfo?token='+this.token;
    this.requestBegin();
    this.startTime = Date.parse(new Date())/1000;
    // this.src = 'http://ydown.smzy.com/yinpin/2014-10/smzy_2014102004.mp3';
    this.src = '../../../../src/assets/1.mp3';
  },
  computed:{
    ...mapGetters(['clazzBegin','gradeBegin','toolBegin','courseBegin','rateBegin2','rateBegin3','bind','remark','noBind','flagBegin']),
  },
	mounted(){
    var uid=sessionStorage.getItem('uid');
    var socket = io(cg.ip+':'+cg.port);
    // 连接后登录
    socket.on('connect', function(){
      socket.emit('user_close', "关闭之前的连接");
    });
		this.rateB();
    this.ifBool(1);
    var vm2 = this;
    $('.content').height(this.H-60-48-103-25+'px');
    //点击查看更多异常：
		$('#more').click(function(){
    	$('#main').css('display','none');
      $('#main2').css('display','none');
      $('#main3').css('display','none');
      $('#main4').css('display','block');
      $('.button').css('display','none');
      $('.err').css('display','block');
      vm2.hideBack = false;
		});
	},
  methods:{
    ...curveMethods,
    edits(i,row){
      // console.log(row.stu_name);
      this.visible3=true;
      this.title3='手环修改';
      this.form3 = [];//清空
      this.form3[0]=row;
      // console.log(this.form3[0].handler_stu_id);
      this.reqBeginChange({tools_id:this.form.tools_id}).then().catch((error)=>{
        this.$notify({title:'失败',type:'error',message:'操作失败'});
      });
    },
    cancles(){this.visible3=false;},
    cancleBind(){this.bindDialog.dialogBindVisible=false;},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if(this.multipleSelection.length>1){
         this.$notify({title:'失败',type:'error',message:'只能选择一个，请重新选择'});
      }else{
        if(val.length== 1){
          this.form3[0].handler_number = val[0].handler_number;
        }
      } 
    },
    submits(){//手环修改提交
      this.visible3=false;
      // console.log(this.form3.handler_stu_id);
      var obj={
        handler_stu_id:this.form3[0].handler_stu_id,
        handler_id:this.multipleSelection[0].handler_id,
      };
      this.updateBind(obj).then((result)=>{
        if(result.data.code == 200){
          this.$notify({title:'成功',message:'修改内容保存成功',type:'success'});
        }else{
          console.log('修改内容保存失败！后台返回状态码：'+result.data.code);
        }
      }).catch((error)=>{
          this.$notify({title:'失败',type:'error',message:error});
      });
    },
    toggleSelection(row,event,column){
    // 切换选中状态
      this.$refs.table.toggleRowSelection(row);
    },
    clazzchange(){
      if(this.form.class_id){
        this.requestCourse({grade_id:this.form.grade_id,class_id:this.form.class_id});
        this.form.tools_id = '';
        this.reqToolBegin({class_id:this.form.class_id});
      }     
      if(this.form.grade_id && this.form.class_id && this.form.course_type_id){
        this.loading2=true;
        var vm=this;
        setTimeout(function(){
          vm.loading2=false;
        },2000);
      }
    },
    // 当前课程类型改变，请求工具箱
    courseTypechange(){
      this.form.tools_id = '';
      this.reqToolBegin({class_id:this.form.class_id});
    },
    gradeChangeBegin(gid){
      this.reqClazzBegin({grade_id:gid}).then(()=>{
        this.form.tools_id = '';
        // 重新获取工具箱
        this.reqToolBegin({class_id:this.form.class_id});
      }).catch((error)=>{
        this.$notify({title:'失败',type:'error',message:'操作失败'});
      });
      let vm = this; 
      this.form = {grade_id:vm.form.grade_id,course_type_id:vm.form.course_type_id,tools_id:vm.form.tools_id,class_id:''};//要这样写，以后才能再选上。
    },
  	changeBegin(){
  		var a = 1;
  		if(this.form.rate == '班级心率实时曲线'){
  			a = 1;
  		}else if(this.form.rate == '班级心率实时列表'){
  			a = 2;
  		}
    	this.ifBool(a);
  	},
    ifBool(a){ //控制显示
      if(a == 1){//返回的显示与隐藏
        this.hideBack = true;
      }else{
        this.hideBack = false;
      }
      if(a==1){
        $('#main2').css('display','none');
        $('#main3').css('display','none');
        $('#main4').css('display','none');
        $('#main').css('display','block');
        $('.button').css('display','block');
        $('.err').css('display','none');
        this.form.rate = '班级心率实时曲线';
      }else if(a==2){
        $('#main').css('display','none');
        $('#main3').css('display','none');
        $('#main4').css('display','none');
        $('#main2').css('display','block');
        $('.button').css('display','block');
        $('.err').css('display','none');
        this.form.rate = '班级心率实时列表';
      }
    },
    lessonChange(index,row){
      this.remark[1].forEach(function(item){
        if(item.course_id==row.course_id){
          row.course_name=item.course_name;
        }
      });
      this.lessonChangeArr.push(row);
    },
    //点击手环绑定：
    bindBegin(){
      var vm = this;
      if(this.form.class_id && this.form.tools_id && this.form.grade_id && this.form.course_type_id){
        //查询所有的手环绑定信息
        this.findAllBindAsync({class_id:this.form.class_id,tools_id:this.form.tools_id}).then(()=>{
        //模态框显示
          vm.bindDialog.dialogBindVisible = true;
          if(vm.beginOn == false){//如果未开始上课。
            if(vm.bind.length > 0){
              vm.disabledBindOn = true;
              vm.disabledBindOff = false; 
            }else{
              vm.disabledBindOn = false;
              vm.disabledBindOff = true;
            }
          }else{//如果已经开始上课，则严禁再点击一键解绑，当然一键绑定也不能点了。
            vm.disabledBindOn = true;
            vm.disabledBindOff = true;
          }
        });
      }else{
        this.$notify({type:'warning',message:'请选择年级、班级、工具箱和当前课程！'});
      }
    },
    bindOn(){//一键绑定
      if(this.form.class_id && this.form.tools_id){
        this.bind_hand(this.form).then((result)=>{
          if(result.data.code == 200){
            this.findAllBind({class_id:this.form.class_id,tools_id:this.form.class_id}).then(()=>{
              if(this.bind.length<1){
                this.$notify({type:'warning',message:'该班级下暂无学生，请转到其他班级进行绑定！'});
                this.bindDialog.dialogBindVisible = false;
                this.form = {grade_id:this.form.grade_id,course_type_id:this.form.course_type_id,tools_id:this.form.tools_id,class_id:''};
              }else{
                this.disabledBindOn = true;
                this.disabledBindOff = false;
                this.$notify({type:'success',message:'手环绑定成功！'});
              }
            });
          }else if(result.data.code == 300){
            this.$notify({type:'warning',message:'手环数量不充足！'});
          }
        }).catch((error)=>{
          this.$notify({type:'error',message:error});
        });
      }else{
        this.$notify({type:'warning',message:'请选择年级、班级和工具箱！'});
      }
    },
    bindOff() {//一键解绑
      this.deleteBind({class_id:this.form.class_id}).then((result)=>{
        if(result.code == 200){
          this.findAllBind({class_id:this.form.class_id,tools_id:this.form.class_id}).then(()=>{//刷新
            this.disabledBindOn = false;
            this.disabledBindOff = true;
            if(this.bindFlag == 1){
              this.bindFlag = 0;
              this.$notify({type:'success',message:'手环已解除绑定！'});
            }else if(this.bindFlag == 0){
              this.bindFlag = 1;
            }
          });
        }else{
          this.$notify({type:'error',message:'解绑失败！'});
        }
      }).catch((error)=>{
        this.$notify({type:'error',message:error});
      });
    },
    //开始上课：
  	startSession(){
      //if(this.form.grade_id && this.form.class_id && this.form.tools_id && this.form.course_type_id && this.bind.length>0){
      if(this.form.grade_id && this.form.class_id && this.form.tools_id && this.form.course_type_id){
        this.bind_hand(this.form).then((result)=>{
          if(result.data.code == 200){
            this.findAllBind({class_id:this.form.class_id,tools_id:this.form.class_id}).then(()=>{
              aa.call(this);
            });
          }else if(result.data.code == 400){
            this.$notify({type:'error',message:'操作失败！'});
          }
        }).catch((error)=>{
          this.$notify({type:'error',message:error});
        });
        function aa(){
          this.hideRemark = false;//显示备注上课内容按钮，此时不能解绑。
          var time = Date.parse(new Date())/1000;
          var vm = this;
          if(time >= this.startTime+7){
          //开始获取
            this.socket.emit('btn_start','开始');
          }else{
            setTimeout(function(){
              vm.socket.emit('btn_start','开始');
            },vm.startTime+7-time);
          }
          /*this.$notify({title:'成功',message:'成功开始上课，正在接受收据',type:'success'});*/
          this.socket.on('msg',function(msg){//已经开始上课，无需重复点击。
            var s = msg.split('_')[0];
            if(s == 'info'){
              vm.promptRepeat = msg.split('_')[1];
              if(vm.promptRepeat == '您并未开始上课，无需结束上课'){
                vm.promptRepeat = '';
              }
            }
          });
          if(this.promptRepeat == ''){
            this.$notify({message:'请等待...',type:'info'});
          }else{
            this.$notify({message:this.promptRepeat,type:'info'});
            this.promptRepeat = '';//清空提示字段。
          }
        }
      }else{
        //this.$notify({message:'请先进行手环绑定！',type:'warning'});
        this.$notify({message:'请选择年级、班级、工具箱和课程！',type:'warning'});
      }  
    },  
    //结束上课：
    endSession(){
      if(this.socket){
        this.startTime = Date.parse(new Date())/1000;
        this.socket.emit('btn_end',"结束");//触发服务端结束采集数据。
        this.lessonChangeArr=[];
        localStorage.setItem('lessonChangeArr',this.lessonChangeArr);
        var vm = this;
        this.socket.on('msg',function(msg){//结束上课
          var s = msg.split('_')[0];
          if(s == 'end'){
            vm.promptEnd = msg.split('_')[1];
          }
        });
        if(this.hideRemark == false){
          if(this.promptEnd == ''){
            this.$notify({message:'请等待...',type:'info'});
          }else{
            this.$notify({message:this.promptEnd,type:'success'});
          //  this.promptEnd = '';
            this.endTitleFlag = 0;
          }
          //this.bindOff();//结束上课的同时，解除绑定。
          /*this.socket.on('connect', function(){
            this.socket.emit('user_close', "关闭之前的连接");
          });*/
        }else{
          this.$notify({message:'您未开始上课，无需结束上课！',type:'info'});
        }
        this.hideRemark = true;//隐藏备注上课内容按钮，此时可以解绑。
      }else{//没有生成uid
        this.$notify({message:'请选择年级、班级、工具箱、课程！',type:'warning'});
      }
    },
    //保存备注上课内容：
    saveRemark(){
      var self=this;
      var idStu = '';
      var idCourse = '';
      localStorage.setItem('lessonChangeArr',JSON.stringify(self.lessonChangeArr));
      this.remark[0].forEach(function(item,i,arr){
        if(i == arr.length-1){
          idStu += item.stu_id;
        }else{
          idStu += (item.stu_id+';');
        }
      });
      this.remark[0].forEach(function(item,i,arr){
        if(i == arr.length-1){
          idCourse += item.course_id;
        }else{
          idCourse += (item.course_id+';');
        }
      });
      var obj = {
        idStu:idStu,
        idCourse:idCourse,
        start_time:this.start_time,
      }
      this.saveRemarkBegin(obj).then((result)=>{
        if(result.data.code == 200){
          this.$notify({message:'备注上课内容保存成功',type:'success'});
          self.remarkDialog.dialogRemarkVisible = false;
        }else{
          console.log('备注上课内容保存失败！后台返回状态码：'+result.data.code);
        }
      }).catch((error)=>{
        console.log('备注上课内容保存操作失败，后台报错！'+error);
      });
    },  
    //点击备注上课内容
    remarkBegin(){//备注上课内容：
      var vm = this;
      this.form.start_time = this.start_time;
      if(this.form.class_id && this.form.course_type_id){
        this.findAllRemarkAsync(this.form).then(function(){
          vm.remarkDialog.dialogRemarkVisible = true;
        });
      }else{
        this.$notify({message:'请先选择年级、班级和课程类型！',type:'warning'});
      }
    },
    move1B(){
      var curve = this.curvePicture();
      curve();//预先执行。
    },
	  move2B(){
      var curve = this.curvePicture2();
      curve();//预先执行。
    },
		/*downloadBeginErr(){
      $('#submitBeginErr').trigger('click');//模拟点击隐藏表单。
    },*/
    rowClass(row, index) {
      return {"background-color":"#E6EBF5",'color':'#878D99'}
    },
    ...mapActions([
      'findAllClazzBegin',
      'findClazzBegin',
      'reqClazzBegin',
      'reqClazzHeartBegin',
      'reqToolBegin',
      'findAllBindAsync',
      'bind_hand',
      'findAllBind',
      'updateBind',
      'deleteBind',
      'findClazzBind',
      'findToolBind',
      'findGradeBind',
      'findAllRemark',
      'findAllRemarkAsync',
      'saveRemarkBegin',
      'reqBeginChange',
      'requestCourse',
    ]),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-button--primary {
    color: #fff;
    background-color: #448db8;
    border-color: #448db8;
  }
  .el-button--text {
    color: #448db8;
  }
  .errStudent{
    /* margin-left:18px; */
  }
  *{
    font-size:12px;
  }
  .form{
    height:44px;
  }
  .font{
    display:inline-block;
    line-height:30px;
  }
  .height{
    height:30px;
    line-height:30px;
    margin-left:10px;
  }
  .td{
    height:114px;
    margin-left:10px;
    text-align:center;
    padding:10px;
    margin:5px;
    cursor:pointer;
    background: #009900;
    color: white;
  }
  .td:hover{
    background: #00FF00;
    color: #555;
    margin:0;
    padding:15px;
    height:124px;
    font-weight:bold;
  }
  .td .hwj{
    /* display:inline-block;
    width:20px; */
  }
  .content{
    /* position: absolute; */
    border:1px solid #DFE4ED;
    margin-top: 10px;
    box-shadow:6px 6px 12px #ccc;
    padding:10px 0;
    /* width:74%; */
    /* height:450px; */
    overflow:auto;
    border-radius: 5px;
  }
  /* #main,#main2,#main3{
    height:500px;
  }
  .right-el{
    position: absolute;
    width:24%;
    left:75%;
  } */
  .rowErr .el-col{
    font-size: 14px;
    height:38px;
    line-height:38px;
    color: #ffffff;
  }
  .right-col{
    margin-top:10px;
    border-radius: 5px;
    /* height:415px; */
    background: #E6EBF5;
    box-shadow:4px 4px 6px #ccc;
  }
  .right-col>.el-row{
    margin-top:10px;
  }
  .right-row{
    height: 10%;
    margin-bottom:-3%;
  }
  .errStu{
    height:45%;
    background: #f2f2f2;
    overflow:auto;
  }
  .getInfo{
    height:40%;
    background: #f2f2f2;
    margin-top:2%;
  }
  .query{
    color:#409EFF;
  }
  .query:hover{
    text-decoration:underline;
    color:#FA5555;
    cursor:pointer;
  }
  .table3{
    margin-top: 10px;
    border-radius: 5px;
  }
	.el-select{
    width:100%;
  }
  .title{
  	font-size:20px;
  	margin-top:20px;
  }
  .download{
    margin-top: 7px;
    border:none;
    background: #448db8;
  }
  .btn{
    background: #67C23A;
    border:none;
  }
  .btn1{
    background: #EB9E05;
    border:none;
  }
  .btn2{
    background: #409EFF;
    border:none;
  }
  /*.btn3{
    background:#67C23A;
    border:none
  }*/
  .fill{
    background: #E6EBF5;
    height:28px;
    line-height:30px;
    text-align: center;
    border-radius: 5px;
    color: #FA5555;
  }
  .clazzRate .options{
    margin-top:-10px;
    margin-bottom:10px;
    text-align: right;
  }
  .yes{
    background: #448db8;
    border:none;
   /* margin-right: 10px;*/
  }
  /*.no{
    margin-right: 10px;
     border:none;
    float: right;
  }*/
</style>
<style>
   /*模态框样式*/
  .dialog-title {
    background-color: #448db8;
    height: 52px;
    line-height: 52px;
    font-size: 18px;
    color: #FFF;
  }
  .el-dialog__headerbtn i.el-dialog__close {
    color: #FFF;
  }
  div.el-dialog__header {
    padding: 0;
  }
  div.el-dialog--center .el-dialog__header {
    padding-top: 0
  }
</style>
