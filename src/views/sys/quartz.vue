<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" :size="size" placeholder="任务名称" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            perms="sys:attachments:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增"
            perms="sys:attachments:view"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="pageResult.content"
      :max-height="530"
      :size="size"
      align="left"
      @selection-change="handleSelectionChange"
    >
      <el-table-column header-align="center" align="center" type="selection" width="50" />
      <el-table-column header-align="center" align="center" prop="jobname" label="任务名称" sortable />
      <el-table-column header-align="center" align="center" prop="jobGroup" label="任务分组" sortable />
      <el-table-column header-align="center" align="center" prop="triggerName" label="触发器名" sortable />
      <el-table-column header-align="center" align="center" prop="triggerGroupName" label="触发器组名" sortable />
      <el-table-column header-align="center" align="center" prop="jobClass" label="job类" sortable />
      <el-table-column header-align="center" align="center" prop="cronexpression" label="表达式" sortable />
      <el-table-column header-align="center" align="center" prop="jobstatus" label="运行状态" :formatter="jobtatusFormat" sortable />
      <el-table-column header-align="center" align="center" prop="startTime" label="启动时间" sortable />
      <el-table-column header-align="center" align="center" prop="stopTime" label="上次运行时间" sortable />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="statusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="185" align="center">
        <template slot-scope="scope">
          <el-button icon="fa fa-edit" type="primary" :size="size" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button icon="fa fa-trash" :size="size" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar" style="padding:10px;">
      <kt-button
        label="批量删除"
        perms="sys:attachments:view"
        :size="size"
        type="danger"
        :disabled="this.selections.length===0"
        style="float:left;"
        @click="handleBatchDelete()"
      />
      <pagination
        v-show="pageRequest.total>0"
        :layout="layout"
        :total="pageRequest.total"
        :page.sync="pageRequest.pageNum"
        :limit.sync="pageRequest.pageSize"
        @pagination="findPage"
      />
    </div>
    <!-- </el-col> -->
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增Job':'编辑Job'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="dataForm" label-width="100px" :rules="dataFormRules" :size="size">
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="任务名称" prop="jobname">
          <el-input v-model="dataForm.jobname" auto-complete="off" />
        </el-form-item>
        <el-form-item label="任务分组" prop="jobGroup">
          <el-input v-model="dataForm.jobGroup" auto-complete="off" />
        </el-form-item>
        <el-form-item label="触发器名称" prop="triggerName">
          <el-input v-model="dataForm.triggerName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="触发器组名" prop="triggerGroupName">
          <el-input v-model="dataForm.triggerGroupName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="Job类" prop="jobClass">
          <el-input v-model="dataForm.jobClass" auto-complete="off" />
        </el-form-item>
        <el-form-item label="表达式" prop="cronexpression">
          <el-input v-model="dataForm.cronexpression" auto-complete="off" />
        </el-form-item>
        <el-form-item label="备注 " prop="description">
          <el-input v-model="dataForm.description" auto-complete="off" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitForm">提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import Pagination from '@/components/Pagination'
import { format } from '@/utils/datetime'
import { findPage, batchDelete, save, starOrStopJob } from '@/api/quartz-server/quartz'
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
      dataForm: {},
      dataFormRules: {
        jobname: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        jobGroup: [
          { required: true, message: '请输入任务分组', trigger: 'blur' }
        ],
        triggerGroupName: [
          { required: true, message: '请输入触发器名称', trigger: 'blur' }
        ],
        jobClass: [
          { required: true, message: '请输入Job类', trigger: 'blur' }
        ],
        cronexpression: [
          { required: true, message: '请输入表达式', trigger: 'blur' }
        ]
      }

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
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },
    handleSelectionChange: function(selections) {
      this.selections = selections
    },
    handleDelete: function(data) {
      this.delete(data.id)
    },
    handleBatchDelete: function() {
      const ids = this.selections.map(item => item.id).toString()
      this.delete(ids)
    },
    delete: function(ids) {
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
    statusChange: function(data) {
      let info = ''
      if (data.status) {
        info = '启动'
      } else {
        info = '停止'
      }
      this.$confirm('确认要' + info + '任务吗？', '提示', {}).then(() => {
        starOrStopJob(data).then(res => {
          this.$message({ message: '任务' + info + '成功！', type: 'success' })
          this.findPage(null)
        })
      }).catch(() => {
        data.status = 0
        starOrStopJob(data).then(res => {
          this.$message({ message: '任务' + info + '成功！', type: 'success' })
          this.findPage(null)
        })
      })
    },
    // 显示新增界面
    handleAdd: function() {
      this.dataForm = {}
      this.operation = true
      this.dialogVisible = true
    },
    handleEdit: function(data) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign(data)
    },
    submitForm: function() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            save(params).then((res) => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.findPage(null)
            })
          })
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    jobtatusFormat(row) {
      const status = row.status
      if (status === 0) {
        return '未启动'
      } else if (status === 1) {
        return '运行中'
      } else if (status === 2) {
        return '已停止'
      } else if (status === 3) {
        return '异常'
      }
    },
    // 时间格式化
    dateFormat: function(row, column) {
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
