<template>
  <el-form-item :label="formLabel">
    <el-select v-model="dataForm.dictionaryValue" :placeholder="selectPlaceholder" @change="handleDictSelect">
      <el-option
        v-for="item in dictionaryList"
        :key="item.value"
        :value="item.value"
        :label="item.name"
      />
    </el-select>
  </el-form-item>
</template>
<script>
import { getDictionaryByCode } from '@/api/admin-server/dictionary'

export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    dictCode: {
      type: String,
      default: 'Microservices'
    },
    dictValue: {
      type: String,
      default: ''
    },
    needNone: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLabel: '系统字典',
      selectPlaceholder: '请选择',
      initDictCode: '',
      dataForm: {
        dictionaryValue: ''
      },
      dictionaryList: []
    }
  },
  watch: {
    label: {
      handler(val) {
        this.formLabel = val
      },
      immediate: true
    },
    placeholder: {
      handler(val) {
        this.selectPlaceholder = val
      },
      immediate: true
    },
    dictCode: {
      handler(val) {
        this.initDictCode = val
      },
      immediate: true
    },
    dictValue: {
      handler(val) {
        this.dataForm.dictionaryValue = val
      },
      immediate: true
    }
  },
  mounted() {
    this.getDictionaryByCode()
  },
  methods: {
    // 数据字典查询
    getDictionaryByCode: function() {
      getDictionaryByCode({ 'code': this.initDictCode }).then(res => {
        if (this.needNone) {
          const noneNode = {}
          noneNode.value = ''
          noneNode.name = '--请选择--'
          this.dictionaryList.push(noneNode)
          const dataNodeList = this.getDictNodeList(res.data)
          this.dictionaryList = this.dictionaryList.concat(dataNodeList)
        } else {
          this.dictionaryList = this.getDictNodeList(res.data)
        }
      })
    },
    getDictNodeList: function(data) {
      const nodeList = []
      data.forEach(item => {
        const node = {}
        node.value = item.value
        node.name = item.name
        nodeList.push(node)
      })
      return nodeList
    },
    handleDictSelect: function() {
      debugger
      this.$emit('handleDictSelect', this.dataForm.dictionaryValue)
    }
  }
}
</script>
