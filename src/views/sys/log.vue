<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            perms="sys:log:view"
            type="primary"
            @click="findPage(null)"
          />
          <kt-button
            icon="fa fa-search"
            label="导出统计信息"
            perms="sys:count:export"
            type="primary"
            @click="exportCountInfo()"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table :data="pageResult" :columns="columns" :show-operation="showOperation" @findPage="findPage" />
  </div>
</template>

<script>
import KtTable from '@/components/KtTable'
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import { findPage, exportCount } from '@/api/admin-server/log'
export default {
  components: {
    KtTable,
    KtButton
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: ''
      },
      columns: [
        { prop: 'userName', label: '用户名', minWidth: 100 },
        { prop: 'operation', label: '操作', minWidth: 120 },
        { prop: 'method', label: '方法', minWidth: 180 },
        { prop: 'params', label: '参数', minWidth: 220 },
        { prop: 'ip', label: 'IP', minWidth: 120 },
        { prop: 'time', label: '耗时', minWidth: 80 },
        { prop: 'createBy', label: '创建人', minWidth: 100 },
        { prop: 'createTime', label: '创建时间', minWidth: 120, formatter: this.dateFormat }
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      showOperation: false
    }
  },
  mounted() {
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.params = { name: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 导出统计信息
    exportCountInfo() {
      const loading = this.$loading({
        lock: true,
        text: '统计报告生成中，需要时间可能会久一些，请耐心等待......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      exportCount().then(response => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const filename = year + '年' + month + '月招商通数据量及运行情况.docx'
        if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
          navigator.msSaveBlob(blob, filename)
        } else {
          // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
          const elink = document.createElement('a')
          elink.download = filename
          elink.style.display = filename
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
          loading.close()
        }
      })
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property])
    }
  }
}
</script>

<style scoped>
</style>
