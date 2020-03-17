<template>
  <div style="margin-top: 10px">

<el-form ref="form" :model="form" label-width="100px">
  <el-form-item label="作用域名称">
    <el-input v-model="scopeName" placeholder="请输入内容"></el-input>
  </el-form-item>

  <el-form-item label="是否全局有效">
    <el-switch
      v-model="Overall"
      active-color="#13ce66"
      inactive-color="#ff4949">
    </el-switch>
  </el-form-item>

  <el-form-item label="是否立即生效">
    <el-switch
      v-model="scopeOpen"
      active-color="#13ce66"
      inactive-color="#ff4949">
    </el-switch>
  </el-form-item>


  <el-form-item label="添加企业范围">
  <!--<el-transfer
      filterable
      :filter-method="filterMethod"
      filter-placeholder="请输入企业ＩＤ"
      v-model="enterpriseInfo"
      :data="enterpriseData">
    </el-transfer>-->
    <el-row>


      <el-col :span="8">
        <el-autocomplete
          v-model="enterpriseInfo"
          :fetch-suggestions="enterpriseQuerySearchAsync"
          placeholder="请输入企业ＩＤ"
          @select="enterpriseHandleSelect"
           style="width:80%"
           :disabled="Overall"
        ></el-autocomplete>
      </el-col>


      <el-col :span="12">
        <el-select v-model="enterpriseSelected" multiple placeholder="请选择" style=" width:80%">
          <el-option
            v-for="item in enterpriseSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>



    </el-row>
  </el-form-item>


  <el-form-item label="添加个人范围">

    <el-row>
      <el-col :span="8">
        <el-autocomplete
          v-model="userInfo"
          :fetch-suggestions="userQuerySearchAsync"
          placeholder="请输入用户ＩＤ或用户名"
          @select="userHandleSelect"
           style="width:80%"
           :disabled="Overall"
        ></el-autocomplete>
      </el-col>


      <el-col :span="12">
        <el-select v-model="userSelected" multiple placeholder="请选择" style=" width:80%">
          <el-option
            v-for="item in userSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>

    </el-row>

  </el-form-item>

  <el-form-item label="">
    <el-button type="primary" @click="onSubmit">{{this.$route.params.id?"立即修改":"立即添加"}}</el-button>
  </el-form-item>


</el-form>
</div>
</template>

<script>
export default {
    data() {
      return {
        //所有搜索的企业信息
        enterpriseAll:[],
        enterpriseInfo:"",
        //所有选中的
        enterpriseSelect:[],
        //正在被选中
        enterpriseSelected:{},

        //所有搜索的用户信息
        userAll:[],
        userInfo:"",
        //所有选中的
        userSelect:[],
        //正在被选中
        userSelected:{},

        scopeOpen:this.$route.params.open ? true : false,
        scopeName:this.$route.params.name || "",




        loading:false,
        data: [],
        option:{
         columnBtn:false,
          refreshBtn:true,
          saveBtn:false,
          updateBtn:false,
          cancelBtn:false,
          addBtn:false,
          delBtn:false,
          editBtn:false,
          border:true,
          page:true,
          align:'left',
          menuAlign:'center',
          column:[
            {
              label:'ID',
              prop:'id',
              width:70,
            },
            {
              label:'表单名',
              prop:'name'
            }
          ]
        },
        page: {
          pageSize: 20,
          pagerCount:5
        },
        //当前被点的行数据
        rowNow :{},
        // 是否开启全局
        Overall: this.$route.params.allscope ? true : false,
        added:false,
      };
    },
    watch: {
      enterpriseInfo(val){
        // console.log(val,"<<<<<<<<<<now");
      },
    },
    mounted(){
      console.log(this.$route.params);
      //修改
      if(this.$route.params.id) {
        if(Array.isArray(this.$route.params.scopes)) {
          this.$route.params.scopes.forEach(val=>{
            if(val.typex=="company") {
              this.enterpriseSelected.push(val.name);
            }
            if(val.typex=="user") {
              this.userSelected.push(val.name);
            }
          });
        }
      }
    },
    methods: {
      async onSubmit(){
        if(this.scopeName=="") {
          this.$message.error('作用域名不能为空')
          return;
        }
        let scope = [];
        this.enterpriseSelected.forEach(val=>{
          scope.push({
            idx:val.split("(")[1].replace(")",""),
            name:val,
            typex:"company"
          });
        });
        this.userSelected.forEach(val=>{
          scope.push({
            idx:val.split("(")[1].replace(")",""),
            name:val,
            typex:"user"
          });
        });

        // 全局不写数据
        if(this.Overall) {
          scope = [];
        }

        let res = await this.api("index/scopeadd",Object.assign(this.$route.params,{
          name:this.scopeName,
          open:this.scopeOpen?1:0,
          allscope:this.Overall?1:0,
          scope:scope,
        }));
        if(res.Code!=200) {
          this.$message.error(res.Message);
          return;
        }else{
          this.$router.replace({name:"scopeList"})
        }
      },
      enterpriseHandleSelect(item) {
        console.log(item);
        this.enterpriseAdd();
      },
      //开始搜索
      async enterpriseQuerySearchAsync(key,callback){
        if(this.added) {
          this.enterpriseInfo=key="";
          this.added = !this.added;
        }
        if(key.indexOf("(")>=0) {
          key = key.split("(")[1].replace(")","");
        }
        let res = await this.api("index/getEnterprise",{key});
        // console.log(res);
        this.enterpriseAll = [];
        if(Array.isArray(res.Result)) {
          res.Result.forEach(val=>{
            this.enterpriseAll.push({
              "label":val.id,
              "value":`${val.shortname}(${val.id})`,
            });
          });
        }
        callback(this.enterpriseAll);
      },
      enterpriseAdd(){
        if(this.enterpriseAll.length==1) {
          this.enterpriseInfo = this.enterpriseAll[0].value;
        }else{
          // return;
        }

        //去重
        if(this.enterpriseSelected.indexOf(this.enterpriseInfo)<0) {
          this.enterpriseSelected.push(this.enterpriseInfo);
          this.enterpriseSelect.push({value:this.enterpriseInfo,label:this.enterpriseInfo});
        }
        this.added = true;
      },






      userHandleSelect(item) {
        console.log(item);
        this.userAdd();
      },
      //开始搜索
      async userQuerySearchAsync(key,callback){
        if(this.added) {
          this.userInfo=key="";
          this.added = !this.added;
        }
        if(key.indexOf("(")>=0) {
          key = key.split("(")[1].replace(")","");
        }
        let res = await this.api("index/getuser",{key});
        // console.log(res);
        this.userAll = [];
        if(Array.isArray(res.Result)) {
          res.Result.forEach(val=>{
            this.userAll.push({
              "label":val.id,
              "value":`${val.staff_name}-${val.username}(${val.id})`,
            });
          });
        }
        callback(this.userAll);
      },
      userAdd(){
        if(this.userAll.length==1) {
          this.userInfo = this.userAll[0].value;
        }else{
          // return;
        }

        //去重
        if(this.userSelected.indexOf(this.userInfo)<0) {
          this.userSelected.push(this.userInfo);
          this.userSelect.push({value:this.userInfo,label:this.userInfo});
        }
        this.added = true;
      },



      async onLoad(page) {
        // console.log(this.page);
        let res = await this.api("index/formlist",{
          page:this.page.currentPage
        });
        this.page.total = res.Result.total;
        this.page.pageSize = res.Result.per_page;
        this.data = res.Result.data;
      },
      async handleCopy(row) {
          this.rowNow = row.row;
          let insertRow = {...row.row};
          insertRow.inid = "in_"+Math.ceil(Math.random() * 9999999)
          this.data.splice(row.index+1,0,insertRow);
          try{
            let result = await this.api("index/formcopy",insertRow);
            if(result.Code!=200) {
              throw new Error(result.Message);
            }
            this.onLoad();
          }catch(e){
            this.data = this.data.filter(val=>{
              return val.inid!=insertRow.inid;
            })
          }
      },
      async handleDelete(scope) {
        this.$confirm('确定要删除吗？', '警告', {
          type: 'warning'
        }).then(async () => {
          let res = await this.api("index/formdelete",{
            id:scope.row.id
          });
          if(res.Code!=200) {
            throw new Error(result.Message);
          }
          this.onLoad();
        }).catch((e) => {
          // this.$message.error('删除失败')
        })
      }
    },
}
</script>

<style>
  .el-transfer-panel {
    width:500px !important;
  }
</style>
