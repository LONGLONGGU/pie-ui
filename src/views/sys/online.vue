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
            perms="sys:loginlog:view"
            type="primary"
            @click="findPage(null)"
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
import { findPage } from '@/api/admin-server/loginlog'
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
        { prop: 'status', label: '状态', minWidth: 120 },
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
      this.pageRequest.params = { name: this.filters.name, status: 'online' }
      findPage(this.pageRequest).then((res) => {
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 时间格式化
    dateFormat: function(row, column) {
      return format(row[column.property])
    }
  }
}
</script>

<style scoped>
</style>
