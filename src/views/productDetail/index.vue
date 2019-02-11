<template>
  <div class="app-container">
    <el-form ref="form" class="productDetail" :model="model" label-width="80px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="model.name" class="single"></el-input>
      </el-form-item>
      <el-form-item label="是主产品">
        <el-switch v-model="model.is_main"></el-switch>
      </el-form-item>
      <el-form-item label="所属分类" prop="classification_id">
        <el-select v-model="model.classification_id" @change="selClassification" class="single" placeholder="请选择">
          <el-option v-for="(val,key) in map.classification_id" :key="key" :value="key" :label="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联品牌" prop="brand_id">
        <el-select v-model="model.brand_id" class="single" placeholder="请选择">
          <el-option v-for="item in classificationMap[curClassifyId].brand_id" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联标签" prop="label_id">
        <el-select v-model="model.label_id" class="multiple" multiple placeholder="请选择">
          <el-option v-for="item in classificationMap[curClassifyId].label_id" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联产品" prop="label_id">
        <el-select v-model="model.product_id" :disabled="model.is_main" class="multiple" multiple placeholder="请选择">
          <el-option v-for="(val,key) in map.product_id" :key="key" :value="key" :label="val"></el-option>
        </el-select>
      </el-form-item>
      <el-alert v-show="alert.specifications" class="alert" title="填写注意事项" type="warning" description="格式为：300*200 。若为主产品可以填写多个规格，用英文逗号分隔：300*200,500*300 。" show-icon>
      </el-alert>
      <el-form-item label="产品规格" prop="specifications">
        <el-input v-model="model.specifications" @focus="alert.specifications=true" @blur="alert.specifications=false" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="产品简介" prop="intro">
        <el-input v-model="model.intro" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <ul class="upload">
      <li class="label">产品展示图</li>
      <li>
        <el-upload action="fakeUrl" list-type="picture-card" ref="addImgList" :limit="8" :before-upload="addImgList" :on-exceed="imgsExceed" :file-list="imgs" :auto-upload="false" multiple :on-preview="handlePictureCardPreview" :on-remove="removeImgs">
          <i class="el-icon-plus"></i>
        </el-upload>
      </li>
    </ul>
    <ul class="upload">
      <li class="label">产品缩略图</li>
      <li>
        <el-upload action="fakeUrl" list-type="picture-card" ref="addThumbnail" :limit="1" :before-upload="addThumbnail" :on-exceed="thumbnailExceed" :file-list="thumbnail" :auto-upload="false" :on-preview="handlePictureCardPreview" :on-remove="removeThumbnail">
          <i class="el-icon-plus"></i>
        </el-upload>
      </li>
    </ul>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <div>
      <span class="label tinymce">产品详情</span>
      <tinymce v-if="showDetail" :height="300" v-model="model.detail" />
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
    </el-tooltip>
    <ul class="buttons">
      <li @click="submitForm">提交</li>
      <li @click="getBack">返回</li>
    </ul>
  </div>

</template>

<script>
import productEntity from '@/entity/productEntity';

import { upload, queryAll, queryMany } from '@/api/common';
import productApi from '@/api/productApi';

import Tinymce from '@/components/Tinymce';
import BackToTop from '@/components/BackToTop'

export default {
  components: { Tinymce, BackToTop },
  data() {
    return {
      showDetail: true,
      model: productEntity.model,
      reset: null,
      isEdit: 0,
      imgPath: '/upload/product/',
      map: {
        classification_id: {},
        brand_id: {},
        label_id: {},
        product_id: {}
      },
      classificationMap: {
        empty: []
      },
      curClassifyId: 'empty',

      rule: {
        // 根据自己需要添加校验规则
      },
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      alert: {
        specifications: false
      },
      // 图片上传
      dialogImageUrl: '',
      dialogVisible: false,
      uploadImg: new FormData(),
      imgs: [],
      thumbnail: []
    };
  },
  computed: {
    map() {
      return this.$store.getters.map;
    }
  },
  async created() {
    this.reset = Object.assign({}, productEntity.model);
    this.reset.modification_user_id = this.$store.getters.token;
    this.model.modification_user_id = this.$store.getters.token;
    let res = await queryAll('classification');
    if (res.code === 0) {
      res.data.forEach(item => {
        const obj = {
          brand_id: [],
          label_id: []
        }
        let arr = item.brand_id.split(',');
        arr.forEach(id => {
          obj.brand_id.push(
            {
              id,
              name: this.map.brand_id[id]
            }
          )
        })

        arr = item.label_id.split(',');
        arr.forEach(id => {
          obj.label_id.push(
            {
              id,
              name: this.map.label_id[id]
            }
          )
        })
        this.classificationMap[item.id] = obj;
      })
    }
    this.isEdit = Number(sessionStorage.getItem('productEditStatus'));
    if (this.isEdit) {
      this.model.id = sessionStorage.getItem('productId');
      res = await queryMany('product', [this.model.id], 'all');
      if (res.code === 0) {
        const data = res.data[0];
        data.img_list = data.img_list ? data.img_list.split(',') : [];
        data.label_id = data.label_id ? data.label_id.split(',') : [];
        data.product_id = data.product_id ? data.product_id.split(',') : [];
        data.is_main = Boolean(data.is_main);
        this.curClassifyId = data.classification_id;
        this.thumbnail = data.thumbnail ? [{ url: this.imgPath + data.thumbnail }] : [];
        data.img_list.forEach(item => {
          this.imgs.push({ url: this.imgPath + item });
        })

        this.model = Object.assign({}, data);
      }
    }
  },
  methods: {
    // 选择分类后
    selClassification(val) {
      this.curClassifyId = val;
      this.model.label_id = [];
      this.model.brand_id = '';
    },
    // 返回产品列表
    getBack() {
      this.$confirm('此操作将放弃当前编辑, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/products/product' });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 图片上传
    imgsExceed() {
      this.$message.warning('最多上传8张图片');
    },
    thumbnailExceed() {
      this.$message.warning('最多上传1张图片');
    },
    addImgList(file) {
      this.addImg(file, 5);
      return false
    },
    addThumbnail(file) {
      this.addImg(file, 1);
      return false
    },
    addImg(file, size) {
      const isImg = file.type.includes('image')
      const fitSize = file.size / 1024 / 1024 < size

      if (!fitSize) {
        this.succ--
        this.$message.error('单个图片大小不能超过1M');
      } else if (!isImg) {
        this.succ--
        this.$message.error('只能上传图片');
      } else {
        this.uploadImg.append('file', file);
      }
    },
    removeImgs(file, fileList) {
      this.handleRemove(file, fileList, 'imgs');
    },
    removeThumbnail(file, fileList) {
      this.handleRemove(file, fileList, 'thumbnail');
    },
    handleRemove(file, fileList, type) {
      if (file.status !== 'success') { return; }
      switch (type) {
        case 'thumbnail':
          this.thumbnail = [];
          this.model.thumbnail = '';
          break;
        case 'imgs':
          this.model.img_list.forEach((item, index) => {
            if (this.imgPath + item === file.url) {
              this.model.img_list.splice(i, 1);
              return;
            }
          })
          break;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async submitProcess() {
      this.loading = true;
      this.$refs.addImgList.submit();
      if (this.uploadImg.has('file')) {
        this.uploadImg.set('id', this.model.id);
        this.uploadImg.set('type', 'imgs');
        let res = await upload('product', this.uploadImg);
        if (res.code === 0) {
          if (this.isEdit) {
            this.model.img_list = this.model.img_list.concat(res.data.imgList);
          } else {
            this.model.img_list = res.data.imgList;
            this.model.id = res.data.productId;
          }
        } else {
          this.$message.error(res.message);
          return;
        }
        this.uploadImg = new FormData();
      }

      this.$refs.addThumbnail.submit();
      if (this.uploadImg.has('file')) {
        this.uploadImg.set('id', this.model.id);
        this.uploadImg.set('type', 'thumbnail');
        res = await upload('product', this.uploadImg);
        if (res.code === 0) {
          this.model.thumbnail = res.data.imgList[0];
        } else {
          this.$message.error(res.message);
          return;
        }
        this.uploadImg = new FormData();
      }


      const sendData = Object.assign({}, this.model);
      sendData.img_list = sendData.img_list.join(',');
      sendData.label_id = sendData.label_id.join(',');
      sendData.product_id = sendData.product_id.join(',');
      sendData.is_main = Number(sendData.is_main);
      if (this.isEdit) { // 编辑
        productApi.update(sendData).then(response => {
          if (response.code === 0) {
            this.$message.success('修改成功');
            this.$router.push({ path: '/products/product' });
          } else {
            this.$message.error(`修改失败：${response.msg}`);
          }
        }).catch(() => {
          this.$message.error('修改失败.');
        })
      } else { // 新增            
        productApi.create(sendData).then(response => {
          if (response.code === 0) {
            this.$message.success('添加成功');
            this.resetForm();
          } else {
            this.$message.error(`添加失败：${response.msg}`);
          }
        }).catch(() => {
          this.$message.error('添加失败.');
        });
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitProcess();
        } else {
          this.$message.error('请检查填写数据.');
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs.form.clearValidate();
      this.model = Object.assign({}, this.reset);
      this.$store.dispatch('SET_MAP');
      this.showDetail = false;
      this.$nextTick(() => {
        this.showDetail = true;
      });
    },

    handleSelCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.alert {
  margin-bottom: 20px;
}
.label {
  width: 80px;
  text-align: right;
  font-weight: 700;
  font-size: 14px;
  color: #606266;
  margin-right: 12px;
}
.upload {
  display: flex;
  margin-bottom: 22px;
}
.tinymce {
  margin-bottom: 22px;
  display: inline-block;
}
.buttons {
  position: fixed;
  right: 50px;
  top: calc(50% - 35px);

  > li {
    writing-mode: vertical-lr;
    padding: 12px 8px;
    color: #fafafa;
    cursor: pointer;
  }
  > li:nth-child(1) {
    border-radius: 4px 4px 0 0;
    background: #409eff;
  }
  > li:nth-child(2) {
    border-radius: 0 0 4px 4px;
    background: #f56c6c;
  }
}
</style>
<style  rel="stylesheet/scss" lang="scss">
.productDetail {
  .single {
    width: 203.8px;
  }
  .el-textarea,
  .multiple {
    min-width: 203.8px;
    width: 50%;
  }
}
</style>
