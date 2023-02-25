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
          <el-table-column header-align="center" align="center" prop="dictionaryName" label="所属字典" />
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
          <el-input v-model="dictForm.parentName" disabled placeholder="上级字典" @click.native="getDictSelectTree" />
          <el-tree
            v-show="isShowDictSelect"
            ref="dictSelectTree"
            :props="defaultProps"
            :load="loadNode"
            node-key="id"
            lazy
            :expand-on-click-node="false"
            :filter-node-method="filterDictNode"
            highlight-current
            @node-click="(data,node,item) => dictSelectNodeClick(data,node,item,1)"
          />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="dictForm.code" placeholder="编码" />
        </el-form-item>
        <el-form-item label="排序值" prop="orderNum">
          <el-input-number v-model="dictForm.orderNum" controls-position="right" :min="0" label="排序值" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dictVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click="submitDictForm()">确定</el-button>
      </span>
    </el-dialog>
    <!-- end 新增或修改数据字典模态框-->

    <!-- begin 数据字典值模态框 -->
    <el-dialog :title=" !dictDataForm.id ? '新增':'修改'" width="40%" :visible.sync="dictDataVisible" :close-on-click-modal="false">
      <el-form
        ref="dictDataForm"
        :model="dictDataForm"
        label-width="80px"
        :rules="dictDataFormRules"
        :size="size"
        label-position="right"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dictDataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属字典" prop="dictionaryName">
          <el-input v-model="dictDataForm.dictionaryName" disabled placeholder="所属字典" @click.native="getDictSelectTree" />
          <el-tree
            v-show="isShowDictSelect"
            ref="dictSelectTree"
            :props="defaultProps"
            :load="loadNode"
            node-key="id"
            lazy
            :expand-on-click-node="false"
            :filter-node-method="filterDictNode"
            highlight-current
            @node-click="(data,node,item) => dictSelectNodeClick(data,node,item,2)"
          />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="dictDataForm.value" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序值" prop="orderNum">
          <el-input-number v-model="dictDataForm.orderNum" controls-position="right" :min="0" label="排序值" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="dictDataForm.mark" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dictDataVisible = false">关闭</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitDictDataForm">提交</el-button>
      </div>
    </el-dialog>
    <!-- end 数据字典值模态框 -->

  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import Pagination from '@/components/Pagination'
import { asyncFindTree, validateDicCode, deleteDict, findPage, saveAdd, saveData, deleteData, batchDeleteData } from '@/api/admin-server/dictionary'
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
      // 是否显示树形下拉
      isShowDictSelect: false,
      // 数据字树形结构属性信息
      defaultProps: { // tree 控件的数据结构，需要设置 isLeaf
        children: 'children',
        label: 'name',
        isLeaf: 'hasChildren'
      },
      // 数据字典模态框是否显示
      dictVisible: false,
      refreshNode: null,
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
      // 字典值模态框是否显示
      dictDataVisible: false,
      // 字典值表单值信息
      dictDataForm: {
        id: '',
        dictionaryId: '',
        dictionaryName: '',
        name: '',
        value: '',
        orderNum: '',
        mark: ''
      },
      // 数据字典值表单验证规则
      dictDataFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ],
        dictionaryName: [
          { required: true, message: '所属数据字典值不能为空', trigger: 'change' }
        ]
      },
      // 分页参数设置
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: {},
      selections: [] // 列表选中列
    }
  },
  watch: {
    filterName(val) {
      this.$refs.dictTree.filter(val)
    }
  },
  created() {
    this.findPage()
  },
  mounted() {
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
        this.filters.dictCode = ''
        node.isCurrent = false
      } else {
        this.currentDictNode = data
        this.filters.dictCode = data.code
        node.isCurrent = true
      }
      // 查询列表信息
      this.findPage(null)
    },
    // 数据字典刷新功能
    partialRefreshpartialRefresh(node, refreshNode) {
      if (refreshNode) {
        refreshNode.loaded = false
        refreshNode.expand()
        node.loaded = false
        node.expand()
      } else {
        node.loaded = false
        node.expand()
      }
    },
    // 选择父级数据字典信息
    getDictSelectTree: function() {
      this.isShowDictSelect = true
    },
    // 父级选择事件
    dictSelectNodeClick(data, node, item, type) {
      if (type === 1) {
        this.dictForm.parentId = data.id
        this.dictForm.parentName = data.name
        this.refreshNode = this.$refs.dictTree.getNode(data)
      } else if (type === 2) {
        this.dictDataForm.dictionaryId = data.id
        this.dictDataForm.dictionaryName = data.name
      }
      this.isShowDictSelect = false
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
      if (node.level === 1) {
        this.dictForm.parentName = '顶级字典'
      } else {
        this.dictForm.parentName = node.parent.data.name
      }
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
              this.partialRefreshpartialRefresh(this.curNode, this.refreshNode)
            })
          })
        }
      })
    },
    // 数据字典值添加
    handleDictDataAdd: function() {
      if (this.currentDictNode === null) {
        this.$message({ message: '请选择所属字典信息！', type: 'error' })
        return
      }
      if (this.$refs['dictDataForm'] !== undefined) {
        this.$refs['dictDataForm'].resetFields()
      }
      this.dictDataForm = {
        id: '',
        dictionaryId: this.currentDictNode.id,
        dictionaryName: this.currentDictNode.name,
        name: '',
        value: '',
        orderNum: '',
        mark: ''
      }
      this.isShowDictSelect = false
      this.dictDataVisible = true
    },
    // 数据字典值修改
    handleDictDataEdit: function(params) {
      if (this.$refs['dictDataForm'] !== undefined) {
        this.$refs['dictDataForm'].resetFields()
      }
      this.dictDataForm = Object.assign({}, params)
      this.isShowDictSelect = false
      this.dictDataVisible = true
    },
    // 数据字典值删除
    handleDictDataDel: function(data) {
      this.$confirm('确认删除该条记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteData(data.id).then((res) => {
          this.loading = false
          if (res.code === 200) {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage(null)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
        })
      })
    },
    // 批量删除数据字典值信息
    handleDictDataBatDel: function() {
      if (this.selections.length < 1) {
        this.$message({ message: '请选择需要删除的记录！', type: 'error' })
        return
      }
      this.$confirm('确认删除这' + this.selections.length + '条数据吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        const selectIds = this.selections.map(item => item.id).join(',')
        batchDeleteData({ ids: selectIds }).then((res) => {
          this.loading = false
          if (res.code === 200) {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage(null)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
        })
      })
    },
    // 提交数据字典值信息
    submitDictDataForm() {
      this.$refs.dictDataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dictDataForm)
            saveData(params).then((res) => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dictDataVisible = false
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                this.dictDataVisible = false
              }
              this.findPage(null)
            })
          })
        }
      })
    },
    // 获取字典分页数据
    findPage: function(data) {
      this.loading = true
      this.pageRequest.params = { dictCode: this.filters.dictCode, dictDataName: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },
    handleCurrentChange: function() {

    },
    // 表格选中操作
    handleSelectionChange: function(selections) {
      this.selections = selections
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property])
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
