<template>
  <div>
    <el-col :span="1.5" class="elrow">
      <el-form-item>
        <el-button type="text" size="mini" @click="closeSearch">
          {{ word }}
          <i :class="showAll ? 'el-icon-arrow-up ': 'el-icon-arrow-down'" />
        </el-button>
      </el-form-item>
    </el-col>
    </el-col>
  </div>
</template>
<script>
export default {
  props: {
    showAll: {
      type: Boolean,
      defalut: true
    }
  },
  computed: {
    word: function () {
      if (this.showAll === false) {
        // 对文字进行处理
        return '展开搜索'
      } else {
        return '收起搜索'
      }
    }
  },
  mounted() {
    /**
      * 收起搜索
      */
    this.$nextTick(function () {
      this.closeSearch()
    })
  },
  methods: {
    closeSearch() {
      // this.showAll = !this.showAll;
      this.$emit('closepop')
      console.log('子组件的状态：' + this.showAll)
    }
  }
}
</script>
