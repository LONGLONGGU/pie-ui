<template>
  <div class="page-container">
    <el-row type="flex">
      <!-- begin 数据字典树信息 -->
      <el-col :span="5">
        <div>
          <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:100%;">
            <el-form :inline="true" :size="size">
              <el-form-item>
                <el-input v-model="filterName" placeholder="输入关键字进行🔍" />
              </el-form-item>
              <el-form-item>
                <kt-button
                  icon="fa fa-plus"
                  label="新增"
                  perms="sys:dictionary:add"
                  type="primary"
                  @click="addParent"
                />
              </el-form-item>
            </el-form>
          </div>
          <div style="float:left;padding-top:10px;padding-left:15px;width:100%;">
            <el-tree
              ref="dictTree"
              :props="defaultProps"
              :load="loadNode"
              node-key="id"
              lazy
              :expand-on-click-node="false"
              :filter-node-method="filterDictNode"
              highlight-current
              @node-click="dictNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <kt-button
                    icon="el-icon-plus"
                    perms="sys:dictionary:add"
                    label=""
                    type="text"
                    @click="handleDictAdd(node,data)"
                  />
                  <kt-button
                    icon="el-icon-edit-outline"
                    perms="sys:dictionary:edit"
                    label=""
                    type="text"
                    @click="handleDictEdit(node,data)"
                  />
                  <kt-button
                    icon="el-icon-delete"
                    perms="sys:dictionary:delete"
                    label=""
                    type="text"
                    @click="handleDictDelete(node,data)"
                  />
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <!-- end 数据字典树信息 -->

      <!-- begin 数据字典值信息-->
      <el-col :span="18">
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
          <el-form :inline="true" :model="filters" :size="size">
            <el-form-item>
              <el-input v-model="filters.name" placeholder="字典名称" />
            </el-form-item>
            <el-form-item>
              <kt-button
                icon="fa fa-search"
                perms="sys:dictData:find"
                label="搜索"
                type="success"
                @click="findPage(null)"
              />
            </el-form-item>
            <el-form-item>
              <kt-button
                icon="fa fa-plus"
                perms="sys:dictData:add"
                label="新增"
                type="primary"
                @click="handleDictDataAdd"
              />
            </el-form-item>
            <el-form-item>
              <kt-button
                icon="fa fa-trash-o"
                perms="sys:dictData:batDel"
                label="批量删除"
                type="danger"
                @click="handleDictDataBatDel"
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
          <el-table-column header-align="center" align="center" prop="name" label="名称" />
          <el-table-column header-align="center" align="center" prop="value" label="值" />
          <el-table-column header-align="center" align="center" prop="orderNum" label="排序" />
          <el-table-column header-align="center" align="center" prop="createTime" label="创建时间" />
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <kt-button
                icon="fa fa-edit"
                perms="sys:dictData:edit"
                label="编辑"
                @click="handleDictDataEdit(scope.row)"
              />
              <kt-button
                icon="fa fa-trash"
                perms="sys:dictData:delete"
                label="删除"
                type="danger"
                @click="handleDictDataDel(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页信息 -->
        <pagination
          v-show="pageRequest.total>0"
          :total="pageRequest.total"
          :page.sync="pageRequest.pageNum"
          :limit.sync="pageRequest.pageSize"
          @pagination="findPage"
        />

      </el-col>
      <!-- end 数据字典值信息 -->
    </el-row>

    <!-- begin 新增或修改数据字典模态框-->
    <el-dialog
      :title="!dictForm.id ? '新增字典' : '修改字典'"
      width="40%"
      :visible.sync="dictVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dictForm"
        :model="dictForm"
        :rules="dictRule"
        label-width="80px"
        :size="size"
        style="text-align:left;"
        @keyup.enter.native="submitDictForm()"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dictForm.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="上级字典" prop="parentName">
          <el-input v-model="dictForm.parentName" placeholder="上级字典" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="dictForm.code" placeholder="编码" />
        </el-form-item>
        <el-form-item label="排序值" prop="orderNum">
          <el-input v-model="dictForm.orderNum" placeholder="排序值" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dictVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click="submitDictForm()">确定</el-button>
      </span>
    </el-dialog>
    <!-- end 新增或修改数据字典模态框-->

    <!-- begin 数据字典值模态框 -->
    <el-dialog :title="operation?'新增':'修改'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
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
        <el-form-item label="值" prop="value">
          <el-input v-model="dataForm.value" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序" prop="odr">
          <el-input v-model="dataForm.odr" auto-complete="off" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="dataForm.mark" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">关闭</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitFormData">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- end 数据字典值模态框 -->

  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import Pagination from '@/components/Pagination'
import { userStatusSwitching, findUserRoles, batchDelete, importUserExcel, exportExcelUser } from '@/api/admin-server/user'
import { asyncFindTree, validateDicCode, deleteDict, findPage, findDataSourceList, saveAdd, deleteNode, saveData, deleteData } from '@/api/admin-server/dictionary'
import { findDeptTree } from '@/api/admin-server/dept'
export default {
  components: {
    KtButton,
    Pagination
  },
  data() {
    return {
      size: 'small',
      filterName: '',
      loading: false,
      editLoading: false,
      curNode: null,
      currentDictNode: null,
      // 数据字树形结构属性信息
      defaultProps: { // tree 控件的数据结构，需要设置 isLeaf
        children: 'children',
        label: 'name',
        isLeaf: 'hasChildren'
      },
      // 数据字典模态框是否显示
      dictVisible: false,
      // 数据字典表单信息
      dictForm: {
        id: '',
        name: '',
        code: '',
        parentId: '',
        parentName: '',
        orderNum: 0
      },
      // 数据字典验证规则
      dictRule: {
        name: [
          { required: true, message: '数据字典名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字典编码不能为空', trigger: 'blur' },
          // 自定义验证
          { validator: (rule, value, callback) => {
            const param = {
              'id': this.dictForm.id,
              'code': value
            }
            validateDicCode(param).then((res) => {
              if (res.code === 200) {
                callback()
              } else {
                callback(new Error(res.msg || '验证未通过，数据字典已经存在该code信息'))
              }
            })
          }, trigger: 'blur' }
        ]
      },
      filters: {
        name: '',
        dictCode: ''
      },

      dataSourceList: [],
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示

      dataFormRules: {
        value: [
          { required: true, message: '请输入值！', trigger: 'blur' }
        ]
      },
      isEdit: false,
      // 新增编辑界面数据
      dataForm: {
        id: '',
        del_flag: '',
        odr: '',
        value: '',
        mark: '',
        dictionaryId: ''
      },
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      roles: [],
      selections: [], // 列表选中列
      isShowUserDeptTree: false
    }
  },
  watch: {
    filterName(val) {
      this.$refs.dictTree.filter(val)
    }
  },
  created() {
    // this.findPage()
  },
  mounted() {
    // this.findDeptTree()
    // this.initColumns()
    // this.findDataSourceList()
  },
  methods: {
    addParent: function() {
      this.dictVisible = true
      this.dictForm = {
        id: '',
        name: '',
        code: '',
        parentId: null,
        parentName: '顶级字典',
        orderNum: 0
      }
      const dictTree = this.$refs.dictTree
      this.curNode = dictTree.root
    },
    // 异步加载数据字典树形结构信息
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(await this.getTagList())
      } else {
        return resolve(await this.getTagApiList(node.data.id))
      }
    },
    async getTagList() {
      const res = await asyncFindTree(0)
      const tags = res.data
      return tags
    },
    async getTagApiList(tag) {
      const res = await asyncFindTree(tag)
      const results = res.data
      return results
    },
    // 数据字典搜索功能，只有异步加载完成的才能实现搜索
    filterDictNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 数据字典单击事件
    dictNodeClick(data, node) {
      if (this.currentDictNode && this.currentDictNode === data) {
        this.currentDictNode = null
        node.isCurrent = false
      } else {
        this.currentDictNode = data
        node.isCurrent = true
      }
      // 查询列表信息
      this.findPage(this.currentDictNode)
    },
    // 数据字典刷新功能
    partialRefreshpartialRefresh(node) {
      node.loaded = false
      node.expand()
    },
    // 数据字典添加
    handleDictAdd: function(node, data) {
      this.dictVisible = true
      this.curNode = node
      this.dictForm = {
        id: '',
        name: '',
        code: '',
        parentId: this.curNode.data.id,
        parentName: this.curNode.data.name,
        orderNum: 0
      }
    },
    // 编辑数据字典信息
    handleDictEdit: function(node, data) {
      this.curNode = node.parent
      this.dictVisible = true
      Object.assign(this.dictForm, data)
    },
    // 删除数据字典信息
    handleDictDelete(node, data) {
      this.curNode = node.parent
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const id = data.id
        deleteDict(id).then((res) => {
          debugger
          if (res.code === 200) {
            this.$message({ message: res.msg || '删除成功', type: 'success' })
            this.partialRefreshpartialRefresh(this.curNode)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
        })
      })
    },
    // 提交数据字典数据
    submitDictForm() {
      this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dictForm)
            saveAdd(params).then((res) => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dictVisible = false
                this.$refs['dictForm'].resetFields()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.partialRefreshpartialRefresh(this.curNode)
            })
          })
        }
      })
    },

    // 数据字典值添加
    handleDictDataAdd: function() {

    },
    // 数据字典值修改
    handleDictDataEdit: function() {

    },
    // 数据字典值删除
    handleDictDataDel: function() {

    },
    // 批量删除数据字典
    handleDictDataBatDel: function() {

    },

    // 获取字典分页数据
    findPage: function(data) {
      this.loading = true
      let dictCode = ''
      if (data) {
        dictCode = data.code
      }
      this.pageRequest.params = { dictCode: dictCode, dictDataName: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },

    findDataSourceList: function() {
      findDataSourceList().then((res) => {
        var twoNode = []
        res.data.forEach(function(item, index) {
          twoNode.push({
            label: item.name,
            id: item.id,
            code: item.code
          })
        })
        this.dataSourceList = [{
          label: '数据字典',
          children: twoNode
        }]
      }).then(this.dataSourceList != null ? this.dataSourceList.callback : '')
    },
    remove(node, data) {
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.editLoading = true
        deleteNode({ 'id': data.id }).then((res) => {
          this.editLoading = false
          if (res.data === 1) {
            this.$message({ message: '操作成功', type: 'success' })
            this.findDataSourceList()
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
        })
      })
    },
    updateNode(node, data) {
      this.addNodeFlag = true
      this.addForm = {
        id: node.data.id,
        name: node.data.label,
        code: node.data.code
      }
    },
    removeData() {
      if (this.currDeptNode == null) {
        this.$message({ message: '请选择下级菜单！ ', type: 'error' })
        return
      }
      if (this.selections.length < 1) {
        this.$message({ message: '请选择需要删除字段！ ', type: 'error' })
        return
      }
      this.$confirm('确认删除这' + this.selections.length + '条数据吗？', '提示', {}).then(() => {
        this.editLoading = true
        deleteData({ 'ids': this.selections.map(item => item.id).toString() }).then((res) => {
          this.editLoading = false
          if (res.data) {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage(this.currDeptNode)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
        })
      })
    },
    addNode: function(node, data) {
      this.addNodeFlag = true
      this.addForm = {
        id: '',
        name: '',
        code: ''
      }
    },

    submitFormData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            params.dictionaryId = this.currDeptNode.id
            saveData(params).then((res) => {
              this.editLoading = false
              if (res.data === 1) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.findDataSourceList()
            })
          })
        }
      })
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
    dataAdd: function() {
      if (this.currDeptNode == null) {
        this.$message({ message: '请选择下级菜单！ ', type: 'error' })
        return
      }
      if (this.currDeptNode === null) {
        this.$message({ message: '请选择数据字典！', type: 'error' })
        return
      }
      if (this.$refs['dataForm'] !== undefined) {
        this.$refs['dataForm'].resetFields()
      }
      this.isShowUserDeptTree = false
      this.dataForm = {
        id: '',
        del_flag: '',
        odr: '',
        value: '',
        mark: '',
        dictionaryId: ''
      }
      this.dialogVisible = true
      this.operation = true
      this.isEdit = false
    },
    // 显示编辑界面
    dataEdit: function(params) {
      if (this.currDeptNode == null) {
        this.$message({ message: '请选择下级菜单！ ', type: 'error' })
        return
      }
      if (this.selections.length < 1) {
        this.$message({ message: '请选择需要修改字段！ ', type: 'error' })
        return
      }
      if (this.selections.length > 1) {
        this.$message({ message: '请选择单条字段！ ', type: 'error' })
        return
      }

      this.dataForm = {
        id: this.selections[0].id,
        del_flag: this.selections[0].delFlag,
        odr: this.selections[0].odr,
        value: this.selections[0].value,
        mark: this.selections[0].mark,
        dictionaryId: this.selections[0].dictionaryId
      }
      this.dialogVisible = true
      this.operation = false
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
