<!-- 行业信息  -->
<template>
  <el-form-item :label="labelInfo">
    <el-cascader
      ref="casTrade"
      v-model="value"
      class="width-full"
      :options="options"
      :props="props"
      :disabled="disabled"
      @change="handleChange"
      filterable
    />
  </el-form-item>
</template>
<script>
import { listTree } from '@/api/zst-server/trade'
export default {
  name: 'Trade',
  props: {
    tradIds: {
      type: String,
      default: ''
    },
    disableInfo: {
      type: Boolean,
      default: false
    },
    labelInfo: {
      type: String,
      default: '行业信息'
    }
  },
  data() {
    return {
      value: [],
      props: {
        multiple: true,
        lazy: false,
        label: 'name',
        value: 'id',
        emitPath: false,
        children: 'childrenList'
      },
      disabled: false,
      options: [],
      tradeList: []
    }
  },
  watch: {
    tradIds: {
      handler(val) {
        const tradeIdArray = val.split(',')
        this.value = tradeIdArray
      },
      immediate: true,
      deep: true
    },
    disableInfo: {
      handler(val) {
        this.disabled = val
      },
      immediate: true
    }
  },
  created() {
    this.listTreeInfo()
  },
  methods: {
    listTreeInfo() {
      listTree().then((res) => {
        if (res.code === 200) {
          this.options = this.getTreeData(res.data)
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
      })
    },
    // 处理最后一级出现空白子项问题
    getTreeData(data) {
      // 循环遍历json数据
      for (let i = 0; i < data.length; i++) {
        const tradeInfo = {}
        tradeInfo.id = data[i].id
        tradeInfo.name = data[i].name
        this.tradeList.push(tradeInfo)
        if (data[i].childrenList.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].childrenList = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].childrenList)
        }
      }
      return data
    },
    handleChange(value) {
      const tradeNodes = this.getTradeNodes(value)
      this.$emit('getTradeCheckedNodes', tradeNodes)
    },
    getTradeNodes(tradeIdList) {
      const tradeInfo = []
      if (tradeIdList && tradeIdList.length > 0) {
        tradeIdList.forEach(item => {
          this.tradeList.forEach(trade => {
            if (item === trade.id) {
              tradeInfo.push(trade)
            }
          })
        })
      }
      return tradeInfo
    }
  }
}
</script>
<style scoped="scoped">
  .width-full {
    width: 100%;
  }
</style>
