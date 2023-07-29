<template>
  <el-tabs v-model="activeName" style="margin-left: 20px;" @tab-click="handleClick">
    <el-tab-pane label="流程信息" name="first">流程信息</el-tab-pane>
    <el-tab-pane label="流程实例" name="second">
      <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input placeholder="流程信息" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" label="查询" type="primary" @click="findPage(null)">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-upload class="upload-demo" :show-file-list="false" action :http-request="uploadFiles">
              <el-button icon="el-icon-upload" type="primary">导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-download" type="primary" @click="exportExcelUser">下载</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-tickets" perms="sys:user:export" type="primary" @click="exportAllExcelUser">部署</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" :size="size" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column prop="date" label="ID" sortable width="180" />
        <el-table-column prop="name" label="NAME" sortable width="180" />
        <el-table-column prop="address" label="TIME" :formatter="formatter" />
      </el-table>
      <pagination v-show="pageRequest.total>0" :total="pageRequest.total" :page.sync="pageRequest.pageNum" :limit.sync="pageRequest.pageSize" @pagination="findPage" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Pagination from '@/components/Pagination'
import { findPage as repositoryFindPage } from '@/api/activiti-server/repository'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      size: 'small',
      activeName: 'second',
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      tableData: []
    }
  },
  mounted() {
    this.repositoryFindPage()
  },
  methods: {
    repositoryFindPage() {
      console.log(this.pageRequest)
      repositoryFindPage(this.pageRequest).then((response) => {
        const { code, data } = response
        if (code === 200) {
          console.log(data)
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    formatter(row, column) {
      return row.address
    }
  }
}
</script>
