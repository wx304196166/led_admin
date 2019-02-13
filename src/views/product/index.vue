<template>
  <div class="app-container">
    <!---查询区域-->
    <div class="search-box">
      产品名称
      <el-input v-model="page.map.name" placeholder="请输入搜索内容" @keypress.enter.native="search" style="margin:0 12px" />
      <el-button type="primary" @click="search">查询</el-button>
      <div style="marginTop: 20px">
        <el-button type="primary" @click="toDetail()">添加
        </el-button>
        <el-button :disabled="sels.length === 0" type="danger" @click="delGroup">批量删除
        </el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table ref="table" :data="tableData" :border="true" stripe style="width: 100%" @row-click="handleSelCurrentChange" @selection-change="selsChange">
        <el-table-column type="index" label="序号" width="50px" align="center" />
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="item.hasMap">{{getName(scope.row[item.prop],item.prop)}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="140">
          <template slot-scope="scope">
            <div>
              <!-- <a class="abtn" @click="toDetail(scope.row.id,1)">详情</a> | -->
              <a class="abtn" @click="toDetail(scope.row.id,1)">修改</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination :page-size="page.size" :total="page.total" style="float: right;margin-right: 2%" layout="prev, pager, next,total" @current-change="handleCurrentChange" @current-page="page.current" />

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
import productApi from '@/api/productApi';
import { queryAll } from '@/api/common';
import productEntity from '@/entity/productEntity';

export default {
  data() {
    return {
      sels: [],
      
      addDialog: false,
      detailDialog: false,
      deleteDialog: false,
      editDialog: false,
      isEdit: 0,
      tableData: [],
      column: productEntity.tableColumn,
      map: {
        classification_id: {},
        brand_id: {},
        label_id: {},
        product_id: {}
      },

      page: {
        current: 1,
        map: { name: '' },
        size: 10,
        total: 0
      }
    };
  },
  created() {
    this.map = this.$store.getters.map;
    this.map.is_main = ['否', '是'];
    this.initPageData();
  },
  methods: {
    getName(ids, prop) {
      switch (typeof ids) {
        case 'string':
          const arr = [];
          for (let item of ids.split(',')) {
            arr.push(this.map[prop][item]);
          }
          return arr.join(',');
        case 'number': return this.map[prop][ids];
        default: return '';
      }
    },

    search() {
      this.page.current = 1;
      this.initPageData();
    },
    toDetail(id = '', isEdit = 0) {
      sessionStorage.setItem('productId', id);
      sessionStorage.setItem('productEditStatus', isEdit);
      this.$store.dispatch('SetMap');
      this.$router.push({ path: '/products/productDetail' });
    },
    remove() {
      var ids = this.sels.map(item => item.id);
      productApi.batchDelete(ids).then(response => {
        if (response.code === 0) {
          this.$message.success('删除成功');
          this.initPageData(this.page.current);
          this.deleteDialog = false;
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.error('删除失败.');
      });
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
      productApi.queryPageList(this.page).then(response => {
        this.tableData = [];
        if (response.code === 0) {
          this.page.total = response.data.total;
          this.tableData = response.data.records;
        } else {
          this.tableData = [];
          this.page.total = 0;
        }
        this.$refs.table.clearSelection();
      });
    },
    showModel(guide, row) {
      if (guide === 'detail') {
        this.isEdit = 0;
        this.detailDialog = true;
        this.model = Object.assign({}, row);
      } else if (guide === 'edit') {
        this.dialogTitle = '修改';
        this.isEdit = 1;
        this.addDialog = true;
        this.model = Object.assign({}, row);
      }
    },

    selsChange(sels) {
      this.sels = sels;
    },
    delGroup() {
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
  margin: 0 0 20px;
  font-size: 16px;
}
.table-box {
  margin-bottom: 20px;
}
.abtn {
  color: #5e9eff;
}
</style>

