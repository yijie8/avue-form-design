<template>
  <div>
    <avue-crud :data="data" :option="option" :table-loading="loading" :page.sync="page" @on-load="onLoad" @sortable-change="sortableChange">

    <template slot-scope="scope" slot="menuLeft">
    <el-button type="danger"
      icon="el-icon-plus"
      size="small"
      plain
      @click.stop="addData()">新增</el-button>

      <el-button type="success"
      icon="el-icon-plus"
      size="small"
      plain
      @click.stop="allList" v-if="pid!=0">查看全部</el-button>
  </template>

      <template slot-scope="scope" slot="menu">
        <el-button :type="scope.row.open?'success':'danger'" size="small" @click="handleChange(scope)">{{scope.row.open?"开启":"禁用"}}</el-button>

        <!--<el-button icon="el-icon-document-copy" size="small" type="text" @click="addDatas(scope)">添加数据</el-button>-->

        <el-button icon="el-icon-document-copy" size="small" type="text" @click="listDatas(scope)">列表数据</el-button>

        <el-button icon="el-icon-document-copy" size="small" type="text" @click="handleCopy(scope)">调用代码</el-button> 

           
        <el-button icon="el-icon-document-copy" size="small" type="text" @click="addNext(scope)" v-if="scope.row.pid==0">添加下级</el-button><!--目前只支持添加一级下级-->
        <el-button icon="el-icon-document-copy" size="small" type="text" @click="listNext(scope)" v-if="scope.row.pid==0">查看下级</el-button>

        <el-button icon="el-icon-document-copy" size="small" type="text" @click="formDataBind(scope)">绑定表单</el-button>
        <el-button icon="el-icon-document-copy" size="small" type="text" @click="scopeDataBind(scope)">绑定作用域</el-button>

<el-button icon="el-icon-document-copy" size="small" type="text" @click="handleCopy(scope)">复制</el-button>     
        <el-button icon="el-icon-edit" size="small" type="text" @click="modifyData(scope)">编辑</el-button>
        <el-button icon="el-icon-delete" size="small" type="text" @click="handleDelete(scope)">删除</el-button>
      </template>
    </avue-crud>


    <el-dialog title="绑定表单" :visible.sync="formDatadialogTableVisible">
      <avue-crud :data="formData" :option="formDataoption" :table-loading="formDataLoading" :page.sync="formDatapage" @on-load="formDataonLoad" @row-click="formDatahandleRowClick">
      </avue-crud>
    </el-dialog>

    <el-dialog title="绑定作用域" :visible.sync="scopeDatadialogTableVisible">
      <avue-crud :data="scopeData" :option="scopeDataoption" :table-loading="scopeDataLoading" :page.sync="scopeDatapage" @on-load="scopeDataonLoad" @row-click="scopeDatahandleRowClick">
      </avue-crud>
    </el-dialog>

    <el-dialog :title="modify>0?'修改数据源':'添加数据源'" :visible.sync="addDialogTableVisible">
      <avue-form ref="form" v-model="addObj" :option="addOption" @submit="addSubmit">

        <template slot-scope="scope" slot="pid">
          <div>
            <el-tag>{{pidname || (pid?"二级":"顶级")}}</el-tag>
          </div>
        </template>

           <template slot-scope="{}" slot="textLabel">
            <span>姓名&nbsp;&nbsp;</span>
            <el-tooltip class="item" effect="dark" content="文字提示" placement="top-start">
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </template>

      </avue-form>
    </el-dialog>

    <!-- 添加　修改　数据 -->

  </div>
</template>

<script>
// TODO 少移动 添加管理数据
export default {
    data() {
      return {
        loading:false,
        pid:this.$route.query.pid || "",
        pidadd:0,
        pidname:"",
        modify:0,

        addDialogTableVisible:false,
        addObj:{},
        addOption:{
          submitText: '添加',
          column: [
            {
                label: '上级',
                prop: 'pid',
                formslot:true,
                labelslot:true,
              },
            
              
              {
                  label: "数据源名",
                  prop: "name",
                  span: 24,
                  maxlength: 400,
                  suffixIcon: 'el-icon-tickets',
                  prefixIcon: 'el-icon-tickets',
                  minlength: 2,
                  rules: [{
                      required: true,
                      message: "请输入数据源名",
                      trigger: "blur"
                  }],
              },
              {
                  label: "是否开启",
                  prop: "open",
                  span: 6,
                  type: "switch",
                  hide: true,
                  row:true,
              },
              {
                remote: true,
                prop: 'fid',
                label: "绑定表单",
                props: {
                  label: 'name',
                  value: 'id'
                },
                type: "select",
                span: 24,
                dicUrl: this.apiurl+"index/formListSoft",
              },
              {
                remote: true,
                prop: 'sid',
                label: "绑定作用域",
                props: {
                  label: 'name',
                  value: 'id'
                },
                type: "select",
                span: 24,
                dicUrl: this.apiurl+"index/scopeListSoft",
              },
              
            ],
        },



        formDatadialogTableVisible:false,
        formDataloading:false,
        formData: [],
        formDataoption:{
          menu:false,
          columnBtn:false,
          refreshBtn:false,
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
            },
            {
              label:'添加时间',
              prop:'atime'
            }
          ]
        },
        formDatapage: {
          pageSize: 20,
          pagerCount:5
        },


        scopeDatadialogTableVisible:false,
        scopeDataloading:false,
        scopeData: [],
        scopeDataoption:{
          menu:false,
          columnBtn:false,
          refreshBtn:false,
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
              label:'作用域名',
              prop:'name'
            },
            {
              label:'添加时间',
              prop:'atime'
            }
          ]
        },
        scopeDatapage: {
          pageSize: 20,
          pagerCount:5
        },

        data: [],
        option:{
          dragHandler:true,
          sortable:true,
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
              label:'数据名',
              prop:'name'
            },            
            {
              label:'上级',
              prop:'pname'
            },
            {
              label:'作用范围',
              prop:'sname'
            },
            {
              label:'表单表',
              prop:'fname'
            }
          ]
        },
        page: {
          pageSize: 20,
          pagerCount:5
        },
        //当前被点的行数据
        rowNow :{},
        allScopeType:{
          "company":"公司",
          "user":"用户",
        },
      };
    },
    mounted(){
 
    },
    methods: {
      async addSubmit(args,done){
        // if(this.modify>0) {
          // console.log(args);
          // 过滤掉　| 线
          if(typeof(args.fid)=="string" && args.fid.indexOf("|")>0) {
            args.fid = args.fid.split("|")[1];
          }
          if(typeof(args.sid)=="string" && args.sid.indexOf("|")>0) {
            args.sid = args.sid.split("|")[1];
          }
        // }
        console.log(args,{
          id:this.modify,
          pid:this.pidadd || (this.pid || 0),
          fid:args.fid,
          sid:args.sid,
          name:args.name,
          open:args.open===false?0:1,
        },"<<<<<<<<");
        // done();
        // return;
        
        let res = await this.api("index/dataadd",{
          id:this.modify,
          pid:this.pidadd || (this.pid || 0),
          fid:args.fid,
          sid:args.sid,
          name:args.name,
          open:args.open===false?0:1,
        });
        done();

        if(res.Code==200){
          this.onLoad();
          this.addDialogTableVisible=false;
        }else{
          this.$message.error(res.message);
          return;
        }
      },
      formDataBind(row){
        console.log(row);
        this.rowNow = row;
        this.formDatadialogTableVisible = true;
      },
      async formDataonLoad(page) {
        // console.log(this.page);
        let res = await this.api("index/formlist",{
          page:this.formDatapage.currentPage
        });
        this.formDatapage.total = res.Result.total;
        this.formDatapage.pageSize = res.Result.per_page;
        this.formData = res.Result.data;
      },
      async formDatahandleRowClick(row, event, column) {
        this.formDatadialogTableVisible = false;
        this.data.forEach(async val=>{
          if(val.id==this.rowNow.row.id) {
            let res = await this.api("index/dataBindForm",{
              id:val.id,
              fid:row.id,
            });
            if(res.Code==200){
              val.fid = row.id;
              val.fname = row.name;
              val.ftext = row.text;
            }else{
              this.$message.error(res.message);
              return;
            }
          }
        });
      },


      scopeDataBind(row){
        console.log(row);
        this.rowNow = row;
        this.scopeDatadialogTableVisible = true;
      },
      async scopeDataonLoad(page) {
        // console.log(this.page);
        let res = await this.api("index/scopelist",{
          page:this.scopeDatapage.currentPage
        });
        this.scopeDatapage.total = res.Result.total;
        this.scopeDatapage.pageSize = res.Result.per_page;
        this.scopeData = res.Result.data;
      },
      async scopeDatahandleRowClick(row, event, column) {
        this.scopeDatadialogTableVisible = false;
        this.data.forEach(async val=>{
          if(val.id==this.rowNow.row.id) {
            let res = await this.api("index/dataBindScope",{
              id:val.id,
              sid:row.id,
            });
            if(res.Code==200){
              val.sid = row.id;
              val.sname = row.name;
            }else{
              this.$message.error(res.message);
              return;
            }
          }
        });
      },

      async sortableChange(oldindex, newindex, row, list) {
        // this.data=[]
        // this.$nextTick(()=>{
          // this.data=list;
        // })
        let updateAll = [];
        list.forEach((val,key)=>{
          updateAll.push({
            id:val.id,
            soft:this.page.currentPage*1000+key
          });
        });

        let res = await this.api("index/dataOrder",{
          soft:updateAll,
        });

       console.log(updateAll,oldindex, newindex, row, list)
      },
      async handleChange(row){
        let res = await this.api("index/dataChange",{
          id:row.row.id,
          open:!row.row.open,
        });
        this.onLoad();
      },
      async onLoad(page) {
        // console.log(this.page);
        let res = await this.api("index/datalist",{
          page:this.page.currentPage,
          pid:this.pid,
        });
        this.page.total = res.Result.total;
        this.page.pageSize = res.Result.per_page;
        // check scope
        res.Result.data.forEach(val=>{

        });
        this.data = res.Result.data;
      },
      async handleCopy(row) {
          this.rowNow = row.row;
          let insertRow = {...row.row};
          insertRow.inid = "in_"+Math.ceil(Math.random() * 9999999)
          this.data.splice(row.index+1,0,insertRow);
          try{
            let result = await this.api("index/datacopy",insertRow);
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
          let res = await this.api("index/datadelete",{
            id:scope.row.id
          });
          if(res.Code!=200) {
            throw new Error(result.Message);
          }
          this.onLoad();
        }).catch((e) => {
          // this.$message.error('删除失败')
        })
      },

      listNext(scope){
        this.pid = scope.row.id;
        this.onLoad();
        // this.$router.push({name:"dataList",query:{pid:scope.row.id}}).catch(err => {console.log(err);})
      },
      allList(){
        this.pid = 0;
        this.onLoad();
      },
      addNext(row){
        this.modify=0;
        this.pidadd = row.row.id;
        this.pidname = row.row.name;
        this.addObj = {
          name:"",
          fid:"",
          sid:"",
        };
        this.addOption.submitText = "添加下级";
        this.addDialogTableVisible = true;
        console.log("3333333333333");
      },
      addData(){
        this.modify=0;
        this.addDialogTableVisible=true;
        this.pidadd = 0;
        this.pidname = "";
        this.pid = 0;
        this.addOption.submitText = "添加";
        this.addObj = {
          name:"",
          fid:"",
          sid:"",
        };
      },
      modifyData(row){
        this.modify=row.row.id;
        // console.log(row);
        this.pidadd = row.row.pid;
        this.pidname = row.row.pname;
        this.addObj = {
          name:row.row.name,
          fid:row.row.fname+"|"+row.row.fid,
          sid:row.row.sname+"|"+row.row.sid,
        };
        this.addOption.submitText = "修改";
        // console.log(this.addObj);
        this.addDialogTableVisible = true;
      },
      listDatas(row){
        // this.$router.push({name:"datasList",params:{row:row.row}})
        this.$router.push({name:"datasList",query:{...row.row}})
      },
    },
}
</script>
