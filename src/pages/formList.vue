<template>
  <div style="margin-top: 10px">
    <avue-crud :data="data" :option="option" :table-loading="loading" :page.sync="page" @on-load="onLoad">

      <template slot-scope="scope" slot="menuLeft">
        <el-button type="danger"
                   icon="el-icon-plus"
                   size="small"
                   plain
                   @click.stop="$router.push({name:'form',query:{action:'add'}})">新增
        </el-button>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-document-copy" size="small" type="text" @click="handleCopy(scope)">复制</el-button>
        <!--<el-button icon="el-icon-rank" size="small" type="text">作用域</el-button>-->
        <el-button icon="el-icon-edit" size="small" type="text" @click="$router.push({name:'form',params:scope.row})">
          编辑
        </el-button>
        <el-button icon="el-icon-delete" size="small" type="text" @click="handleDelete(scope)">删除</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        data: [],
        option: {
          columnBtn: false,
          refreshBtn: true,
          saveBtn: false,
          updateBtn: false,
          cancelBtn: false,
          addBtn: false,
          delBtn: false,
          editBtn: false,
          border: true,
          page: true,
          align: 'left',
          menuAlign: 'center',
          column: [
            {
              label: 'ID',
              prop: 'id',
              width: 70,
            },
            {
              label: '表单名',
              prop: 'name'
            }
          ]
        },
        page: {
          pageSize: 20,
          pagerCount: 5
        },
        //当前被点的行数据
        rowNow: {},
      };
    },
    mounted() {

    },
    methods: {
      async onLoad(page) {
        this.loading = true;
        // console.log(this.page);
        let res = await this.api("index/formlist", {
          page: this.page.currentPage
        });
        this.loading = false;
        this.page.total = res.Result.total;
        this.page.pageSize = res.Result.per_page;
        this.data = res.Result.data;
      },
      async handleCopy(row) {
        this.rowNow = row.row;
        let insertRow = {...row.row};
        insertRow.inid = "in_" + Math.ceil(Math.random() * 9999999)
        this.data.splice(row.index + 1, 0, insertRow);
        try {
          let result = await this.api("index/formcopy", insertRow);
          if (result.Code != 200) {
            throw new Error(result.Message);
          }
          this.onLoad();
        } catch (e) {
          this.data = this.data.filter(val => {
            return val.inid != insertRow.inid;
          })
        }
      },
      async handleDelete(scope) {
        this.$confirm('确定要删除吗？', '警告', {
          type: 'warning'
        }).then(async () => {
          let res = await this.api("index/formdelete", {
            id: scope.row.id
          });
          if (res.Code != 200) {
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
