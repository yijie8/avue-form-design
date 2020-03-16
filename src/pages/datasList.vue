<template>
  <div>
    <avue-crud :data="data" :option="option" v-model="obj" :before-close="beforeOpen" @on-load="onLoad" @row-save="rowSave" @row-update="rowUpdate" @row-del="rowDelete" @refresh-change="rowChange" :page.sync="page" :table-loading="loading"  ref="crud"  @selection-change="selectionChange" >
    
    <template slot-scope="scope" slot="menuLeft">
    
    <el-button type="danger"
      icon="el-icon-plus"
      size="small"
      plain
      @click.stop="$router.back()">返回</el-button>


    <!--<el-button type="danger"
      icon="el-icon-plus"
      size="small"
      plain
      @click.stop="addData()">修改显示列</el-button>

      <!--<el-button type="success"
      icon="el-icon-plus"
      size="small"
      plain
      @click.stop="allList">查看全部</el-button>-->
  </template>

    </avue-crud>
    <div style="margin-top: -40px">
      <!--<el-button @click="toggleSelection([data[1]])">选中第二行</el-button>-->
      <el-button type="danger" style="margin-left:10px;z-index:99999999" @click.stop="toggleSelection()">删除所选</el-button>
    </div>
  </div>
</template>

<script>
import {sleep,sleepdo} from '../utils.js';
export default {
    data() {
      return {
        selectData:[],
        loading:false,
        row:{name:""},
        page: {
          pageSize: 20,
          pagerCount:5
        },
        obj:{},
        dataAll:[],
        data: [],
        option:{
          title:'数据管理',
          page:true,
          align:'center',
          menuAlign:'center',
          selection: true,
          // selectable:(row,index)=>{
          //   return index===1;
          // },
          column:[
          ]
        }
      }
    },
    mounted(){
      // console.log(this.$route.params,this.$route.query);
      if(!!this.$route.params.row || (!!this.$route.query && !!this.$route.query.id)){
        this.row = this.$route.params.row || this.$route.query;
        this.option = Object.assign(this.option,JSON.parse(this.row.ftext));
        this.option.title = this.row.name+ "管理";
        
        console.log(this.row,this.option);
      }
    },
    methods: {
      toggleSelection(){
        console.log(this.selectData);
        if(this.selectData.length==0) {
          return;
        }
        let ids = [];
        this.selectData.forEach((val)=>{
          ids.push(this.dataAll[val["$index"]].id);
        });
        let idsStr = ids.join(",");
        // console.log(idsStr);
        // return;

        this.$confirm('确定要删除吗？', '警告', {
          type: 'warning'
        }).then(async () => {
          let res = await this.api("index/datasdelete",{
            id:idsStr
          });
          if(res.Code!=200) {
            throw new Error(result.Message);
          }
          this.onLoad();
        }).catch((e) => {
          // this.$message.error('删除失败')
        })
      },
      selectionChange(list){
        this.selectData = list;
        console.log(list);
        // this.$message.success('选中的数据'+ JSON.stringify(list));
      },

      async onLoad(page) {
        this.loading=true;
        // console.log(this.row,"<<<<<<<<<");
        // let c=1;
        // while(!this.row.id && c<10) {
        //   await sleep(0.1);
        //   c++;
        // }
        await sleepdo(1,this.row.id);
        // console.log(this.row,"<<<<<<<<<");

        // console.log(this.page);
        let res = await this.api("index/dataslist",{
          page:this.page.currentPage || 1,
          pid:this.row.id,
        });
        this.loading = false;
        this.page.total = res.Result.total;
        this.page.pageSize = res.Result.per_page;
        this.dataAll = res.Result.data;

        // check scope
        this.data = [];
        res.Result.data.forEach(val=>{
          this.data.push(JSON.parse(val.text));
        });
        console.log(this.data);
      },

      async rowSave(form,done){
        console.log(form,'新增数据'+ JSON.stringify(form));
        // done();
        // return;
        let res = await this.api("index/datasadd",{
          // id:form.id,
          did:this.row.id,
          text:JSON.stringify(form),
        });
        done();
        this.onLoad();
      },
      async rowUpdate(form,index,done){
        console.log(form.id,form,'编辑数据'+ JSON.stringify(form)+'数据序号'+index);
        this.dataAll[index].text = JSON.stringify(form);
        let res = await this.api("index/datasadd",{
          id:this.dataAll[index].id,///////////////
          did:this.row.id,
          text:this.dataAll[index].text,
        });
        done();
        this.onLoad();
      },

      async rowDelete(form,done){
        console.log(form,'删除数据'+ JSON.stringify(form));
        // return;
        this.$confirm('确定要删除吗？', '警告', {
          type: 'warning'
        }).then(async () => {
          let res = await this.api("index/datasdelete",{
            id:this.dataAll[form.$index].id//////////////
          });
          if(res.Code!=200) {
            throw new Error(result.Message);
          }
          // done();
          this.onLoad();
        }).catch((e) => {
          console.log(e);
          // done();
          this.$message.error('删除失败')
        })
        
      },


      rowChange(form,done){
        console.log('刷新数据'+ JSON.stringify(form));
        this.onLoad();
      },


      



    },
}
</script>
<style>
.avue-crud__pagination {
    position: relative;
    height: 25px;
    margin-top: 15px;
    margin-bottom: 10px;
    padding: 10px 20px;
    margin-left: 100px;
}
</style>