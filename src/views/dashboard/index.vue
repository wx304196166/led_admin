<template>
  <div class="dashboard" :style="{minHeight:height}">
    <panel-group />

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup';
export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  },
  data() {
    return {
      height: '100%'
    }
  },
  mounted() {
    this.resize();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      this.height = document.body.clientHeight - 50 + 'px';
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  padding: 32px;
  background-color: #f0f2f5;
}
</style>
