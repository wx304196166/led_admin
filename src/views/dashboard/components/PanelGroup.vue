<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jump('/products/product')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">产品数量</div>
          <count-to :start-val="0" :end-val="number[0]" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jump('/integration/index')">
        <div class="card-panel-icon-wrapper icon-form">
          <svg-icon icon-class="form" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">方案数量</div>
          <count-to :start-val="0" :end-val="number[1]" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jump('/maintenance/index')">
        <div class="card-panel-icon-wrapper icon-example">
          <svg-icon icon-class="example" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">维保数量</div>
          <count-to :start-val="0" :end-val="number[2]" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jump('/user/index')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">客户数量</div>
          <count-to :start-val="0" :end-val="number[3]" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to';
import { queryNumber } from '@/api/common';

export default {
  components: {
    CountTo
  },
  data() {
    return {
      tableNames:['product','integrate','maintenance','customer_user'],
      number:[0,0,0,0]
    }
  },
  created(){
    queryNumber(this.tableNames).then(res=>{
      if(res.code===0){
        this.number=res.data;
      }else{
        this.$message.error(res.message);
      }
    })
  },
  methods: {
    jump(path) {
      this.$router.push({ path });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-shopping {
        background: #40c9c6;
      }
      .icon-form {
        background: #36a3f7;
      }
      .icon-example {
        background: #f4516c;
      }
      .icon-people {
        background: #34bfa3;
      }
    }
    .icon-shopping {
      color: #40c9c6;
    }
    .icon-form {
      color: #36a3f7;
    }
    .icon-example {
      color: #f4516c;
    }
    .icon-people {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      text-align: center;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
