<template>
  <div>
    <avue-crud :data="data" :option="option" :table-loading="loading" :page.sync="page" @on-load="onLoad">

    <template slot-scope="scope" slot="menuLeft">
    <el-button type="danger"
      icon="el-icon-plus"
      size="small"
      plain
      @click.stop="$router.push({name:'scopeAdd',query:{action:'add'}})">新增</el-button>
  </template>

      <template slot-scope="scope" slot="menu">
        <el-button :type="scope.row.open?'success':'danger'" size="small" @click="handleChange(scope)">{{scope.row.open?"开启":"禁用"}}</el-button>
        <el-button icon="el-icon-document-copy" size="small" type="text" @click="handleCopy(scope)">复制</el-button>
        <el-button icon="el-icon-edit" size="small" type="text" @click="$router.push({name:'scopeAdd',params:scope.row})">编辑</el-button>
        <el-button icon="el-icon-delete" size="small" type="text" @click="handleDelete(scope)">删除</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
export default {
    data() {
      return {
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
              label:'作用域名',
              prop:'name'
            },
            {
              label:'作用范围',
              prop:'scope'
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
      async handleChange(row){
        let res = await this.api("index/scopeChange",{
          id:row.row.id,
          open:!row.row.open,
        });
        this.onLoad();
      },
      async onLoad(page) {
        // console.log(this.page);
        let res = await this.api("index/scopelist",{
          page:this.page.currentPage
        });
        this.page.total = res.Result.total;
        this.page.pageSize = res.Result.per_page;
        // check scope
        res.Result.data.forEach(val=>{
          if(val.allscope>0) {
            val.scope = "全局生效";
          }else{
            val.scope = "";
            if(Array.isArray(val.scopes)){
              val.scopes.forEach(vall=>{
                val.scope += vall.name+"["+this.allScopeType[vall.typex]+"] "
              });
            }
          }
        });
        this.data = res.Result.data;
      },
      async handleCopy(row) {
          this.rowNow = row.row;
          let insertRow = {...row.row};
          insertRow.inid = "in_"+Math.ceil(Math.random() * 9999999)
          this.data.splice(row.index+1,0,insertRow);
          try{
            let result = await this.api("index/scopecopy",insertRow);
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
          let res = await this.api("index/scopedelete",{
            id:scope.row.id
          });
          if(res.Code!=200) {
            throw new Error(result.Message);
          }
          this.onLoad();
        }).catch((e) => {
          this.$message.error('删除失败')
        })
      }
    },
}
</script>
