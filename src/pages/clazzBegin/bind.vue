<!-- 手环绑定页面 -->
<template>
  <div class="err">
  	<el-row class="row">
		  <el-col :span="4">
		  	<el-row>
		  		<el-form inline class='form'>
	          <el-form-item class="select">
              <el-select size='mini' v-model="form.grade_id" placeholder="请选择年级" @change='reqClazzBind(form.grade_id)'>
                <el-option v-for="item in gradeBind" :label="item.grade_name" :value="item.grade_id" :key="item.grade_id">
                </el-option>
              </el-select>             
	          </el-form-item>
        	</el-form>
		  	</el-row>		  	
		  </el-col>
		  <el-col :span="4">
		  	<el-row>
		  		<el-form inline class='form'>
		  			<el-form-item class="select" >
              <el-select size='mini' v-model="form.class_id" placeholder="请选择班级" @change='reqBind(form.class_id)'>
                <el-option v-for="item in clazzBind" :label="item.class_name" :value="item.class_id" :key="item.class_id">
                </el-option>
              </el-select> 
            </el-form-item>
        	</el-form>
        </el-row>
		  </el-col>
		  <el-col :span="4">
		  	<el-row>
		  		<el-form inline class='form'>
	          <el-form-item class="select" >
              <el-select size='mini' v-model="form.tools_id" placeholder="请选择工具箱">
                <el-option v-for="item in toolsBind" :label="item.tools_name" :value="item.tools_id" :key="item.tools_id" :disabled='item.toolstatus=="4"||item.toolstatus=="2"'></el-option>
              </el-select>
	          </el-form-item>
        	</el-form>
        </el-row>
		  </el-col>
      <el-col :span="7" :offset="5">
        <el-row type='flex' justify='end'>
          <el-button size='small' type="primary" @click="bindOn">一键绑定</el-button>
          <el-button size='small' type="primary" @click="bindOff">一键解绑</el-button>
          <el-button type="primary" size='small' @click='retu'>返回</el-button>            
        </el-row>
      </el-col>
		</el-row>
    <el-table :data="bind" class='table2' stripe :header-row-style="rowClass" size='mini' border>
      <el-table-column type='index' label="序号" width="180"></el-table-column>
      <el-table-column prop="stu_number" label="学号" width="180"></el-table-column>
      <el-table-column prop="stu_name" label="姓名"></el-table-column>
      <el-table-column prop="stu_gender" label="性别"></el-table-column>
      <el-table-column prop="handler_number" label="已绑定手环编号"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';

export default {
  name: 'err',
  data(){
    return {
      // fw:'120px',
      // title2:'修改手环绑定',
      // visible2:false,
      // form2:{},
      form:{},
    }
  },
  created(){
    this.findToolBind();
    this.findGradeBind();
  },
  computed:{
    ...mapGetters(['clazzBind','gradeBind','toolsBind','bind']),
  },
  methods:{
  //请求班级：
    reqClazzBind(gid){
      this.form.class_id='';
      this.findClazzBind({grade_id:gid}).then(()=>{

      }).catch((error)=>{
        console.log('开始上课手环绑定请求班级操作失败，后台报错！'+error);
      });
    },
    reqBind(cid){
      this.findAllBind({class_id:cid}).then(()=>{

      }).catch((error)=>{
        console.log('开始上课手环绑定操作失败，后台报错！'+error);
      });
    },
  	bindOn(){//绑定
      if(this.form.class_id && this.form.tools_id){
        this.bind_hand(this.form).then((result)=>{
          if(result.data.code == 200){
            this.findAllBind({class_id:this.form.class_id});
            this.$notify({
              title:'成功',
              type: 'success',
              message: '一键绑定成功！'
            });
            localStorage.setItem('bindSuccess','66');
          }else if(result.data.code == 300){
            this.$notify({
              title:'失败',
              type: 'warning',
              message: '手环数量不充足！'
            });
          }
        }).catch((error)=>{
          console.log('开始上课手环绑定一键绑定操作失败，后台报错！'+error);
        });
      }else{
        this.$notify({
          type: 'warning',
          message: '请选择年级、班级和工具箱！'
        });
      }
    },
    bindOff() {//解绑
      this.deleteBind({class_id:this.form.class_id}).then((result)=>{
        if(result.code == 200){
          this.findAllBind({class_id:this.form.class_id});//刷新
          this.$notify({
            title:'成功',
            message: '手环已解绑',
            type: 'success'
          });
          localStorage.setItem('bindSuccess','66');
        }else{
          this.$notify({
            title:'失败',
            type: 'error',
            message: '解绑失败'
          });
        }
      }).catch((error)=>{
        console.log('解绑操作失败，后台报错！'+error);
      });
    },
    rc2({row,column,rowIndex,columnIndex}){//合并行、列
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1,2];
        } else if (columnIndex === 1) {
          return [0,0];
        }
      }
    },
    rc({row,column,rowIndex,columnIndex}){
      if (columnIndex===0||columnIndex===1||columnIndex===2){  //合并第1、2、3列的第一行，从0开始。
        if (rowIndex%2===0) {//第一行
          return [2,1];
        } else {
          return [0,0];
        }
      }
    },
    retu(){
      window.location.href='http://localhost:8080/#/clazzBegin/clazzHeartRateCurves';
    },
    rowClass(row, index) {
      return {"background-color":"#E6EBF5",'color':'#878D99'}
    },
    ...mapActions(['findAllBind','saveBind','deleteBind','findClazzBind','findToolBind','findGradeBind','bind_hand']),
  }
}
</script>

<style scoped>
  .el-button--primary {
      color: #fff;
      background-color: #448db8;
      border-color: #448db8;
  }
  *{
    font-size:12px;
  }
  .err{
    position: relative;
  }
  .table2{
    position: absolute;
    left: 0px;
    right: 0px;
    margin-top:8px;
  /*  overflow:auto;*/
  }
  .row{
    height: 30px;
  }
  .el-col{
    height:30px;
  }
  .select{
     margin-top:-5px;
  }
</style>
