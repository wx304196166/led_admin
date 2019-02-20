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
      </div>
    </div>
    <div class="table-box">
      <el-table ref="table" :data="tableData" :border="true" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="50px" align="center" />
        <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="item.hasMap">{{getName(scope.row[item.prop],item.prop)}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="140">
          <template slot-scope="scope">
            <div>
              <a class="abtn" @click="toDetail(scope.row.id,1)">修改</a> |
              <a class="abtn" @click="delGroup(scope.row)">删除</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination :page-size="page.size" :total="page.total" style="float: right;margin-right: 2%" layout="prev, pager, next,total" @current-change="handleCurrentChange" @current-page="page.current" />
   
  </div>

</template>

<script>
import productApi from '@/api/productApi';
import { queryAll } from '@/api/common';
import productEntity from '@/entity/productEntity';

export default {
  data() {
    return {
      isEdit: 0,
      tableData: [],
      column: productEntity.tableColumn,
      pageMap: {
        is_main: ['否', '是']
      },
      page: {
        current: 1,
        map: { name: '' },
        size: 10,
        total: 0
      }
    };
  },
  computed: {
    map() {
      return this.$store.getters.map;
    }
  },
  created() {
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
        case 'number': return this.pageMap[prop][ids];
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
      this.$store.dispatch('SetMap').then(() => {
        this.$router.push({ path: '/products/productDetail' });
      })
    },
    remove(row) {
      const arr=row.img_list?row.img_list.split(','):[];
      if(row.thumbnail){arr.push(row.thumbnail);}
      
      const sendData={
        id:row.id,
        imgs:arr
      };
      productApi.del(sendData).then(response => {
        if (response.code === 0) {
          this.$message.success('删除成功');
          this.initPageData(this.page.current);
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.error('删除失败.');
      });
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
      });
    },   

    delGroup(row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove(row);
      }).catch(() => {});
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

