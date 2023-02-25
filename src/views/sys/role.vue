<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="角色名" />
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
    <!--表格内容栏-->
    <kt-table
      perms-edit="sys:role:edit"
      perms-delete="sys:role:delete"
      :highlight-current-row="true"
      :stripe="false"
      :data="pageResult"
      :columns="columns"
      :show-batch-delete="false"
      @handleCurrentChange="handleRoleSelectChange"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    />
    <!-- </el-col> -->
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="dataForm" label-width="80px" :rules="dataFormRules" :size="size">
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="备注 " prop="remark">
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
        <span><B>角色菜单授权</B></span>
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
import KtTable from '@/components/KtTable'
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import { save, findPage, deleteById, findRoleMenus, saveRoleMenus } from '@/api/admin-server/role'
import { findMenuTree } from '@/api/admin-server/menu'
export default {
  components: {
    KtTable,
    KtButton
    // TableTreeColumn
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: ''
      },
      columns: [
        // { prop: 'id', label: 'ID', minWidth: 50 },
        { prop: 'name', label: '角色名', minWidth: 120 },
        { prop: 'remark', label: '备注', minWidth: 120 },
        { prop: 'createBy', label: '创建人', minWidth: 120 },
        { prop: 'createTime', label: '创建时间', minWidth: 120, formatter: this.dateFormat }
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: '',
        name: '',
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
      }
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
      this.pageRequest.params = { name: '', value: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.pageResult = res.data
        this.findTreeData()
      }).then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function(data) {
      const id = data.params[0].id
      deleteById(id).then(data.callback)
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: '',
        name: '',
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
      if (val == null || val.val == null) {
        return
      }
      this.selectRole = val.val
      findRoleMenus({ 'roleId': this.selectRole.id }).then((res) => {
        this.currentRoleMenus = res.data
        this.$refs.menuTree.setCheckedNodes(res.data)
      })
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      console.log(data)
      console.log(check)
      console.log(subCheck)
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
      if (this.selectRole.name == 'admin') {
        this.$message({ message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error' })
        return
      }
      this.authLoading = true
      const checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      console.log(checkedNodes)
      const roleMenus = []
      for (let i = 0, len = checkedNodes.length; i < len; i++) {
        const roleMenu = { roleId: roleId, menuId: checkedNodes[i].id }
        roleMenus.push(roleMenu)
      }
      saveRoleMenus({ roleId: roleId, roleMenus: roleMenus }).then((res) => {
        if (res.code == 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.authLoading = false
      })
    },
    renderContent(h, { node, data, store }) {
      console.log(node)
      console.log(store)
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
