<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="机构名" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            perms="sys:role:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增"
            perms="sys:role:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="pageResult.content"
      :max-height="420"
      size="mini"
      align="left"
      @selection-change="handleSelectionChange"
    >
      <el-table-column header-align="center" align="center" type="selection" width="50" />
      <el-table-column header-align="center" align="center" prop="id" label="ID" sortable />
      <el-table-column header-align="center" align="center" prop="name" label="企业名称" sortable />
      <el-table-column header-align="center" align="center" prop="account" label="公众号账号" sortable />
      <el-table-column header-align="center" align="center" prop="appId" label="APP_ID" sortable />
      <el-table-column header-align="center" align="center" prop="appSecret" label="APP_SECRET" sortable />
      <el-table-column header-align="center" align="center" prop="token" label="TOKEN" sortable />
      <el-table-column header-align="center" align="center" prop="createdTime" :formatter="dateFormat" label="创建时间" sortable />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="change(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="185" align="center">
        <template slot-scope="scope">
          <el-button icon="fa fa-edit" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button icon="fa fa-trash" size="mini" type="danger" @click="handleDelete(scope)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageRequest.total>0"
      :total="pageRequest.total"
      :page.sync="pageRequest.pageNum"
      :limit.sync="pageRequest.pageSize"
      @pagination="findPage"
    />
    <!-- </el-col> -->
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="110px"
        :rules="dataFormRules"
        :size="size"
        style="text-align:left;"
      >
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="公众号账号" prop="account">
          <el-input v-model="dataForm.account" auto-complete="off" />
        </el-form-item>
        <el-form-item label="APP_ID" prop="appId">
          <el-input v-model="dataForm.appId" auto-complete="off" />
        </el-form-item>
        <el-form-item label="APP_SECRET" prop="appSecret">
          <el-input v-model="dataForm.appSecret" auto-complete="off" />
        </el-form-item>
        <el-form-item label="TOKEN" prop="token">
          <el-input v-model="dataForm.token" auto-complete="off" />
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
import { save, findPage, batchDelete } from '@/api/wechatinfo'
export default {
  name: 'Wechatinfo',
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
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入公众号账号', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '请输入公众号APP_ID', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '请输入公众号APP_SECRET', trigger: 'blur' }
        ],
        token: [
          { required: true, message: '请输入自定义Token', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: '',
        name: '',
        account: '',
        appId: '',
        appSecret: '',
        token: ''
      },
      selectRole: {},
      menuData: [],
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: 'children',
        label: ''
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
      // if (data !== null) {
      //   this.pageRequest = data.pageRequest
      // }
      this.loading = true
      this.pageRequest.params = { name: '', value: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function(data) {
      batchDelete(data.params).then(data.callback)
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: '',
        name: '',
        account: '',
        appId: '',
        appSecret: '',
        token: ''
      }
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
    },
    // 编辑
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
    // 时间格式化
    dateFormat: function(row, column) {
      return format(row[column.property])
    },
    handleCurrentChange: function() {

    },
    handleSelectionChange: function() {

    }

  }
}
</script>
<style scoped>

</style>
