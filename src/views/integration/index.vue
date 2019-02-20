<template>
  <div class="integration">
    <!---查询区域-->
    <div class="search-box">
      集成方案名称
      <el-input v-model="page.map.name" placeholder="请输入搜索内容" @keypress.enter.native="search" style="margin:0 12px" />
      <el-button type="primary" @click="search">查询</el-button>
      <!-- <div style="marginTop: 20px">
        <el-button type="primary" @click="add()">添加
        </el-button>
        <el-button :disabled="sels.length === 0" type="danger" @click="delGroup">批量删除
        </el-button>
      </div> -->
    </div>
    <div class="table-box">
      <el-table ref="table" :data="tableData" :border="true" stripe style="width: 100%" @row-click="handleSelCurrentChange" @selection-change="selsChange">
        <el-table-column type="index" label="序号" width="50px" align="center" />
        <el-table-column v-for="item in column" :key="item.prop" :prop="item.prop" :label="item.label" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="item.hasMap">{{map.product_id[scope.row[item.prop]]}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="140">
          <template slot-scope="scope">
            <div>
              <a class="abtn" @click="showModel('detail',scope.row)">详情</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination :page-size="page.size" :total="page.total" style="float: right;margin-right: 2%" layout="prev, pager, next,total" @current-change="handleCurrentChange" @current-page="page.current" />
    <!--新增编辑对话框-->
    <el-dialog :title="dialogTitle" :visible.sync="addDialog" @close="dialogClose">
      <el-form ref="form" :model="model" :rules="rule" label-width="150px" style="width: 80%">
        <el-form-item label="主商品ID" prop="main_id">
          <el-input v-model="model.main_id" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="规格" prop="main_specification">
          <el-input v-model="model.main_specification" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="水平数量" prop="main_level">
          <el-input v-model="model.main_level" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="垂直数量" prop="main_vertical">
          <el-input v-model="model.main_vertical" placeholder="请输入备注" />
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
      <div class="params-table">
        <el-table :data="table" :span-method="arraySpanMethod" border style="width: 100%" header-row-class-name="table-head">

          <el-table-column prop="classification" label="Classification" />
          <el-table-column prop="name" label="name" />
          <!-- <template slot-scope="scope">
              <el-input v-if="scope.row.isInput" v-model="scope.row.name"></el-input>
              <span v-else>{{ scope.row.name }}</span>
            </template> -->
          <el-table-column prop="brand" label="Brand" />
          <el-table-column prop="specifications" label="Specifications">
            <template slot-scope="scope">
              <span v-if="scope.row.specifications">{{scope.row.specifications[0]}}&nbsp;*&nbsp;{{ scope.row.specifications[1] }}</span>
              <span v-else>none</span>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="Number">
            <template slot-scope="scope">
              <span v-if="!(scope.row.isMain||scope.row.isInput)">{{scope.row.number}}</span>
              <span v-else>{{ level*vertical }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="isSize" label="Screen Size" align="center">
            <template slot-scope="scope">
              <span class="size">{{ scope.row.specifications[0]*level }}&nbsp;*&nbsp;{{ scope.row.specifications[1]*vertical }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import integrationApi from '@/api/integrationApi';
import { queryMany } from '@/api/common';

import integrationEntity from '@/entity/integrationEntity';
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
      model: integrationEntity.model,
      reset: Object.assign({}, integrationEntity.model),
      column: integrationEntity.tableColumn,
      page: {
        current: 1,
        map: { name: '' },
        size: 10,
        total: 0
      },
      rule: {
        // 根据自己需要添加校验规则
      },
      // 恢复集成方案详情部分
      specMap: {},
      main: [],
      curMain: {
        specifications: [300, 200]
      },
      level: 0,
      vertical: 0,
      mainId: '',
      ids: [],
      relatedListMap: {},
      lastRow: {},
      table: [],
      schemeName: {
        classification: 'Scheme name',
        name: '',
        isInput: true
      },
      remarks: {
        classification: 'Remarks',
        name: '',
        isInput: true
      },
      relatedList: [],
      swichDialog: false,
      list: []
    }
  },
  computed: {
    map() {
      return this.$store.getters.map;
    }
  },
  created() {
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
      integrationApi.batchDelete(ids).then(response => {
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
      integrationApi.queryPageList(this.page).then(response => {
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
      })
    },
    showModel(guide, row) {
      if (guide === 'detail') {
        this.isEdit = false;
        this.detailDialog = true;
        this.model = Object.assign({}, row);
        this.table = [];
        this.recover();
      } else if (guide === 'edit') {
        this.dialogTitle = '修改';
        this.isEdit = true;
        this.addDialog = true;
        this.model = Object.assign({}, row);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) { // 编辑
            integrationApi.update(this.model).then(response => {
              if (response.code === 0) {
                this.$message.success('修改成功');
                this.isEdit = false;
                this.initPageData(this.page.current);
                this.addDialog = false;
              } else {
                this.$message.error(`修改失败：${response.message}`);
              }
            }).catch(() => {
              this.$message.error('修改失败.');
            })
          } else { // 新增
            integrationApi.create(this.model).then(response => {
              if (response.code === 0) {
                this.$message.success('添加成功');
                this.initPageData(this.page.current);
                this.addDialog = false;
              } else {
                this.$message.error(`添加失败：${response.message}`)
              }
            }).catch(() => {
              this.$message.error('添加失败.')
            })
          }
        } else {
          this.$message.error('请检查填写数据.')
        }
      })
    },
    // 重置
    resetForm(formName) {
      if (!this.isEdit) {
        // this.$refs[formName].clearValidate();
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
    },
    // 恢复集成方案详情
    async recover() {
      const data = Object.assign({}, this.model);
      this.mainId = data.main_id;

      this.level = data.main_level;
      this.vertical = data.main_vertical;
      const related = data.related_list ? JSON.parse(data.related_list) : [];
      this.ids = related.map(item => item.id);
      this.schemeName.name = data.name;
      this.remarks.name = data.remark;
      this.ids.push(this.mainId);
      const res = await queryMany('product', this.ids);
      let main;
      if (res.code === 0) {
        for (let i = 0; i < res.data.length; i++) {
          if (this.mainId === res.data[i].id) {
            main = res.data.splice(i, 1)[0];
            break;
          }
        }
        res.data.forEach((item, index) => {
          this.setRelatedListMap(this.map.classification_id[item.classification_id]);
          const obj = this.setProduct(item);
          obj.number = related[index].number;
          this.relatedList.push(obj);
        })
      }
      this.curMain = this.setProduct(main, data.main_specification.split('*'));
      this.setTable();
    },
    setProduct(pro, specification) {
      return {
        id: pro.id,
        name: pro.name,
        classification: this.map.classification_id[pro.classification_id],
        brand: this.map.brand_id[pro.brand_id],
        specifications: specification || pro.specifications.split('*'),
        isMain: pro.is_main,
      }
    },
    setRelatedListMap(classification) {
      if (this.relatedListMap[classification]) {
        this.relatedListMap[classification]++;
      } else {
        this.relatedListMap[classification] = 1;
      }
    },
    // 组装表格数据
    setTable() {
      let arr = [];
      arr.push(this.curMain);

      this.relatedList.sort((a, b) => a.classification > b.classification);

      arr = arr.concat(this.relatedList);
      arr.push(this.schemeName);
      arr.push(this.remarks);
      this.table = arr.concat();
      arr = null;
    },
    // 条件合并行或列
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.isMain) {
        if (column.property === 'isSize') {
          return [this.table.length, 1];
        }
      } else if (row.isInput) {
        if (column.property === 'classification') {
          return [1, 1];
        } else if (column.property === 'name') {
          return [1, 4];
        }
        return [0, 0];
      } else {
        if (column.property === 'classification') {
          if (this.lastRow.id !== row.id) {
            if (this.lastRow.classification === row.classification) {
              return [0, 0];
            }
            this.lastRow = Object.assign({}, row);
          }
          return [this.relatedListMap[row.classification], 1];
        } else if (column.property === 'isSize') {
          return [0, 0];
        }
        return [1, 1];
      }
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
<style rel="stylesheet/scss" lang="scss">
.integration {
  .el-slider__runway {
    height: 3px;
    margin: 18px 0 0;
  }
  .el-slider__bar {
    background-color: rgba(0, 0, 0, 0.4);
    height: 3px;
  }
  .el-slider__button {
    background: url("../../assets/img/slide.png") no-repeat 0 0;
    border: none;
    width: 8px;
    height: 15px;
    border-radius: 0;
  }
  .el-table_1_column_1 {
    background-color: #f2f2f2;
  }
  .table-head th {
    background-color: #000;
    color: #fafafa;
    font-weight: normal;
    border-color: #000;
  }
  .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td:not(.el-table_1_column_1) {
    background-color: transparent;
  }
  .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table_1_column_1 {
    background-color: #f2f2f2;
  }
}
