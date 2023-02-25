<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="机构名" @keyup.enter.native="findPage(null)" />
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
            icon="fa fa-refresh"
            label="重置"
            perms="sys:role:view"
            type="danger"
            @click="findPage(null,'reset')"
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
      @current-change="handleRoleSelectChange"
    >
      <el-table-column header-align="center" align="center" type="selection" width="50" />
      <el-table-column header-align="center" align="center" prop="name" label="机构名称" sortable />
      <el-table-column header-align="center" align="center" prop="districtName" label="行政区划" sortable />
      <el-table-column header-align="center" align="center" prop="remark" label="备注" sortable />
      <el-table-column header-align="center" align="center" prop="createUserName" label="创建人" sortable />
      <el-table-column header-align="center" align="center" prop="createTime" label="创建时间" sortable />
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
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button icon="fa fa-edit" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <!--机构先不提供删除功能-->
          <!--<el-button icon="fa fa-trash" size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>-->
          <el-button icon="fa fa-cog" size="mini" type="danger" @click="resetPwd(scope)">重置密码</el-button>
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
        label-width="80px"
        :rules="dataFormRules"
        :size="size"
        style="text-align:left;"
      >
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item v-if="operation" label="管理密码" prop="orgAdminPwd">
          <el-input v-model="dataForm.orgAdminPwd" type="password" auto-complete="off" />
        </el-form-item>
        <Area :label="dataForm.districtName" @getCheckedNodes="getCheckedNodes" />
        <el-form-item label="排序编号" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitForm">提交
        </el-button>
      </div>
    </el-dialog>
    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span><B>机构菜单授权</B></span>
      </div>
      <el-tree
        ref="menuTree"
        v-loading="menuLoading"
        :data="menuData"
        size="mini"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        style="width: 100%;padding-top:20px;"
        :render-content="renderContent"
        element-loading-text="拼命加载中"
        :check-strictly="true"
        @check-change="handleMenuCheckChange"
      />
      <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
        <el-checkbox v-model="checkAll" :disabled="this.selectRole.id == null" @change="handleCheckAll"><b>全选</b>
        </el-checkbox>
      </div>
      <div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
        <kt-button
          label="重置"
          perms="sys:role:edit"
          type="primary"
          :disabled="this.selectRole.id == null"
          @click="resetSelection"
        />
        <kt-button
          label="提交"
          perms="sys:role:edit"
          type="primary"
          :disabled="this.selectRole.id == null"
          :loading="authLoading"
          @click="submitAuthForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import Pagination from '@/components/Pagination'
import { save, findPage, removeById, resetAdminPwd, saveOrgMenus, findOrgMenus } from '@/api/admin-server/org'
import { findMenuTree } from '@/api/admin-server/menu'
import Area from '@/components/ZST/Area'
export default {
  name: 'Org',
  components: {
    KtButton,
    Pagination,
    Area
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
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        orgAdminPwd: [
          { required: true, message: '请输入管理密码', trigger: 'blur' }
        ],
        districtName: [
          { required: true, message: '请选择行政区划信息', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: '',
        name: '',
        districtId: '',
        districtName: '',
        orgAdminPwd: '',
        orderNum: 0,
        remark: ''
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
      },
      currentDistrictNode: null
    }
  },
  created() {
    this.findPage()
  },
  mounted() {
  },
  methods: {
    getCheckedNodes(data) {
      this.dataForm.districtId = data.id
      this.dataForm.districtName = data.name
    },
    // 获取分页数据
    findPage: function(data, optFlag) {
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
        this.findTreeData()
      }).then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function(data) {
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
    handleAdd: function() {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: '',
        name: '',
        orgAdminPwd: '',
        districtId: '',
        districtName: '',
        orderNum: 0,
        remark: ''
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
          if (this.dataForm.districtId === '') {
            this.$message({ message: '行政区划不能为空！', type: 'warning' })
            return
          }
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
    // 获取数据
    findTreeData: function() {
      this.menuLoading = true
      findMenuTree().then((res) => {
        this.menuData = res.data
        this.menuLoading = false
      })
    },
    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null) {
        return
      }
      this.selectRole = val
      findOrgMenus({ 'orgId': this.selectRole.id }).then((res) => {
        this.currentRoleMenus = res.data
        this.$refs.menuTree.setCheckedNodes(res.data)
      })
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        const parentId = data.parentId
        if (parentId !== null) {
          this.$refs.menuTree.setChecked(parentId, true, false)
        }
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false)
          })
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus)
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        const allMenus = []
        this.checkAllMenu(this.menuData, allMenus)
        this.$refs.menuTree.setCheckedNodes(allMenus)
      } else {
        this.$refs.menuTree.setCheckedNodes([])
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu)
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus)
        }
      })
    },
    // 角色菜单授权提交
    submitAuthForm() {
      const roleId = this.selectRole.id
      if (this.selectRole.name === 'admin') {
        this.$message({ message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error' })
        return
      }
      this.authLoading = true
      const checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      const roleMenus = []
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        const roleMenu = { orgId: roleId, menuId: checkedNodes[i].id }
        roleMenus.push(roleMenu)
      }
      saveOrgMenus({ orgId: roleId, orgMenus: roleMenus }).then((res) => {
        if (res.code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.authLoading = false
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class='column-container'>
          <span style='text-algin:center;margin-right:80px;'>{data.name}</span>
          <span style='text-algin:center;margin-right:80px;'>
            <el-tag type={data.type === 0 ? '' : data.type === 1 ? 'success' : 'info'} size='small'>
              {data.type === 0 ? '目录' : data.type === 1 ? '菜单' : '按钮'}
            </el-tag>
          </span>
          <span style='text-algin:center;margin-right:80px;'> <i class={data.icon}></i></span>
          <span style='text-algin:center;margin-right:80px;'>{data.parentName ? data.parentName : '顶级菜单'}</span>
          <span style='text-algin:center;margin-right:80px;'>{data.url ? data.url : '\t'}</span>
        </div>)
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      console.log(cellValue)
      console.log(index)
      return format(row[column.property])
    },
    handleCurrentChange: function() {

    },
    handleSelectionChange: function() {

    },
    change: function(data) {
      save(data).then((res) => {
        if (res.code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.findPage(null)
      })
    },
    resetPwd: function(data) {
      this.$confirm('确认重置当前机构管理员密码吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        const id = data.row.id
        resetAdminPwd(id).then((res) => {
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
