<template>
  <div class="dashboard-container background">
    <div class="dashboard-text">当前登录人: {{ nickName }}</div>
    <!-- <img :src="imgSrc" width="100%" height="100%" alt=""> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'nickName'
    ])
  },
  data() {
    return {
      imgSrc: require('../../assets/dashboard.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.background {
  width: 100%;
  height: 100%; /**宽高100%是为了图片铺满屏幕 */
  z-index: -1;
  position: absolute;
}
</style>
