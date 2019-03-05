<template>
  <div class="addTool">
    <el-row class='rowTop'>
    <!--   <el-col :span='20'>
      <el-form inline size='mini'>
        <el-form-item>
          <el-button type="text" size='mini' @click='addTool'>添加工具箱</el-button>
        </el-form-item>
      </el-form>
    </el-col> -->
    <!-- <el-col :span='4'> -->
        <el-row type='flex' justify='end'>
          <el-form inline size='mini'>
            <el-form-item>
              <el-button type="info" size='small' @click='add2' class="add"><!-- <i class="fa fa-plus"></i> -->新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="info" size='small' @click='bindCircle' class="add"><!-- <i class="fa fa-plus"></i> -->绑定手环</el-button>
            </el-form-item>
          </el-form>
        </el-row>
     <!--  </el-col> -->
    </el-row>
    <el-table :data="tools" :height="height" style="width:100%" class='table2' border stripe tooltip-effect='blue' ref="multipleTable" :header-row-style="rowClass" size='mini' align='center'>
      <el-table-column type='index' label="序号" width='60' align='center'></el-table-column>
      <el-table-column prop='tools_id' label="tools_id" v-if='false' align='center'></el-table-column>
      <el-table-column prop="tools_name" label="工具箱名称" align='center'></el-table-column>
      <el-table-column prop="tools_num" label="手环数量" align='center'></el-table-column>
      <el-table-column prop="tools_detail" label="说明" align='center'></el-table-column>
      <el-table-column prop="tools_status" label="启用状态" align='center'>
      </el-table-column>
      <el-table-column label="操作" align='center' width="120">
        <template slot-scope='scope'>
          <i class="options fa fa-edit" @click="edit2(scope.$index, scope.row)"></i>
          <i class="options fa fa-trash" @click="delete2(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="visible2" center>
      <div slot="title" class="dialog-title">
        {{title2}}
      </div>
      <el-form :model="form2" :rules='rules' class='demo-ruleForm dialog' ref='form2' size='mini'>
        <!-- <el-form-item label="序号" :label-width="fw">
          <el-input v-model="form2.no" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="工具箱名称" :label-width="fw" prop='tools_name'>
          <el-input v-model="form2.tools_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明" :label-width="fw" prop='tools_detail'>
          <el-input v-model="form2.tools_detail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" :label-width="fw" prop='tools_status'>
          <el-radio-group v-model="form2.tools_status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle2" size='mini'>取 消</el-button>
        <el-button type="info" @click="submit2('form2')" class="yes" size='mini'>确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="visibleCircle" center>
      <div slot="title" class="dialog-title">
        {{titleCircle}}
      </div>
      <el-form :model="formCircle" :rules='ruleCircle' class='demo-ruleForm dialog' ref='formCircle' size='mini'>
        <el-form-item label='工具箱名称' prop='tools_id'>
          <el-select clearable v-model="formCircle.tools_id" @change='toolsChange(formCircle.tools_id)' placeholder="请选择工具箱">
            <el-option v-for="item in toolsCircle" :label="item.tools_name" :value="item.tools_id" :key="item.tools_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--<span>请在下列的表格中选择您要绑定到该工具箱中的手环</span>
       <el-table :data="circleData" border stripe size='mini' align='center' @selection-change="selectArr" class='table18' :height='height2'>
        <el-table-column type="selection" align='center'></el-table-column>
        <el-table-column property="handler_id" align='center' label="手环id" min-width="150" v-if='false'></el-table-column>
        <el-table-column property="handler_number" align='center' label="手环编号" min-width="200"></el-table-column>
      </el-table> -->
      <el-transfer :data="bindCircleAllData" 
        :titles="['未绑定','工具箱已绑定']" 
        :button-texts="['解绑','绑定']" 
        @change="handleChange" 
        v-model="bindCircleData"></el-transfer>
      <!-- <el-transfer :data="noBind" 
        :titles="['未绑定','工具箱已绑定']" 
        :button-texts="['解绑','绑定']" 
        @change="handleChange" 
        v-model="onBind"></el-transfer> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleCircle" size='mini'>取 消</el-button>
        <el-button type="info" @click="submitCircle('formCircle')" class="yes" size='mini'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
import $ from 'jquery';

export default {
  name: 'addTool',
  data(){
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${ i }`,
        });
      }
      return data;
    };
    return {
      fw:'120px',
      title2:'工具箱',
      titleCircle:'工具箱绑定手环',
      visible2:false,
      visibleCircle:false,
      height:0,
      height2:0,
      selectCircle:[],
      bindCircleList:[],//绑定列表中的所有手环
      bindCircleData:[],//所有已绑定的手环
      bindCircleAllData:[],//所有未绑定和已绑定的手环
      form2:{
        tools_detail:'',
      }, 
      formCircle:{},  
      rules:{
        tools_name:[
          {required:true,message:'请输入工具箱名称',trigger: 'blur'},
        ],
        tools_status:[
          {required:true,message:'请选择工具箱启用状态',trigger: 'change'},
        ],
      }, 
      ruleCircle:{
        tools_id:[
          {required:true,message:'请选择工具箱',trigger: 'change'},
        ],
      },  
    }
  },
  created(){
    this.findAllTool();
    this.findAllCircle();
    this.height = $(window).height()-256;//应对于不同的分别率。
    this.height2 = ($(window).height()-60)/2;
  },
  computed:{
    ...mapGetters(['tools','toolsCircle','circleData'/*,'bindCircleAllData','bindCircleData'*/]),
  },
  methods:{
   /* addTool(){
      this.$message({
        type: 'info',
        message: '欢迎来到添加工具箱！'
      });
    },*/
    handleChange(value, direction, movedKeys) {
      this.bindCircleList = value.sort();
    },
    toolsChange(tools_id){
      var vm = this;
      vm.bindCircleData = [];
      vm.bindCircleAllData = [];
      this.reqCirclesOfTool({tools_id:tools_id}).then((data)=>{
        if(data[0]){
          data[0].forEach(function(item){
            vm.bindCircleData.push(+item.handler_id);
          });
        }
        if(data[1]){
        data[1].forEach(function(item){
          var o = {
            key: +item.handler_id,
            label: item.handler_number,
          }
          vm.bindCircleAllData.push(o);
        });
        data[0].forEach(function(item){
          var o = {
            key: +item.handler_id,
            label: item.handler_number,
          }
          vm.bindCircleAllData.push(o);
        });
      }
      });
    },
    selectArr(val){
      this.selectCircle = [];//清空，避免累加。
      for(var i=0;i<val.length;i++){
        this.selectCircle.push(val[i].handler_id);
      }
    },
    bindCircle(){
      this.visibleCircle = true;
      this.reqCircleData();
    },
    edit2(i,row){
      this.visible2=true;
      this.title2='工具箱信息修改';
      this.form2 = row;
    },
    delete2(i,row){
      this.$confirm('此操作将永久删除该条数据，是否继续?','提示',{
        confirmButtonText:'确定',type:'warning',
        cancelButtonText:'取消'
      }).then(() => {
        this.deleteByIdTool({tools_id:row.tools_id}).then((result)=>{
          if(result.data.code == 200){
            this.$notify({title:'成功',type:'success',message:'工具箱信息删除成功'});
          }else if(result.data.code == 300){
            this.$notify({title:'删除出错',type:'warning',message:'请先将工具箱和手环解绑后再删除！'});
          }else{
            console.log('工具箱信息删除失败，后台返回状态码：'+result.data.code);
          }
        }).catch((error)=>{
          console.log('工具箱信息删除失败，后台报错！-->'+error);
        });
      }).catch(() => {
        this.$notify({type:'info',message:'已取消删除'}); 
      });
    },
    submit2(formName){
      let flag = 0;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveTool(this.form2).then((result)=>{
            if(result.data.code == 200){
              this.$notify({title:'成功',type:'success',message:'操作成功'});
              flag = 0;
            }else if(result.data.code == 300){
              this.$notify({title:'警告',type:'warning',message:'工具箱名称不能重复，请重新添加工具箱'});
              flag = 1;
            }else{
              console.log('工具箱操作失败，后台返回状态码：'+result.data.code);
              flag = 0;
            }
            if(flag == 0){
              this.visible2=false;
            }
          }).catch((error)=>{
            flag = 0;
            this.visible2=false;
            console.log('工具箱操作失败，后台报错！-->'+error);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });  
    },
    submitCircle(formName){
      var str = '';
      for(var i=0;i<this.bindCircleList.length;i++){
        i == this.bindCircleList.length-1 ? str += this.bindCircleList[i] : str += (this.bindCircleList[i]+'@');
      }
      this.formCircle.handler_ids = str;
      let flag = 0;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveBindCircle(this.formCircle).then((result)=>{
            if(result.data.code == 200){
              this.$notify({title:'成功',type:'success',message:'绑定、解绑操作成功'});
              this.bindCircleData = [];
              this.bindCircleAllData = [];
              this.formCircle = {};
              flag = 0;
            }else{
              console.log('手环与工具箱绑定、解绑操作失败，后台返回状态码：'+result.data.code);
              flag = 0;
            }
            if(flag == 0){
              this.visibleCircle=false;
            }
          }).catch((error)=>{
            flag = 0;
            this.visibleCircle=false;
            console.log('手环与工具箱绑定、解绑操作失败，后台报错！-->'+error);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });  
    },
    cancle2(){
      this.visible2=false;
    },
    cancleCircle(){
      this.visibleCircle=false;
      this.bindCircleData = [];
      this.bindCircleAllData = [];
      this.formCircle = {};
    },
    add2(){
      this.form2 = {tools_status:'启用',tools_detail:'',},
      this.visible2=true;
      this.title2='新增工具箱';
    },
    rowClass(row, index) {
      return {"background-color":"#E6EBF5",'color':'#878D99'}
    },
    ...mapActions(['findAllTool','saveTool','deleteByIdTool','findTool','findAllCircle','saveBindCircle','reqCircleData','reqCirclesOfTool']),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    font-size:12px;
  }
  .table2{
    overflow:auto;
     margin-top:1px;
  }
  .icon {
    cursor: pointer;
    font-size: 20px;
  }
  .title{
    display:inline-block;
    margin-top:6px;
    font-size:18px;
  }
  .dialog .el-input{
    width:90%;
  }
  .dialog-footer{
    text-align:right;
  }
  .rowTop .el-form .el-form-item{
    margin-top:-2px;
    margin-bottom:9px;
  }
  .rowTop .el-form-item--small{
    margin-right:0;
    margin-left:8px;
  }
  .yes{
     font-size:12px;
    background: #448db8;
    border:none;
  }
  .add{
     font-size:12px;
    background: #448db8;
    border:none;
  }
  .table18{
    overflow:auto;
  }
 .addTool i.options{
    padding: 0 5px;
    cursor: pointer;
    color: #448db8;
  }

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


