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
            perms="sys:role:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="添加"
            perms="sys:user:add"
            type="primary"
            @click="handleAdd"
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
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column header-align="center" align="center" type="selection" width="50" />
      <el-table-column header-align="center" align="center" prop="id" label="ID" sortable width="100" />
      <el-table-column header-align="center" align="center" prop="name" label="用户名" sortable />
      <el-table-column header-align="center" align="center" prop="deptName" label="部门" sortable />
      <el-table-column header-align="center" align="center" prop="roleNames" label="角色" sortable />
      <el-table-column header-align="center" align="center" prop="email" label="邮箱" sortable />
      <el-table-column header-align="center" align="center" prop="mobile" label="手机" sortable />
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
          <el-button icon="fa fa-trash" size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar" style="padding:10px;">
      <kt-button
        label="批量删除"
        perms="sys:user:delete"
        :size="size"
        type="danger"
        :disabled="this.selections.length === 0"
        style="float:left;"
        @click="handleBatchDelete()"
      />
      <pagination
        v-show="pageRequest.total>0"
        :total="pageRequest.total"
        :page.sync="pageRequest.pageNum"
        :limit.sync="pageRequest.pageSize"
        @pagination="findPage"
      />
    </div>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        :size="size"
        label-position="right"
      >
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptName"
            :node-key="''+dataForm.deptId"
            :current-change-handle="deptTreeCurrentChangeHandle"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off" />
        </el-form-item>
        <el-form-item v-if="!operation" label="角色" prop="userRoles">
          <el-select v-model="dataForm.userRoles" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in roles" :key="item.id" :label="item.remark" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">关闭</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitForm">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from '@/components/PopupTreeInput'
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import Pagination from '@/components/Pagination'
import { findPage, save, userStatusSwitching, findUserRoles, batchDelete } from '@/api/user'
import { findAll } from '@/api/role'
import { findDeptTree } from '@/api/dept'
export default {
  components: {
    PopupTreeInput,
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
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: '',
        name: '',
        password: '',
        deptId: '',
        deptName: '',
        email: '',
        mobile: '',
        status: '',
        userRoles: []
      },
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      roles: [],
      selections: [] // 列表选中列
    }
  },
  created() {
    this.findPage()
  },
  mounted() {
    this.findDeptTree()
    this.initColumns()
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
        this.findRoles()
      }).then(data != null ? data.callback : '')
    },
    // 加载角色信息
    findRoles: function() {
      findAll().then((res) => {
        // 加载角色集合
        this.roles = res.data
      })
    },
    // 加载用户角色信息
    findUserRoles: function(data) {
      findUserRoles({ userId: data.id }).then((res) => {
        const roles = res.data
        const userRoles = []
        for (let i = 0, len = roles.length; i < len; i++) {
          userRoles.push(roles[i].roleId)
        }
        console.log(userRoles)
        this.dataForm.userRoles = userRoles
      })
    },
    // 删除
    handleDelete: function(data) {
      this.delete(data.id)
    },
    // 批量删除
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
    handleCurrentChange: function() {

    },
    handleSelectionChange: function(selections) {
      this.selections = selections
      console.log(this.selections)
    },
    change: function(data) {
      userStatusSwitching(data).then((res) => {
        this.editLoading = false
        if (res.code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.findPage(null)
      })
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: '',
        name: '',
        password: '',
        deptId: '',
        deptName: '',
        email: '',
        mobile: '',
        status: '',
        userRoles: []
      }
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      this.findUserRoles(params.row)
    },
    // 编辑
    submitForm: function() {
      if (this.dataForm.deptId === '') {
        this.$message({ message: '请选择所属部门！', type: 'error' })
        return
      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            const userRoles = []
            for (let i = 0, len = params.userRoles.length; i < len; i++) {
              const userRole = {
                userId: params.id,
                roleId: params.userRoles[i]
              }
              userRoles.push(userRole)
            }
            params.userRoles = userRoles
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
    // 获取部门列表
    findDeptTree: function() {
      findDeptTree().then((res) => {
        this.deptData = res.data
      })
    },
    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      console.log(node)
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      console.log(cellValue)
      console.log(index)
      return format(row[column.property])
    },
    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true)
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns
      this.$refs.tableColumnFilterDialog.setDialogVisible(false)
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: 'id', label: 'ID', minWidth: 50 },
        { prop: 'name', label: '用户名', minWidth: 120 },
        { prop: 'deptName', label: '部门', minWidth: 120 },
        { prop: 'roleNames', label: '角色', minWidth: 100 },
        { prop: 'email', label: '邮箱', minWidth: 120 },
        { prop: 'mobile', label: '手机', minWidth: 100 },
        { prop: 'status', label: '状态', minWidth: 70 }
        // {prop:"createBy", label:"创建人", minWidth:120},
        // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns))
    }
  }
}
</script>

<style scoped>
</style>
