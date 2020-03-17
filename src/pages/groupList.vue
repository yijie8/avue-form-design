<template>
  <div style="margin-top: 10px">
    <avue-crud :data="data" :option="option" :table-loading="loading" :page.sync="page" @on-load="onLoad">

      <template slot-scope="scope" slot="menuLeft">
        <el-button type="danger"
                   icon="el-icon-plus"
                   size="small"
                   plain
                   @click.stop="addData()">新增
        </el-button>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button :type="scope.row.open?'success':'danger'" size="small" @click="handleChange(scope)">
          {{scope.row.open?"开启":"禁用"}}
        </el-button>

        <el-button icon="el-icon-document-copy" size="small" type="text" @click="handleCopy(scope)">调用代码
        </el-button>
        <el-button icon="el-icon-document-copy" size="small" type="text" @click="formDataBind(scope)">绑定数据
        </el-button>

        <el-button icon="el-icon-document-copy" size="small" type="text" @click="handleCopy(scope)">复制</el-button>
        <!--<el-button icon="el-icon-rank" size="small" type="text">作用域</el-button>-->
        <el-button icon="el-icon-edit" size="small" type="text" @click="modifyData(scope)">编辑</el-button>
        <el-button icon="el-icon-delete" size="small" type="text" @click="handleDelete(scope)">删除</el-button>
      </template>
    </avue-crud>

    <el-dialog :title="modify>0?'修改分组':'添加分组'" :visible.sync="addDialogTableVisible">
      <avue-form ref="form" v-model="addObj" :option="addOption" @submit="addSubmit">
      </avue-form>
    </el-dialog>


    <el-dialog title="绑定数据源" :visible.sync="formDatadialogTableVisible" width="70%">
      <avue-crud :data="formData" :option="formDataoption" :table-loading="formDataLoading"
                 :page.sync="formDatapage" @on-load="formDataonLoad" ref="crud" @selection-change="selectionChange">
      </avue-crud>
      <div style="margin-top: -40px">
        <el-button type="danger" style="margin-left:10px;z-index:99999999" @click.stop="toggleSelection()">选择
        </el-button>

        <el-button @click="$refs.crud.toggleSelection([formData[1]])">选中第二行</el-button>

      </div>
    </el-dialog>
    <!--@row-click="formDatahandleRowClick"-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formDatadialogTableVisible: false,
        formDataloading: false,
        formData: [],
        formDataoption: {
          selection: true,

          menu: false,
          columnBtn: false,
          refreshBtn: false,
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
              label: '数据源名',
              prop: 'name'
            },
            {
              label: '添加时间',
              prop: 'atime'
            }
          ]
        },
        formDatapage: {
          pageSize: 20,
          pagerCount: 5
        },
        selectData: [],


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
              label: '分组名',
              prop: 'name'
            },
            {
              label: '分组项',
              prop: 'text'
            }
          ]
        },
        page: {
          pageSize: 20,
          pagerCount: 5
        },
        //当前被点的行数据
        rowNow: {},

        modify: 0,
        addDialogTableVisible: false,
        addObj: {},
        addOption: {
          submitText: '添加',
          column: [

            {
              label: "分组名",
              prop: "name",
              span: 24,
              maxlength: 400,
              suffixIcon: 'el-icon-tickets',
              prefixIcon: 'el-icon-tickets',
              minlength: 2,
              rules: [{
                required: true,
                message: "请输入分组名",
                trigger: "blur"
              }],
            },
            {
              label: "是否开启",
              prop: "open",
              span: 6,
              type: "switch",
              hide: true,
              row: true,
            },
          ],
        },
      };
    },
    mounted() {

    },
    methods: {
      async toggleSelection() {
        console.log(this.selectData);
        let text = this.selectData.map(value => {
          return value.id;
        }).join(",");

        // return;
        let res = await this.api("index/groupBindData", {
          id: this.rowNow.id,
          text
        });
        if (res.Code === 200) {

        } else {
          this.$message.error(res.message);
        }
        this.onLoad();
        this.formDatadialogTableVisible = false;
      },
      selectionChange(list) {
        // 自动处理　添加了还是删除了

        this.selectData = list;
        console.log(list);
        // this.$message.success('选中的数据'+ JSON.stringify(list));
      },
      formDataBind(row) {
        // console.log(row);
        this.rowNow = row.row;
        try {
          this.$refs.crud.toggleSelection();
        } catch (e) {
        }
        this.selectedForm();
        this.formDatadialogTableVisible = true;
      },
      selectedForm() {
        // 把已选择的选上
        // console.log(this.rowNow.text);
        let arText = this.rowNow.text.split(",");
        let ar = this.formData.filter(v => {
          return arText.indexOf(v.id.toString()) >= 0;
        });
        setTimeout(() => {
          if (ar.length > 0) {
            this.$refs.crud.toggleSelection(ar);
          } else {
            this.$refs.crud.toggleSelection();
          }
        }, 200);
      },
      async formDataonLoad(page) {
        // console.log(this.page);
        let res = await this.api("index/datalist", {
          page: this.formDatapage.currentPage,
          pid: "all",
        });

        this.formDatapage.total = res.Result.total;
        this.formDatapage.pageSize = res.Result.per_page;
        this.formData = res.Result.data;
        this.selectedForm();
      },

      async addSubmit(args, done) {
        console.log(args);
        done();

        let res = await this.api("index/groupadd", {
          id: this.modify,
          name: args.name,
          open: args.open == true || args.open == "" ? 1 : 0,
        });

        if (res.Code === 200) {
          this.onLoad();
          this.addDialogTableVisible = false;
        } else {
          this.$message.error(res.message);
        }
      },
      async handleChange(row) {
        let res = await this.api("index/groupChange", {
          id: row.row.id,
          open: !row.row.open,
        });
        this.onLoad();
      },
      async onLoad(page) {
        // console.log(this.page);
        this.loading = true;
        let res = await this.api("index/grouplist", {
          page: this.page.currentPage
        });
        this.loading = false;
        this.page.total = res.Result.total;
        this.page.pageSize = res.Result.per_page;

        this.data = [];
        res.Result.data.forEach(val => {
          val.open = val.open == 0 ? false : true;
          this.data.push(val);
        });
        //
        // this.data = res.Result.data;
      },
      async handleCopy(row) {
        this.rowNow = row.row;
        let insertRow = {...row.row};
        insertRow.inid = "in_" + Math.ceil(Math.random() * 9999999);
        this.data.splice(row.index + 1, 0, insertRow);
        try {
          let result = await this.api("index/groupcopy", insertRow);
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
          let res = await this.api("index/groupdelete", {
            id: scope.row.id
          });
          if (res.Code != 200) {
            throw new Error(result.Message);
          }
          this.onLoad();
        }).catch((e) => {
          // this.$message.error('删除失败')
        })
      },
      addData() {
        this.modify = 0;
        this.addDialogTableVisible = true;
        this.addOption.submitText = "添加";
        this.addObj = {
          name: "",
          open: true,
        };
      },
      modifyData(row) {
        this.modify = row.row.id;
        // console.log(row);
        this.addObj = {
          name: row.row.name,
          open: row.row.open == 1 ? true : false,
        };
        this.addOption.submitText = "修改";
        // console.log(this.addObj);
        this.addDialogTableVisible = true;
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
