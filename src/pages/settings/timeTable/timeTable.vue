<!-- 课表管理 -->
<template>
  <div class="timeTable">
    <!-- <el-row>
      <el-col :span='12'></el-col>
      <el-col :span='12'>
        <el-row type='flex' justify='end'>
          
        </el-row>
      </el-col>
    </el-row> -->
    <!-- {{hh}} -->
    <el-row class='rowTop'>
      <el-form inline :data='form' size='mini'>
        <el-col :span='4'>
          <el-form-item label=''>
            <el-select clearable v-model="form.grade_id" placeholder="请选择年级">
              <el-option v-for="item in gradesTime" :label="item.grade_name" :key="item.grade_id" :value="item.grade_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label=''>
            <el-button type='info' size='small' @click='query' class="search">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span='8'>
          <el-row type='flex' justify='end'>
            <el-form-item label='' class='but'>
              <el-button type='info' size='small' @click='save2' class="save" v-if="flag==1">锁定</el-button>
              <el-button type='info' size='small' @click='edit' class="save" v-else-if="flag==0">编辑</el-button>
            </el-form-item>
          </el-row>
        </el-col>
      </el-form>
    </el-row>
    <el-table :data="clazzsTime" style="width:100%" class="table" border stripe :header-row-style="rowClass" size='mini' :height='height'>
      <el-table-column prop="id" label="id" v-if='false' align='center'></el-table-column>
      <el-table-column prop="class_id" label="班级_id" v-if='false' align='center'></el-table-column>
      <el-table-column prop="class_name" label="班级" align='center'></el-table-column>
      <el-table-column prop="subject" v-for="(item,index) in subject" :label="item.course_type_name" :key="item.course_type_id" :value="item.course_type_id" align='center'>
        <template slot-scope='scope'>
          <el-input v-model='hh[scope.$index][index]' :disabled="bo" @focus='select(hh[scope.$index][index],scope.$index,index)' class='hwj' size='mini' style='width:90%;'></el-input>
          <span style='display:none;'><a>{{scope.$index}}</a><b>{{index}}</b></span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="120">
        <template slot-scope='scope'>
          <i class="icon el-icon-edit" @click="edit2(scope.$index, scope.row)"></i>
          <i class="icon el-icon-delete" @click="delete2(scope.$index, scope.row)"></i>
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog :visible.sync="visible" center>
      <div slot="title" class="dialog-title">
        {{title}}
      </div>
      <el-checkbox-group v-model="form2" @change='changeTimeTable'>
        <span style='display:inline-block;width:120px;' v-for='tc in teachList'>
          <el-checkbox :label='tc.teach_name' :key='tc.teach_name' :value='tc.teach_id'></el-checkbox>
        </span>   
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle2" size='mini'>取 消</el-button>
        <el-button type="primary" @click="submit2" class="yes" size='mini'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
import $ from 'jquery';

export default {
  name: 'timeTable',
  data(){
    return {
      bo:true,
      flag:0,
      bool:true,
      height:0,
      visible:false,
      title:'选择教师',
      form:{grade_id:''},
      form2:[],
      teacherI:0,//hh的一维坐标，并可以凭此推算出班级的id
      teacherJ:0,//hh的二维坐标，并可以凭此推算出课程类型的id
    };
  },
  created(){
    this.findAllTimeTable().then((data)=>{
      let gid = sessionStorage.getItem('grade_id');
      if(!gid){
        gid = this.gradesTime[0].grade_id;//赋值
      }
      sessionStorage.setItem('grade_id',gid);
      this.findTimeTable({grade_id:gid});//模拟查询第一个年级。
    }).catch((error)=>{
      console.log(error);
    });
    this.height = $(window).height()-256;//应对于不同的分别率。
  },
  computed:{
    ...mapGetters(['gradesTime','clazzsTime','teach','teachList','subject','hh']),
  },
  mounted(){
    
  },
  methods:{
    edit(){
      this.flag = 1;
      this.bo = false;
    },
    select(teacherStr,i,j){
      this.visible=true;
      this.form2 = [];//清空
      if(teacherStr){
        this.form2 = teacherStr.split(',');
      }
      this.teacherI = i;
      this.teacherJ = j;
    },
    changeTimeTable(val){//当弹框中多选框的选中状态发生变化时，触发。
    /*  var str = '';
      for(var k=0;k<val.length;k++){
        if(k == val.length-1){
          str += val[k];
        }else{
          str += val[k]+'/';
        }
      }
      if(str!= ''){
        this.hh[this.teacherI][this.teacherJ] = str;
      }*/
    },
    save2(){//只给用户看而已，其实点击每个小框的时候已经请求了。
      this.flag = 0;
      this.bo = true;
      if(this.form2 == undefined){
        this.$notify({
          type: 'warning',
          message: '请先选择工具箱，再新增手环！',
        });
      }else{
          this.$notify({
          title:'成功',
          message: '保存成功！',
          type: 'success',
        });
      }
    },
    cancle2(){
      this.visible=false;
    },
    submit2(){
      //获取弹框中用户点击的教师id：
      var t_idArr = [];
      for(var i=0;i<this.form2.length;i++){
        for(var j=0;j<this.teachList.length;j++){
          if(this.form2[i] == this.teachList[j].teach_name){
            t_idArr.push(this.teachList[j].teach_id);
          }
        }
      }
      //为后端拼接：
      var teacher_id = '';
      for(var k=0;k<t_idArr.length;k++){
        if(k == t_idArr.length-1){
          teacher_id += t_idArr[k];
        }else{
          teacher_id += (t_idArr[k]+',');
        }
      }
      var obj = {};
      obj.teach_ids = teacher_id;
      obj.course_type_id = this.subject[this.teacherJ].course_type_id;
      obj.class_id = this.clazzsTime[this.teacherI].class_id;
      //alert(obj.teach_ids+'=='+obj.course_type_id+'=='+obj.class_id);
      var vm = this;
      var f = 0;
      this.saveTimeTable(obj).then((result)=>{
        if(result.data.code == 200){
          f = 1;
        }else{
          console.log('课表管理修改操作失败，后台返回状态码：'+result.data.code);
        }
        //异步后加载回到原页面，增加用户体验！
        var grade = sessionStorage.getItem('grade_id');
        setTimeout(function(){
          vm.findTimeTable({grade_id:grade}).then(()=>{
            if(f == 1){
              vm.$notify({title:'成功',type:'success',message:'操作成功'});
            }else{
              vm.$notify({type:'error',message:'操作失败'});
            }
          });
        },500);
      }).catch((error)=>{
        console.log('课表管理修改操作失败，后台报错！-->'+error);
      });
      this.visible = false;
      this.bool = false;
      /*setTimeout(function(){
        vm.findTimeTable({grade_id:vm.form.grade_id});//继续查询默认年级下的班级。
      });*/
    },
    rowClass(row, index) {
      return {"background-color":"#E6EBF5",'color':'#878D99'}
    },
    query(){
      if(this.form.grade_id){
        sessionStorage.removeItem('grade_id');
        sessionStorage.setItem('grade_id',this.form.grade_id);
        this.findTimeTable(this.form).then((result)=>{
          
        }).catch((error)=>{
          console.log('课表管理年级查询操作失败，后台报错！-->'+error);
        }); 
      }else{
        this.$notify({title:'警告',type:'warning',message:'请先选择年级'});
      }
    },
    ...mapActions(['findAllTimeTable','saveTimeTable','deleteByIdTimeTable','findTimeTable']),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    font-size:12px;
  }
  .icon {
    cursor: pointer;
    font-size: 20px;
  }
  /*.table{
    margin-top: 15px;
  }*/
  .rowTop{
    margin-bottom: 4px;
  }
  .rowTop .el-form .el-form-item{
    /* margin-top:-3px; */
    margin-bottom:8px;
  }
  .rowTop .but{
    margin-right:0;
    margin-left:8px;
  }
  .search{
    font-size:12px;
    background: #448db8;
    border:none;
  }
  .yes{
    font-size:12px;
    background: #448db8;
    border:none;
  }
  .save{
    font-size:12px;
    background: #448db8;
    border:none;
  }
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
  .dialog-footer{
    text-align:right;
  }

</style>

