<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key"/>
    </transition>
  </section>
</template>

<script>
import { queryAll } from '@/api/common';

export default {
  name: 'AppMain',
  data() {
    return {
      map: {
        classification_id: {},
        brand_id: {},
        label_id: {},
        product_id: {},
        modification_user_id:{}
      }
    }
  },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  async created() {
    let res = await queryAll('classification');
    if (res.code === 0) {
      res.data.forEach(item => {
        this.map.classification_id[item.id] = item.name;
      });
    } else {
      this.$message.error(res.message);
    }

    res = await queryAll('customer_user');
    if (res.code === 0) {
      res.data.forEach(item => {
        this.map.modification_user_id[item.id] = item.username;
      });
    } else {
      this.$message.error(res.message);
    }
    res = await queryAll('brand');
    if (res.code === 0) {
      res.data.forEach(item => {
        this.map.brand_id[item.id] = item.name;
      });
    } else {
      this.$message.error(res.message);
    }
    res = await queryAll('product');
    if (res.code === 0) {
      res.data.forEach(item => {
        this.map.product_id[item.id] = item.name;
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
    sessionStorage.setItem('map', JSON.stringify(this.map));
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
