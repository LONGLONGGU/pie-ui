<template>
  <div class="page-container">
    <el-row type="flex">
      <el-col :span="5">
        <div>
          <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:100%;">
            <el-form :inline="true" :size="size">
              <el-form-item>
                <el-input v-model="filterName" placeholder="输入关键字进行🔍" />
              </el-form-item>
            </el-form>
          </div>
          <div style="float:left;padding-top:10px;padding-left:15px;width:100%;">
            <el-tree
              ref="deptTree"
              :props="defaultProps"
              :load="loadNode"
              node-key="id"
              lazy
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              highlight-current
              @node-click="nodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
          <el-form :inline="true" :model="filters" :size="size">
            <el-form-item>
              <el-input v-model="filters.name" placeholder="用户账号" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="filters.nickName" placeholder="用户昵称" />
            </el-form-item>
            <el-form-item>
              <kt-button
                icon="el-icon-search"
                label="查询"
                perms="sys:user:findPage"
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
            <el-form-item>
              <el-upload
                class="upload-demo"
                :show-file-list="false"
                action
                :http-request="uploadFiles"
              >
                <kt-button
                  icon="el-icon-upload"
                  label="导入"
                  perms="sys:user:import"
                  type="primary"
                />
              </el-upload>
            </el-form-item>
            <el-form-item>
              <kt-button
                icon="el-icon-download"
                label="导出"
                perms="sys:user:export"
                type="primary"
                @click="exportExcelUser"
              />
            </el-form-item>
            <el-form-item>
              <kt-button
                icon="el-icon-tickets"
                label="导出全部"
                perms="sys:user:export"
                type="primary"
                @click="exportAllExcelUser"
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
          <el-table-column header-align="center" align="center" prop="name" label="用户帐号" sortable />
          <el-table-column header-align="center" align="center" prop="nickName" label="用户昵称" sortable />
          <el-table-column header-align="center" align="center" prop="deptName" width="500" label="部门" sortable />
<!--          <el-table-column header-align="center" align="center" prop="roleNames" label="角色" sortable />-->
<!--          <el-table-column header-align="center" align="center" prop="email" label="邮箱" sortable />-->
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
          <el-table-column label="操作" width="280" align="center">
            <template slot-scope="scope">
              <kt-button
                icon="fa fa-edit"
                label="编辑"
                perms="sys:user:edit"
                @click="handleEdit(scope)"
              />
              <kt-button
                icon="fa fa-trash"
                label="删除"
                perms="sys:user:delete"
                type="danger"
                @click="handleDelete(scope.row)"
              />
              <kt-button
                icon="fa fa-cog"
                label="重置密码"
                perms="sys:user:resetPwd"
                type="danger"
                @click="resetPwd(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="toolbar" style="padding:10px;">
          <kt-button
            label="批量删除"
            perms="sys:user:delete"
            :size="size"
            type="danger"
            :disabled="selections.length === 0"
            style="float:left;"
            @click="handleBatchDelete()"
          />
          <kt-button
            label="批量重置密码"
            perms="sys:user:resetPwd"
            :size="size"
            type="danger"
            :disabled="selections.length === 0"
            @click="batchResetPwd()"
          />
          <pagination
            v-show="pageRequest.total>0"
            :total="pageRequest.total"
            :page.sync="pageRequest.pageNum"
            :limit.sync="pageRequest.pageSize"
            @pagination="findPage"
          />
        </div>
      </el-col>
    </el-row>
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
        <el-form-item label="用户帐号" prop="name">
          <el-input v-if="isEdit" v-model="dataForm.name" auto-complete="off" :disabled="true" />
          <el-input v-else-if="!isEdit" v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="dataForm.nickName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-input v-model="dataForm.deptName" auto-complete="off" disabled @click.native="getUserDeptTree" />
          <el-tree
            v-show="isShowUserDeptTree"
            ref="userDeptTree"
            :props="defaultProps"
            :load="loadNode"
            node-key="id"
            lazy
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            @node-click="userNodeClick"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序值" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序值" />
        </el-form-item>
        <el-form-item label="角色" prop="userRoles">
          <el-select v-model="dataForm.userRoles" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
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
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import Pagination from '@/components/Pagination'
import { findPage, save, userStatusSwitching, findUserRoles, batchDelete, resetPwd, importUserExcel, exportExcelUser, exportAllExcelUser } from '@/api/admin-server/user'
import { uploadFiles } from '@/api/admin-server/attachments'
import { asyncFindTree, findDeptTree } from '@/api/admin-server/dept'
import { findAll } from '@/api/admin-server/role'
export default {
  components: {
    KtButton,
    Pagination
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: '',
        nickName: '',
        deptId: ''
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
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ]
      },
      isEdit: false,
      // 新增编辑界面数据
      dataForm: {
        id: '',
        name: '',
        nickName: '',
        password: '',
        deptId: '',
        deptName: '',
        email: '',
        mobile: '',
        orderNum: 0,
        status: '',
        userRoles: []
      },
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      roles: [],
      selections: [], // 列表选中列
      defaultProps: { // tree 控件的数据结构，需要设置 isLeaf
        children: 'children',
        label: 'name',
        isLeaf: 'hasChildren'
      },
      currDeptNode: null,
      filterName: '',
      isShowUserDeptTree: false
    }
  },
  watch: {
    filterName(val) {
      this.$refs.deptTree.filter(val)
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
      this.pageRequest.params = { name: this.filters.name, nickName: this.filters.nickName, deptId: this.filters.deptId }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
        this.findRoles()
      }).then(data != null ? data.callback : '')
    },
    uploadFiles(fileObject) {
      const formData = new FormData()
      formData.set('file', fileObject.file)
      uploadFiles(formData).then(response => {
        const { data } = response
        this.importUserExcel(data)
        this.$message({ message: response, type: 'success' })
      })
    },
    importUserExcel: function(data) {
      importUserExcel(data).then(response => {
        this.$message({ message: response, type: 'success' })
      })
    },
    exportExcelUser: function() {
      this.pageRequest.params = { name: this.filters.name, deptId: this.filters.deptId }
      exportExcelUser(this.pageRequest).then((response) => {
        console.log(response)
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        console.log(blob)
        const filename = '问卷信息.xlsx'
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
    exportAllExcelUser() {
      const loading = this.$loading({
        lock: true,
        text: '全系统用户导出中，需要时间可能会久一些，请耐心等待......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      exportAllExcelUser().then((response) => {
        console.log(response)
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        console.log(blob)
        const filename = '一部手机招商通账号信息.xlsx'
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
    handleChange(file, fileList) {
      console.log(file)
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
    batchResetPwd: function() {
      const ids = this.selections.map(item => item.id)
      this.$confirm('确认重置当前用户密码吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        ids.forEach(id => {
          resetPwd(id).then((res) => {
            if (res.code === 200) {
              this.$message({ message: res.msg, type: 'success' })
              this.findPage(null)
            } else {
              this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
            }
            this.loading = false
          })
        })
      })
    },
    // 重置密码
    resetPwd: function(data) {
      this.$confirm('确认重置当前用户密码吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        const id = data.id
        resetPwd(id).then((res) => {
          if (res.code === 200) {
            this.$message({ message: res.msg, type: 'success' })
            this.findPage(null)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
          this.loading = false
        })
      }).catch(() => {
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
      if (this.currDeptNode === null) {
        this.$message({ message: '请选择所属部门！', type: 'error' })
        return
      }
      if (this.$refs['dataForm'] !== undefined) {
        this.$refs['dataForm'].resetFields()
      }
      this.isShowUserDeptTree = false
      this.dataForm = {
        id: '',
        name: '',
        nickName: '',
        password: '',
        deptId: this.currDeptNode.id,
        deptName: this.currDeptNode.name,
        email: '',
        mobile: '',
        status: '',
        userRoles: []
      }
      this.dialogVisible = true
      this.operation = true
      this.isEdit = false
    },
    // 显示编辑界面
    handleEdit: function(params) {
      if (this.$refs['dataForm'] !== undefined) {
        this.$refs['dataForm'].resetFields()
      }
      this.isShowUserDeptTree = false
      this.isEdit = true
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
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                this.dialogVisible = false
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
        { prop: 'name', label: '用户账号', minWidth: 120 },
        { prop: 'nickName', label: '用户昵称', minWidth: 120 },
        { prop: 'deptName', label: '部门', minWidth: 120 },
        { prop: 'roleNames', label: '角色', minWidth: 100 },
        { prop: 'email', label: '邮箱', minWidth: 120 },
        { prop: 'mobile', label: '手机', minWidth: 100 },
        { prop: 'status', label: '状态', minWidth: 70 }
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns))
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(await this.getTagList())
      } else {
        console.log(node)
        return resolve(await this.getTagApiList(node.data.id))
      }
    },
    async getTagList() {
      const res = await asyncFindTree(0)
      const tags = res.data
      return tags
    },
    async getTagApiList(tag) {
      console.log(tag)
      const res = await asyncFindTree(tag)
      const results = res.data
      return results
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClick(data, node) {
      if (this.currDeptNode && this.currDeptNode === data) {
        this.currDeptNode = null
        this.filters.deptId = ''
        node.isCurrent = false
      } else {
        this.currDeptNode = data
        this.filters.deptId = data.id
        node.isCurrent = true
      }
      this.findPage(null)
    },
    getUserDeptTree() {
      this.isShowUserDeptTree = true
    },
    userNodeClick(data, node) {
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
      this.isShowUserDeptTree = false
      this.findPage(null)
    }

  }
}
</script>
<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 8px;
  }
</style>
