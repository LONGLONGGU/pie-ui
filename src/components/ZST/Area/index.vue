<!-- 行政区划  -->
<template>
  <el-form-item label="行政区划">
    <el-input
      v-model="form.areaName"
      placeholder="点击选择行政区划"
      :disabled="disabled"
      :readonly="true"
      class="width-240 selectTree-input"
      auto-complete="off"
      @click.native="changeSelectTree()"
      @blur="hideParentClick"
    />
    <el-tree
      v-show="isShowSelect"
      id="floatTree"
      ref="selectTree"
      empty-text="暂无数据"
      :highlight-current="true"
      :default-expand-all="false"
      :expand-on-click-node="true"
      :filter-node-method="filterNode"
      :props="districtDefaultProps"
      :load="loadDistrictNode"
      node-key="id"
      lazy
      class="width-240 selectTree-input objectTree"
      @node-click="selectClassfy"
    />
  </el-form-item>
</template>
<script>
import { asyncFindDistrictTree } from '@/api/district'
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    disableInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 行政区划树形结构信息
      districtDefaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'hasChildren'
      },
      isShowSelect: false,
      disabled: false,
      form: { areaName: this.label }
    }
  },
  watch: {
    form: {
      handler(form) {
        if (this.isShowSelect) {
          this.$refs.selectTree.filter(form.areaName)
        }
      },
      deep: true // 深度监听，重要
    },
    label(val) {
      this.form.areaName = val
    },
    disableInfo: {
      handler(val) {
        this.disabled = val
      },
      immediate: true
    }
  },
  methods: {
    // 处理行政区划树形结构
    async loadDistrictNode(node, resolve) {
      if (node.level === 0) {
        return resolve(await this.getTagList())
      } else {
        return resolve(await this.getTagApiList(node.data.id))
      }
    },
    async getTagList() {
      const res = await asyncFindDistrictTree(0, 1)
      const tags = res.data
      return tags
    },
    async getTagApiList(tag) {
      const res = await asyncFindDistrictTree(tag, 1)
      const results = res.data
      return results
    },
    selectClassfy(data) {
      this.form.areaName = data.name + '：' + data.id
      this.isShowSelect = false
      this.$emit('getCheckedNodes', data)
    },
    changeSelectTree() {
      if (!this.disabled) {
        this.isShowSelect = true
      }
    },
    hideParentClick(e) {
      var isOther = e.relatedTarget == null || e.relatedTarget.closest('div.el-tree') ==
        null || e.relatedTarget.closest('div.el-tree').id !== 'floatTree'
      if (isOther) {
        this.isShowSelect = false
      } else {
        e.target.focus()
      }
    },
    // 选择器的树节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>
<style>
 /*下拉框选择树*/
 .objectTree {
  position: absolute;
  overflow: auto;
  z-index: 100;
  height: 200px;
  border: 1px solid #ddd;
  line-height: normal;
  z-index: 204;
 }
 .width-240{
  width: 240px
 }
</style>
