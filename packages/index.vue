<template>
  <div class="form-designer">
    <el-container>
      <!-- 左侧字段 -->
      <el-aside :width="leftWidth">
        <div class="fields-list">
          <div v-for="(field, index) in fields"
               :key="index">
            <div v-if="!field.disabled">
              <div class="field-title">{{field.title}}</div>
              <draggable tag="ul"
                         :list="field.list"
                         :group="{ name: 'form', pull: 'clone', put: false }"
                         ghost-class="ghost"
                         :sort="false">
                <li class="field-label"
                    v-for="(item, index) in field.list"
                    :key="index">
                  <a>
                    <i class="icon iconfont"
                       :class="item.icon"></i>
                    <span>{{item.label}}</span>
                  </a>
                </li>
              </draggable>
            </div>
            <div v-else>
              <div class="field-title">{{field.title}}
                <span class="danger">（开发中）</span>
              </div>
              <ul>
                <li class="field-label-disabled"
                    v-for="(item, index) in field.list"
                    :key="index">
                  <a>
                    <i class="icon iconfont"
                       :class="item.icon"></i>
                    <span>{{item.label}}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-aside>
      <!-- 中间主布局 -->
      <el-container class="widget-container"
                    direction="vertical">
        <el-header class="widget-container-header">

          <!--<el-button type="text"
                     size="medium"
                     icon="el-icon-document"
                     @click="handleAvueDoc">表单列表</el-button>
          <el-button type="text"
                     size="medium"
                     icon="el-icon-document"
                     @click="handleAvueDoc">数据源列表</el-button>
          <el-button type="text"
                     size="medium"
                     icon="el-icon-document"
                     @click="handleAvueDoc">组件列表</el-button>
                     <el-button type="text"
                     size="medium"
                     icon="el-icon-document"
                     @click="handleAvueDoc">可用范围列表</el-button>-->



          <el-button type="text"
                     size="medium"
                     icon="el-icon-document"
                     @click="handleAvueDoc">Avue文档</el-button>

          <el-button type="text"
                     size="medium"
                     icon="el-icon-upload2"
                     @click="importJsonVisible = true">导入JSON</el-button>
          <el-button type="text"
                     size="medium"
                     icon="el-icon-download"
                     @click="handleGenerateJson">生成JSON</el-button>
          <el-button type="text"
                     size="medium"
                     icon="el-icon-view"
                     @click="handlePreview">预览</el-button>
          <el-button class="danger"
                     type="text"
                     size="medium"
                     icon="el-icon-delete"
                     @click="handleClear">清空</el-button>


        <el-button 
                     type="danger"
                     size="medium"
                     icon="el-icon-circle-check"
                     @click='$router.replace({"name":"formlist"})'>返回</el-button>

        <el-button 
                     type="success"
                     size="medium"
                     icon="el-icon-circle-check"
                     @click="handleSave">保存</el-button>

<el-form ref="form" label-width="80px">
<el-form-item label="表单名:">
    <el-input v-model="name" placeholder="请输入表单名"></el-input>
  </el-form-item>
</el-form>
          

          <!--<avue-form :option="formOption" v-model="formObj" :menuBtn="false"></avue-form>-->

        </el-header>
        <el-main :style="{background: widgetForm.column.length == 0 ? `url(${widgetEmpty}) no-repeat 50%`: ''}">
          <widget-form ref="widgetForm"
                       :data="widgetForm"
                       :select.sync="widgetFormSelect"></widget-form>
        </el-main>
      </el-container>
      <!-- 右侧配置 -->
      <el-aside class="widget-config-container"
                :width="asideRightWidth">
        <el-tabs v-model="configTab"
                 stretch>
          <el-tab-pane label="字段属性"
                       name="widget"
                       style="padding: 0 10px;">
            <widget-config :data="widgetFormSelect"></widget-config>
          </el-tab-pane>
          <el-tab-pane label="表单属性"
                       name="form"
                       lazy
                       style="padding: 0 10px;">
            <form-config :data="widgetForm"></form-config>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <!-- 弹窗 -->
      <!-- 导入JSON -->
      <el-drawer title="导入JSON"
                 :visible.sync="importJsonVisible"
                 size="50%"
                 destroy-on-close>
        <v-json-editor v-model="importJson"
                       height="82vh"></v-json-editor>
        <div class="drawer-foot">
          <el-button size="medium"
                     type="primary"
                     @click="handleImportJsonSubmit">确定</el-button>
          <el-button size="medium"
                     type="danger"
                     @click="importJsonVisible = false">取消</el-button>
        </div>
      </el-drawer>
      <!-- 生成JSON -->
      <el-drawer title="生成JSON"
                 :visible.sync="generateJsonVisible"
                 size="50%"
                 destroy-on-close>
        <v-json-editor v-model="widgetFormPreview"
                       height="82vh"></v-json-editor>
        <div class="drawer-foot">
          <el-button size="medium"
                     type="primary"
                     @click="handleGenerate">生成</el-button>
          <el-button size="medium"
                     type="primary"
                     @click="handleCopy">复制</el-button>
        </div>
      </el-drawer>
      <!-- 预览 -->
      <el-drawer title="预览"
                 :visible.sync="previewVisible"
                 size="60%"
                 :before-close="handleBeforeClose">
        <avue-form v-if="previewVisible"
                   ref="form"
                   class="preview-form"
                   :option="widgetFormPreview"
                   v-model="widgetModels"></avue-form>
        <div class="drawer-foot">
          <el-button size="medium"
                     type="primary"
                     @click="handlePreviewSubmit">确定</el-button>
          <el-button size="medium"
                     type="danger"
                     @click="handleBeforeClose">取消</el-button>
        </div>
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import VJsonEditor from 'v-jsoneditor'
import fields from './fieldsConfig.js'
import WidgetForm from './WidgetForm'
import FormConfig from './FormConfig'
import WidgetConfig from './WidgetConfig'
import widgetEmpty from './assets/widget-empty.png'

export default {
  name: "FormDesign",
  components: { Draggable, VJsonEditor, WidgetForm, FormConfig, WidgetConfig },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          column: []
        }
      }
    },
    storage: {
      type: Boolean,
      default: true
    },
    asideLeftWidth: {
      type: [String, Number],
      default: '270px'
    },
    asideRightWidth: {
      type: [String, Number],
      default: '380px'
    }
  },
  watch: {
    name(val){
      localStorage.setItem("name",val);
    },
    widgetForm: {
      handler (val) {
        if (this.storage) {
          if (val.column && val.column.length > 0 || true) {
            localStorage.setItem("name",this.name);
            localStorage.setItem('avue-form', JSON.stringify(val))
          }
          else localStorage.removeItem('avue-form')
        }
      },
      deep: true
    },
    options: {
      handler (val) {
        this.transAvueOptionsToFormDesigner(val).then(res => {
          this.widgetForm = { ...this.widgetForm, ...res }
        })
      },
      deep: true
    }
  },
  computed: {
    leftWidth () {
      if (typeof this.asideLeftWidth == 'string') {
        return this.asideLeftWidth
      } else {
        return `${this.asideLeftWidth}px`
      }
    },
    rightWidth () {
      if (typeof this.asideRightWidth == 'string') {
        return this.asideRightWidth
      } else {
        return `${this.asideRightWidth}px`
      }
    }
  },
  data () {
    return {
      // 当前表单名
      id:this.$route.params.id || 0,
      name:this.$route.params.name || (localStorage.getItem("name") || ""),
      widgetEmpty,
      fields,
      widgetForm: {
        column: [],
        labelPosition: 'left',
        labelSuffix: '：',
        labelWidth: 120,
        gutter: 0,
        menuBtn: true,
        submitBtn: true,
        submitSize: 'medium',
        submitText: '提交',
        emptyBtn: true,
        emptySize: 'medium',
        emptyText: '清空',
        menuPosition: 'center'
      },
      widgetFormPreview: {},
      configTab: 'widget',
      widgetFormSelect: {},
      previewVisible: false,
      generateJsonVisible: false,
      importJsonVisible: false,
      importJson: {},
      widgetModels: {},
      // now form obj
      formObj:{},
      // now form edit
      formOption:{
        column: [
//表单名：
          // {
          // label: '作用域',
          // prop: 'select',
          // type: 'select',
          // // drag: true,
          // multiple: true,
          // dicData: [{
          //     value: 'Shanghai',
          //     label: '上海'
          //   }, {
          //     value: 'Beijing',
          //     label: '北京'
          //   }, {
          //     value: 'Shenzhen',
          //     label: '深圳'
          //   }]
          // },
          {
              label: "表单名",
              prop: "name",
              span:50
          },
        ]
      },
    }
  },
  mounted () {
    // console.log(this.$route.params);
    this.handleLoadCss();
    this.handleLoadStorage();
    // this.handleAutoSave(); //delete
    this.$nextTick(()=>{
      if(this.$route.params.text){
        this.widgetForm = JSON.parse(this.$route.params.text);
      }
      // add
      // console.log(this.$route.query.action);
      if(this.$route.query.action=="add") {
        // this.name="";
        // this.widgetForm = [];
      }else{
        
      }
    });
  },
  methods: {
    // delete 自动保存 now use watch not use autoHandle
    // handleAutoSave(){
    //   setInterval(()=>{
    //     if (this.storage) {
    //       // console.log("auto save",this.widgetForm);
    //       if (this.widgetForm.column && this.widgetForm.column.length > 0) {
    //         localStorage.setItem("name",this.name);
    //         localStorage.setItem('avue-form', JSON.stringify(this.widgetForm));
    //       }
    //     }
    //   },5000);
    // },
    // 保存
    async handleSave(){
      // console.log(this.name);
      if(!this.name) {
        this.$message.error("表单名不能为空～！");
        return;
      }

      let res = await this.api("index/formadd",{
        id:this.id,
        name:this.name,
        text:JSON.stringify(this.widgetForm),
        scope_id:this.$route.params.scope_id || (this.$route.query.scope_id || 0),
        data_id:this.$route.params.data_id || (this.$route.query.data_id || 0),
      })

      // return;
      // clear autoSave localStorage
      localStorage.removeItem("name");
      localStorage.removeItem("avue-form");
      this.$router.replace({"name":"formlist"});
    },
    // 组件初始化时加载本地存储中的options(需开启storage),若不存在则读取用户配置的options
    handleLoadStorage () {
      if (this.storage) {
        const form = localStorage.getItem('avue-form');
        if (form) this.widgetForm = JSON.parse(form)
      } else {
        this.transAvueOptionsToFormDesigner(this.options).then(res => {
          this.widgetForm = { ...this.widgetForm, ...res }
        })
      }
    },
    // 加载阿里iconfront
    handleLoadCss () {
      const url = '//at.alicdn.com/t/font_1254447_rwaizg76pz.css'
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      window.document.head.appendChild(link)
    },
    // Avue文档链接
    handleAvueDoc () {
      window.open('https://avuejs.com/doc/form/form-doc', '_blank')
    },
    // 预览 - 弹窗
    handlePreview () {
      if (!this.widgetForm.column || this.widgetForm.column.length == 0) this.$message.error("没有需要展示的内容")
      else {
        this.transformToAvueOptions(this.widgetForm).then(data => {
          this.widgetFormPreview = data
          this.previewVisible = true
        })
      }
    },
    // 导入JSON - 弹窗 - 确定
    handleImportJsonSubmit () {
      try {
        this.transAvueOptionsToFormDesigner(this.importJson).then(res => {
          this.widgetForm = res
          this.importJsonVisible = false
        })
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    // 生成JSON - 弹窗
    handleGenerateJson () {
      this.transformToAvueOptions(this.widgetForm).then(data => {
        this.widgetFormPreview = data
        this.generateJsonVisible = true
      })
    },
    // 生成JSON - 弹窗 - 确定
    handleGenerate () {
      this.transformToAvueOptions(this.widgetForm).then(data => {
        this.$emit('submit', data)
      })
    },
    // 生成JSON - 弹窗 - 拷贝
    handleCopy () {
      this.$Clipboard({
        text: JSON.stringify(this.widgetFormPreview, null, 2)
      }).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      });
    },
    // 预览 - 弹窗 - 确定
    handlePreviewSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) this.$alert(this.widgetModels).catch(() => {
        })
      })
    },
    // 预览 - 弹窗 - 关闭前
    handleBeforeClose () {
      this.$refs.form.resetForm();
      this.previewVisible = false
    },
    // 清空
    handleClear () {
      if (this.widgetForm && this.widgetForm.column && this.widgetForm.column.length > 0) {
        this.$confirm('确定要清空吗？', '警告', {
          type: 'warning'
        }).then(() => {
          this.widgetForm = { column: [] }
          this.widgetFormSelect = {}
        }).catch(() => {
        })
      } else this.$message.error("没有需要清空的内容")
    },
    // 表单设计器配置项 转化为 Avue配置项
    transformToAvueOptions (obj) {
      return new Promise((resolve, reject) => {
        try {
          const data = this.deepClone(obj)
          for (let i = 0; i < data.column.length; i++) {
            const col = data.column[i]
            if (col.type == 'dynamic' && col.children && col.children.column && col.children.column.length > 0) {
              const c = col.children.column;
              c.forEach(item => {
                delete item.subfield
              })
              this.transformToAvueOptions(col.children).then(res => {
                col.children = res
              })
            } else if (col.type == 'group') {
              if (!data.group) data.group = []

              const group = {
                label: col.label,
                icon: col.icon,
                prop: col.prop,
              }
              this.transformToAvueOptions(col.children).then(res => {
                group.column = res.column
                data.group.push(group)
              })
              data.column.splice(i, 1)
              i--
            } else if (['checkbox', 'radio', 'tree', 'cascader', 'select'].includes(col.type)) {
              if (col.dicOption == 'static') {
                delete col.dicUrl
                delete col.dicMethod
                delete col.dicQuery
              } else if (col.dicOption == 'remote') {
                delete col.dicData
                if (col.dicQuery && col.dicQuery.length > 0) {
                  const query = {}
                  col.dicQuery.forEach(q => {
                    if (q.key && q.value) query[q.key] = q.value
                  })
                  col.dicQuery = query
                } else delete col.dicQuery
              }
              delete col.dicOption
            } else if (['upload'].includes(col.type)) {
              if (col.headers && col.headers.length > 0) {
                const headers = {}
                col.headers.forEach(h => {
                  if (h.key && h.value) headers[h.key] = h.value
                })
                col.headers = headers
              }

              if (col.data && col.data.length > 0) {
                const data = {}
                col.data.forEach(h => {
                  if (h.key && h.value) data[h.key] = h.value
                })
                col.data = data
              }
            }
          }
          resolve(data)
        } catch (e) {
          reject(e)
        }
      })
    },
    // Avue配置项 转化为 表单设计器配置项
    transAvueOptionsToFormDesigner (obj) {
      const data = this.deepClone(obj)
      return new Promise((resolve, reject) => {
        try {
          if (data.column && data.column.length > 0) {
            data.column.forEach(col => {
              if (col.type == 'dynamic' && col.children && col.children.column && col.children.column.length > 0) {
                const c = col.children.column;
                c.forEach(item => {
                  item.subfield = true
                })
                this.transAvueOptionsToFormDesigner(col.children).then(res => {
                  col.children = res
                })
              } else if (['checkbox', 'radio', 'tree', 'cascader', 'select'].includes(col.type)) {
                if (!col.dicData && col.dicQuery && typeof col.dicQuery == 'object') {
                  const arr = []
                  for (let key in col.dicQuery) {
                    arr.push({
                      key,
                      value: col.dicQuery[key],
                      $cellEdit: true
                    })
                  }
                  col.dicQuery = arr
                }
                if (col.dicUrl) col.dicOption = 'remote'
                else col.dicOption = 'static'
                if (!col.dicData) col.dicData = []
              } else if (['upload'].includes(col.type)) {
                if (col.headers && typeof col.headers == 'object') {
                  const arr = []
                  for (let key in col.headers) {
                    arr.push({
                      key,
                      value: col.headers[key],
                      $cellEdit: true
                    })
                  }
                  col.headers = arr
                }

                if (col.data && typeof col.data == 'object') {
                  const arr = []
                  for (let key in col.data) {
                    arr.push({
                      key,
                      value: col.data[key],
                      $cellEdit: true
                    })
                  }
                  col.data = arr
                }
              }
            })
          } else if (data.group && data.group.length > 0) {
            for (let i = 0; i < data.group.length; i++) {
              if (!data.column) data.column = []
              const col = data.group[i]

              const group = {
                type: 'group',
                label: col.label,
                icon: col.icon,
                prop: col.prop,
              }
              this.transAvueOptionsToFormDesigner(col).then(res => {
                group.children = res
                data.column.push(group)
              })
            }
            delete data.group
          }
          resolve(data)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "./styles/index.scss";
</style>
