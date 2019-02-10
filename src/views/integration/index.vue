<template>
  <div>
    <!---查询区域-->
    <div class="search-box">
      品牌名称
      <el-input v-model="page.map.name" placeholder="请输入搜索内容" @keypress.enter.native="search" style="margin:0 12px"/>
      <el-button type="primary" @click="search">查询</el-button>
      <div style="marginTop: 20px">
        <el-button type="primary" @click="add()">添加
        </el-button>
        <el-button :disabled="sels.length === 0" type="danger" @click="delGroup">批量删除
        </el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table ref="table" :data="tableData" :border="true" stripe style="width: 100%" @row-click="handleSelCurrentChange" @selection-change="selsChange">
        <el-table-column type="index" label="序号" width="50px" align="center" />
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true" />
<<<<<<< HEAD
=======
          
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
        <el-table-column fixed="right" align="center" label="操作" width="140">
          <template slot-scope="scope">
            <div>
              <a class="abtn" @click="showModel('detail',scope.row)">详情</a> |
              <a class="abtn" @click="showModel('edit',scope.row)">修改</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination :page-size="page.size" :total="page.total" style="float: right;margin-right: 2%" layout="prev, pager, next,total" @current-change="handleCurrentChange" @current-page="page.current" />
    <!--新增编辑对话框-->
    <el-dialog :title="dialogTitle" :visible.sync="addDialog" @close="dialogClose">
      <el-form ref="form" :model="model" :rules="rule" label-width="150px" style="width: 80%">

<<<<<<< HEAD
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="model.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="model.remark" type="textarea" placeholder="请输入备注" />
=======
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="model.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="关联品牌" prop="brand_id">
          <el-select v-model="model.brand_id" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="(val,key) in map.brand_id" :key="key" :value="key" :label="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联标签" prop="label_id">
          <el-select v-model="model.label_id" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="(val,key) in map.label_id" :key="key" :value="key" :label="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="model.remark" type="textarea" placeholder="请输入" />
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-left: 20%;" type="primary" @click="submitForm('form')">确定</el-button>
        <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
        <el-button v-if="isEdit" @click="addDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!--查看对话框-->
    <el-dialog :visible.sync="detailDialog" title="查看详细信息" @close="dialogClose">
      <el-form ref="formDetail" label-width="150px" style="width: 80%">

<<<<<<< HEAD
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="model.name" readonly placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="model.remark" type="textarea" readonly placeholder="请输入备注" />
=======
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="model.name" readonly />
        </el-form-item>
        <el-form-item label="关联品牌" prop="brand_id">
          <el-input :value="getName(model.brand_id,'brand_id')" readonly />
        </el-form-item>
        <el-form-item label="关联标签" prop="label_id">
          <el-input :value="getName(model.label_id,'label_id')" readonly />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="model.remark" type="textarea" readonly />
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--删除对话框-->
    <el-dialog :visible.sync="deleteDialog" class="deleteDialog" title="删除确认" width="40%">
      <span style="text-align: center">确认要删除吗?</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="remove">确 定</el-button>
        <el-button @click="deleteDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
<<<<<<< HEAD
import brandApi from '@/api/brandApi'
import brandInfo from '@/entity/brandEntity'
=======
import classificationApi from '@/api/classificationApi';
import classficationEntity from '@/entity/classficationEntity';
import { queryAll } from '@/api/common';
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
export default {
  data() {
    return {
      dialogTitle: '添加',
      sels: [],
      importDialog: false,
      addDialog: false,
      detailDialog: false,
      deleteDialog: false,
      editDialog: false,
      isEdit: false,
      tableData: [],
<<<<<<< HEAD
      model: brandInfo.model,
      reset: Object.assign({}, brandInfo.model),
      column: brandInfo.tableColumn,
=======
      model: classficationEntity.model,
      reset: Object.assign({}, classficationEntity.model),
      column: classficationEntity.tableColumn,
      map: {
        brand_id: {},
        label_id: {}
      },

>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
      page: {
        current: 1,
        map: { name: '' },
        size: 10,
        total: 0
      },
      rule: {
        // 根据自己需要添加校验规则
      }
<<<<<<< HEAD
    }
  },
  created() {
    this.reset.modification_user_id = this.$store.getters.token
    this.initPageData()
  },
  methods: {
=======
    };
  },
  async created() {
    this.reset.modification_user_id = this.$store.getters.token;
    this.model.modification_user_id = this.$store.getters.token;
    let res = await queryAll('brand');
    if (res.code === 0) {
      res.data.forEach(item => {
        this.map.brand_id[item.id] = item.name;
      });
    } else {
      this.$message.error(res.message);
    }

    res = await queryAll('label');
    if (res.code === 0) {
      res.data.forEach(item => {
        this.map.label_id[item.id] = item.name;
      });
    } else {
      this.$message.error(res.message);
    }
    this.initPageData();

  },
  methods: {
    getName(ids, prop) {
      const arr = [];
      for (let item of ids) {
        arr.push(this.map[prop][item]);
      }
      return arr.join(',');
    },
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
    search() {
      this.page.current = 1;
      this.initPageData();
    },
    add() {
      this.addDialog = true;
      this.dialogTitle = '添加';
      this.resetForm('form');
    },
    remove() {
<<<<<<< HEAD
      var ids = this.sels.map(item => item.id)// 获取所有选中行的id组成的字符串，以逗号分隔
      brandApi.batchDelete(ids).then(response => {
=======
      var ids = this.sels.map(item => item.id);
      classificationApi.batchDelete(ids).then(response => {
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
        if (response.code === 0) {
          this.$message.success('删除成功');
          this.initPageData(this.page.current);
          this.deleteDialog = false;
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.error('删除失败.');
<<<<<<< HEAD
      })
=======
      });
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
    },
    // 关闭对话框清除文本框内容
    dialogClose() {
      this.resetForm('form');
    },
    // 切换页码
    handleCurrentChange(val) {
      this.page.current = val;
      this.initPageData();
    },
    // 初始化列表数据
    initPageData() {
<<<<<<< HEAD
      brandApi.queryPageList(this.page).then(response => {
        this.tableData = [];
        if (response.code === 0) {
          this.page.total = response.data.total;
=======
      classificationApi.queryPageList(this.page).then(response => {
        this.tableData = [];
        if (response.code === 0) {
          this.page.total = response.data.total;
          response.data.records.forEach(item => {
            for (const key in item) {
              if (this.map[key]) {
                item[key] = item[key].split(',');
              }
            }
          })
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
          this.tableData = response.data.records;
        } else {
          this.tableData = [];
          this.page.total = 0;
        }
        this.$refs.table.clearSelection();
<<<<<<< HEAD
      })
=======
      });
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
    },
    showModel(guide, row) {
      if (guide === 'detail') {
        this.isEdit = false;
        this.detailDialog = true;
        this.model = Object.assign({}, row);
<<<<<<< HEAD
      }
      if (guide === 'edit') {
=======
      }else if (guide === 'edit') {
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
        this.dialogTitle = '修改';
        this.isEdit = true;
        this.addDialog = true;
        this.model = Object.assign({}, row);
      }
<<<<<<< HEAD
      if (guide === 'delete') {
        this.isEdit = false;
        this.deleteDialog = true;
      }
=======
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) { // 编辑
<<<<<<< HEAD
            brandApi.update(this.model).then(response => {
=======
            classificationApi.update(this.model).then(response => {
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
              if (response.code === 0) {
                this.$message.success('修改成功');
                this.initPageData(this.page.current);
                this.addDialog = false;
              } else {
<<<<<<< HEAD
                this.$message.error(`修改失败：${response.msg}`);
=======
                this.$message.error(`修改失败：${response.msg}`)
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
              }
            }).catch(() => {
              this.$message.error('修改失败.');
            })
          } else { // 新增
<<<<<<< HEAD
            brandApi.create(this.model).then(response => {
=======
            const sendData = Object.assign({}, this.model);
            for (const key in sendData) {
              if (this.map[key]) {
                sendData[key] = sendData[key].join(',');
              }
            }
            classificationApi.create(this.model).then(response => {
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
              if (response.code === 0) {
                this.$message.success('添加成功');
                this.initPageData(this.page.current);
                this.addDialog = false;
              } else {
<<<<<<< HEAD
                this.$message.error(`添加失败：${response.msg}`)
              }
            }).catch(() => {
              this.$message.error('添加失败.')
            })
          }
        } else {
          this.$message.error('请检查填写数据.')
=======
                this.$message.error(`添加失败：${response.msg}`);
              }
            }).catch(() => {
              this.$message.error('添加失败.');
            });
          }
        } else {
          this.$message.error('请检查填写数据.');
>>>>>>> a638c9b681e1672156c6859a12e2c786fe4ef5c6
        }
      })
    },
    // 重置
    resetForm(formName) {
      if (!this.isEdit) {
        this.$refs[formName].clearValidate();
        this.model = Object.assign({}, this.reset);
      }
    },
    selsChange(sels) {
      this.sels = sels;
    },
    delGroup() {
      this.isEdit = false;
      this.deleteDialog = true;
    },
    handleSelCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.search-box {
  margin: 20px 0 20px 20px;
  font-size: 16px;
}
.table-box {
  padding: 0 20px 20px 20px;
}
.abtn {
  color: #5e9eff;
}
</style>

