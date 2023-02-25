<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="应用名称" @keyup.enter.native="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" label="查询" perms="sys:role:view" type="primary" @click="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" label="新增" perms="sys:role:add" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loading" :data="pageResult.content" :max-height="420" size="mini" align="left">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">

            <el-input v-model="props.row.token" :rows="8" auto-complete="off" type="textarea" />

          </el-form>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" type="selection" width="50" />
      <el-table-column header-align="center" align="center" prop="name" label="应用名称" sortable />
      <el-table-column header-align="center" align="center" prop="userName" label="账号信息" sortable />
      <el-table-column header-align="center" align="center" prop="applyTime" label="申请时间" :formatter="dateFormat" sortable />
      <el-table-column header-align="center" align="center" prop="overdueTime" label="过期时间" :formatter="dateFormat" sortable />
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" @change="change(scope.row)" />
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button icon="fa fa-edit" size="mini" type="primary" @click="handleEdit(scope)">编辑</el-button>
          <el-button icon="el-icon-phone-outline" size="mini" type="primary" @click="tokenApply(scope.row)">申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pageRequest.total>0" :total="pageRequest.total" :page.sync="pageRequest.pageNum" :limit.sync="pageRequest.pageSize" @pagination="findPage" />
    <!-- </el-col> -->
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="dataForm" label-width="120px" :rules="dataFormRules" :size="size" style="text-align:left;">
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="token申请说明：">
          <span>token时效默认为180天，过期后请重新申请。</span>
        </el-form-item>
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="申请账号" prop="userName">
          <el-input v-model="dataForm.userName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="dataForm.note" auto-complete="off" type="textarea" />
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
import { format } from '@/utils/datetime'
import Pagination from '@/components/Pagination'
import { findPage, addOrUpdate, tokenApply } from '@/api/admin-server/token-apple'
export default {
  name: 'TokenApply',
  components: {
    KtButton,
    Pagination
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: ''
      },
      loading: false,
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号信息', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: '',
        name: '',
        userName: '',
        password: '',
        note: ''
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
    findPage: function (data, optFlag) {
      this.loading = true
      if (optFlag && optFlag === 'reset') {
        this.filters.name = ''
      }
      this.pageRequest.params = { name: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function (data) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        const id = data.row.id
        removeById(id).then((res) => {
          if (res.code === 200) {
            this.$message({ message: '删除成功', type: 'success' })
            this.findPage(null)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
          this.loading = false
        })
      }).catch(() => {
      })
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: '',
        name: '',
        userName: '',
        password: '',
        note: ''
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
    },
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            addOrUpdate(params).then((res) => {
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
    tokenApply(data) {
      tokenApply({ id: data.id }).then((response) => {
        const { code } = response
        if (code === 200) {
          this.$message({ message: '申请成功', type: 'success' })
        } else {
          this.$message({ message: '申请失败', type: 'error' })
        }
        this.findPage(null)
      })
    },
    // 时间格式化
    dateFormat: function (row, column, cellValue, index) {
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
