<template>
  <section class="app-main">
    <el-scrollbar class="scrollbar">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </el-scrollbar>
  </section>
</template>
<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 120px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.scrollbar {
  height: calc(100vh - 60px);
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
