<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" :size="size" placeholder="文件名" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" label="查询" perms="sys:attachments:view" type="primary" @click="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" label="上传" perms="sys:attachments:view" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loading" :data="pageResult.content" :max-height="420" :size="size" align="left" @selection-change="handleSelectionChange">
      <el-table-column header-align="center" align="center" type="selection" width="50" />
      <el-table-column header-align="center" align="center" type="index" label="序号" sortable />
      <el-table-column header-align="center" align="center" prop="fileName" label="文件名" sortable />
      <el-table-column header-align="center" align="center" prop="fileType" label="类型" sortable />
      <el-table-column header-align="center" align="center" prop="fileSize" label="大小" :formatter="renderSize" sortable />
      <el-table-column header-align="center" align="center" prop="createTime" label="上传时间" :formatter="dateFormat" sortable />
      <el-table-column header-align="center" align="center" prop="filePath" label="位置" sortable />
      <el-table-column label="操作" width="185" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-download" type="primary" :size="size" @click="downloadFile(scope.row)">下载</el-button>
          <el-button icon="fa fa-trash" :size="size" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar" style="padding:10px;">
      <kt-button label="批量删除" perms="sys:attachments:view" :size="size" type="danger" :disabled="this.selections.length===0" style="float:left;" @click="handleBatchDelete()" />
      <pagination v-show="pageRequest.total>0" :layout="layout" :total="pageRequest.total" :page.sync="pageRequest.pageNum" :limit.sync="pageRequest.pageSize" @pagination="findPage" />
    </div>
    <!-- </el-col> -->
    <!--新增编辑界面-->
    <el-dialog title="附件上传" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-upload class="upload-demo" :http-request="uploadFiles" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" action multiple :limit="5" :on-exceed="handleExceed" :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png/zip文件，且不超过500kb</div>
        <el-progress style="width: 150px;" :percentage="parseInt(fake.progress *100)" />
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import Pagination from '@/components/Pagination'
import { format } from '@/utils/datetime'
import { findPage, uploadFiles, batchDelete, download } from '@/api/admin-server/attachments'
var FakeProgress = require('fake-progress')
import { memoryTurned } from '@/utils'
export default {
  components: {
    KtButton,
    Pagination
  },
  data() {
    return {
      size: 'mini',
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: false,
      filters: {
        title: ''
      },
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      selections: [], // 列表选中列
      checkAll: false,
      currentRoleMenus: [],
      fileList: [],
      fake: new FakeProgress({
        timeConstant: 10000,
        autoStart: false
      })

    }
  },
  created() {
    this.findPage()
  },
  mounted() {
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      this.loading = true
      this.pageRequest.params = { name: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },
    handleSelectionChange: function (selections) {
      this.selections = selections
      console.log(this.selections)
    },
    // 删除
    handleDelete: function (data) {
      this.delete(data.id)
    },
    // 批量删除
    handleBatchDelete: function () {
      const ids = this.selections.map(item => item.id).toString()
      this.delete(ids)
    },
    delete: function (ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const params = []
        const idArray = (ids + '').split(',')
        for (var i = 0; i < idArray.length; i++) {
          params.push({ 'id': idArray[i] })
        }
        batchDelete(params).then((res) => {
          if (res.code === 200) {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage(null)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
        })
      })
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
    },
    uploadFiles(fileObject) {
      this.fake.start()
      const formData = new FormData()
      formData.set('category', 'root')
      formData.set('serverCode', 'pie-file-server')
      formData.set('file', fileObject.file)
      uploadFiles(formData).then(response => {
        this.fake.end()
        const { data } = response
        this.fileList.push({ id: data.id, name: data.fileName, url: data.filePath })
        console.log(this.fileList)
        this.$message({ message: response, type: 'success' })
        this.findPage()
      })
    },
    downloadFile(data) {
      download(data.id).then(response => {
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        const filename = data.fileName + data.fileType
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
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.handleDelete(file)
      })
    },
    // 时间格式化
    dateFormat: function (row, column) {
      return format(row[column.property])
    },
    //  格式化文件大小
    renderSize: function (row) {
      return memoryTurned(row.fileSize)
    }
  }
}
</script>
<style scoped>
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
</style>
