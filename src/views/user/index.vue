<template>
  <div>
    <!---查询区域-->
    <div class="search-box">
      用户账号
      <el-input v-model="page.map.username" placeholder="请输入搜索内容" @keypress.enter.native="search" style="margin:0 12px" />
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

        <el-form-item label="账号" prop="username">
          <el-input v-model="model.username" autocomplete="off" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="model.password" autocomplete="off" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="real_name">
          <el-input v-model="model.real_name" autocomplete="off" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="model.phone" autocomplete="off" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" autocomplete="off" placeholder="请输入邮箱" />
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

        <el-form-item label="账号" prop="username">
          <el-input v-model="model.username" readonly />
        </el-form-item>
        <el-form-item label="姓名" prop="real_name">
          <el-input v-model="model.real_name" readonly />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="model.phone" readonly />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" readonly />
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
import userApi from '@/api/userApi';
import userInfo from '@/entity/userEntity';
export default {
  data() {
    return {
      dialogTitle: '添加',
      sels: [],
      addDialog: false,
      detailDialog: false,
      deleteDialog: false,
      editDialog: false,
      isEdit: false,
      tableData: [],
      model: userInfo.model,
      reset: Object.assign({}, userInfo.model),
      column: userInfo.tableColumn,
      page: {
        current: 1,
        map: { username: '' },
        size: 10,
        total: 0
      },
      rule: {
        // 根据自己需要添加校验规则
      }
    };
  },
  created() {
    // 获取当前用户信息
    this.reset.modification_user_id = this.$store.getters.token;
    this.model.modification_user_id = this.$store.getters.token;

    this.initPageData();
  },
  methods: {
    search() {
      this.page.current = 1;
      this.initPageData();
    },
    add() {
      this.addDialog = true;
      this.dialogTitle = '添加';
    },
    remove() {
      var ids = this.sels.map(item => item.id)// 获取所有选中行的id组成的字符串，以逗号分隔
      userApi.batchDelete(ids).then(response => {
        if (response.code === 0) {
          this.$message.success('删除成功');
          this.initPageData(this.page.current);
          this.deleteDialog = false;
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.error('删除失败.');
      })
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
      userApi.queryPageList(this.page).then(response => {
        this.tableData = [];
        if (response.code === 0) {
          this.page.total = response.data.total;
          this.tableData = response.data.records;
        } else {
          this.tableData = [];
          this.page.total = 0;
        }
        if (this.$refs.form) {
          this.$refs.table.clearSelection();
          this.resetForm('form');
        }

      });
    },
    showModel(guide, row) {
      if (guide === 'detail') {
        this.isEdit = false;
        this.detailDialog = true;
        this.model = Object.assign({}, row);
      } else if (guide === 'edit') {
        this.dialogTitle = '修改';
        this.isEdit = true;
        this.addDialog = true;
        this.model = Object.assign({}, row);
        this.model.password = '';
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) { // 编辑
            userApi.update(this.model).then(response => {
              if (response.code === 0) {
                this.$message.success('修改成功');
                this.initPageData(this.page.current);
                this.addDialog = false;
              } else {
                this.$message.error(`修改失败：${response.msg}`);
              }
            }).catch(() => {
              this.$message.error('修改失败.');
            });
          } else { // 新增
            userApi.create(this.model).then(response => {
              if (response.code === 0) {
                this.$message.success('添加成功');
                this.initPageData(this.page.current);
                this.addDialog = false;
              } else {
                this.$message.error(`添加失败：${response.msg}`);
              }
            }).catch(() => {
              this.$message.error('添加失败.');
            });
          }
        } else {
          this.$message.error('请检查填写数据.');
        }
      });
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
};
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

