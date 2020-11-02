<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" :size="size" placeholder="表名" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            perms="sys:user:add"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="pageResult.content"
      :max-height="720"
      size="mini"
      align="left"
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="TABLE_NAME" label="TABLE_NAME" />
      <el-table-column header-align="center" align="center" prop="TABLE_COMMENT" label="TABLE_COMMENT" sortable />
      <el-table-column header-align="center" align="center" prop="TABLE_COLLATION" label="TABLE_COLLATION" sortable />
      <el-table-column header-align="center" align="center" prop="CREATE_TIME" label="CREATE_TIME" sortable />
      <el-table-column label="操作" width="185" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-s-tools" type="primary" size="mini" @click="handleEdit(scope.row)">代码生成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar" style="padding:10px;">
      <pagination
        v-show="pageRequest.total>0"
        :layout="layout"
        :total="pageRequest.total"
        :page.sync="pageRequest.pageNum"
        :limit.sync="pageRequest.pageSize"
        @pagination="findPage"
      />
    </div>
    <el-dialog
      title="参数设置"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="80px"
        :size="size"
        style="text-align:left;"
      >
        <el-form-item label="作者" prop="author">
          <el-input v-model="dataForm.author" placeholder="codedevelopers" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="dataForm.path" placeholder="com.framework.pie.admin.business" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click="generator()">生成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import Pagination from '@/components/Pagination'
import { format } from '@/utils/datetime'
import { findPage, generator } from '@/api/codegenerator'
export default {
  components: {
    KtButton,
    Pagination
  },
  data() {
    return {
      size: 'small',
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: false,
      filters: {
        name: ''
      },
      dataForm: {
        author: '',
        path: 'com.framework.pie.admin.business'
      },
      dataRule: {
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '生成路径不能为空', trigger: 'blur' }
        ]
      },
      table: null,
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false
    }
  },
  created() {
    this.findPage()
  },
  mounted() {
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.loading = true
      this.pageRequest.params = { name: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        console.log(res)
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },
    handleEdit: function(data) {
      this.dialogVisible = true
      this.table = data
    },
    generator: function() {
      generator({ tableName: this.table.TABLE_NAME, path: this.dataForm.path, author: this.dataForm.author }).then(response => {
        const { code, msg } = response
        if (code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + msg, type: 'error' })
        }
        this.dialogVisible = false
      })
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      console.log(cellValue)
      console.log(index)
      return format(row[column.property])
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
