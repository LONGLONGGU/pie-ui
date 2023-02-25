<!-- 行业信息  -->
<template>
  <el-form-item label="行业信息">
    <span>111{{tradIds}}</span>
    <el-cascader
      v-model="value"
      class="width-full"
      :props="props"
      filterable
      @change="handleChange"
    />
  </el-form-item>
</template>
<script>
import { asyncFindTree } from '@/api/zst-server/trade'
export default {
  props: ['tradIds'],
  data() {
    return {
      value: ['55bb7644bed646ebbf7dd09b2e39b83f', '8d9818b29c224a40be257db514a1f9c3', 'ed0fd98e334d479189c77af060bf0a39'],
      props: {
        multiple: true,
        lazy: true,
        label: 'name',
        value: 'id',
        emitPath: false,
        children: 'childrenList',
        lazyLoad: this.loadTradeNode
      }
    }
  },
  methods: {
    handleChange(node) {
      console.log(node)
    },
    async loadTradeNode(node, resolve) {
      if (node.level === 0) {
        return resolve(await this.getTagList())
      } else {
        return resolve(await this.getTagApiList(node.data.id))
      }
    },
    async getTagList() {
      const res = await asyncFindTree(0, 1)
      const tags = res.data
      return tags
    },
    async getTagApiList(tag) {
      const res = await asyncFindTree(tag, 1)
      const results = res.data
      return results
    }
  }
}
</script>
<style scoped="scoped">
  .width-full {
    width: 100%;
  }
</style>
