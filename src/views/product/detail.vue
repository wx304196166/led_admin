<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="classification_id">
        <el-select v-model="model.classification_id" placeholder="请选择">
          <el-option v-for="(val,key) in map.classification_id" :key="key" :value="key" :label="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联品牌" prop="brand_id">
        <el-select v-model="model.brand_id" placeholder="请选择">
          <el-option v-for="(val,key) in map.brand_id" :key="key" :value="key" :label="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联标签" prop="label_id">
        <el-select v-model="model.label_id" placeholder="请选择">
          <el-option v-for="(val,key) in map.label_id" :key="key" :value="key" :label="val"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import productEntity from '@/entity/productEntity';
export default {
  props:{
    id:'',
    isEdit:false,
    map:{}
  },
  data() {
    return {
      deleteDialog: false,
      model: productEntity.model,
      reset: Object.assign({}, productEntity.model),
      
      rule: {
        // 根据自己需要添加校验规则
      }
    };
  },
  async created() {
    this.reset.modification_user_id = this.$store.getters.token;
    this.model.modification_user_id = this.$store.getters.token;  
    
  },
  methods: {
    remove() {
      classificationApi.batchDelete([id]).then(response => {
        if (response.code === 0) {
          this.$message.success('删除成功');
          this.deleteDialog = false;
        } else {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.error('删除失败.');
      });
    },
    
   
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const sendData = Object.assign({}, this.model);
          for (const key in sendData) {
            if (this.map[key]) {
              sendData[key] = sendData[key].join(',');
            }
          }
          if (this.isEdit) { // 编辑
            classificationApi.update(sendData).then(response => {
              if (response.code === 0) {
                this.$message.success('修改成功');
                this.addDialog = false;
              } else {
                this.$message.error(`修改失败：${response.msg}`)
              }
            }).catch(() => {
              this.$message.error('修改失败.');
            })
          } else { // 新增            
            classificationApi.create(sendData).then(response => {
              if (response.code === 0) {
                this.$message.success('添加成功');
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
      })
    },
    // 重置
    resetForm(formName) {
      if (!this.isEdit) {
        this.$refs[formName].clearValidate();
        this.model = Object.assign({}, this.reset);
      }
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

