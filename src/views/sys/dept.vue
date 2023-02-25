<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:100%;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-input v-model="filterName" placeholder="名称" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增"
            perms="sys:dept:add"
            type="primary"
            @click="addParent"
          />
        </el-form-item>
      </el-form>
    </div>
    <div style="float:left;padding-top:10px;padding-left:15px;width:30%;">
      <el-tree
        ref="deptTree"
        :props="defaultProps"
        :load="loadNode"
        node-key="id"
        lazy
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <kt-button
              icon="el-icon-plus"
              perms="sys:dept:add"
              label=""
              type="text"
              @click="handleAdd(node,data)"
            />
            <kt-button
              icon="el-icon-edit-outline"
              perms="sys:dept:edit"
              label=""
              type="text"
              @click="handleEdit(node,data)"
            />
            <kt-button
              icon="el-icon-delete"
              perms="sys:dept:delete"
              label=""
              type="text"
              @click="handleDelete(node,data)"
            />
          </span>
        </span>
      </el-tree>
    </div>
    <!-- 新增修改界面 -->
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
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
        @keyup.enter.native="submitForm()"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="上级机构" prop="name">
          <el-input v-model="dataForm.parentName" placeholder="上级机构" disabled @click.native="getDeptSelectTree" />
          <el-tree
            v-show="isShowDeptSelect"
            ref="deptSelectTree"
            :props="defaultProps"
            :load="loadNode"
            node-key="id"
            lazy
            :expand-on-click-node="false"
            highlight-current
            @node-click="(data,node,item) => deptSelectNodeClick(data,node,item)"
          />
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号" />
        </el-form-item>
        <el-form-item label="角色" prop="deptRoles">
          <el-select v-model="dataForm.deptRoles" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click="submitForm()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import { asyncFindTree, save, batchDelete, getDeptRoles } from '@/api/admin-server/dept'
import { findAll } from '@/api/admin-server/role'
export default {
  components: {
    KtButton
  },
  data() {
    return {
      size: 'small',
      filterName: '',
      dialogVisible: false,
      isShowDeptSelect: false,
      dataForm: {
        id: '',
        name: '',
        parentId: 0,
        parentName: '',
        orderNum: 0,
        deptRoles: []
      },
      roles: [],
      dataRule: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级机构不能为空', trigger: 'change' }
        ]
      },
      defaultProps: { // tree 控件的数据结构，需要设置 isLeaf
        children: 'children',
        label: 'name',
        isLeaf: 'hasChildren'
      },
      curPath: null,
      curNode: null,
      refreshNode: null
    }
  },
  watch: {
    filterName(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() {
    this.findRoles()
  },
  mounted() {
  },
  methods: {
    addParent: function() {
      this.dialogVisible = true
      this.dataForm = {
        id: '',
        name: '',
        parentId: null,
        parentName: '顶级部门',
        orderNum: 0
      }
      const deptTree = this.$refs.deptTree
      this.curNode = deptTree.root
    },
    handleAdd: function(node, data) {
      this.dialogVisible = true
      this.curNode = node
      this.dataForm = {
        id: '',
        name: '',
        parentId: this.curNode.data.id,
        parentName: this.curNode.data.name,
        orderNum: 0
      }
      this.isShowDeptSelect = false
    },
    handleEdit: function(node, data) {
      this.curNode = node.parent
      this.dialogVisible = true
      this.isShowDeptSelect = false
      Object.assign(this.dataForm, data)
      this.getDeptRoles(data)
    },
    handleDelete(node, data) {
      this.curNode = node.parent
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const params = this.getDeleteIds([], data)
        batchDelete(params).then(res => {
          if (res.code === 200) {
            this.$message({ message: '删除成功', type: 'success' })
            this.partialRefreshpartialRefresh(this.curNode)
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
        })
      })
    },
    // 获取删除的包含子机构的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.id })
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i])
        }
      }
      return ids
    },
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            const deptRoles = []
            for (let i = 0, len = params.deptRoles.length; i < len; i++) {
              const deptRole = {
                deptId: params.id,
                roleId: params.deptRoles[i]
              }
              deptRoles.push(deptRole)
            }
            params.deptRoles = deptRoles

            save(params).then((res) => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.partialRefreshpartialRefresh(this.curNode, this.refreshNode)
            })
          })
        }
      })
    },
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property])
    },
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
    nodeClick(data, node) {
      // this.curPath = data.path
      // this.curNode = node
    },
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
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDeptSelectTree: function() {
      this.isShowDeptSelect = true
    },
    // 树形菜单选择
    deptSelectNodeClick(data, node, item) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
      this.isShowDeptSelect = false

      // 通过修改的时候选中的节点处理需要刷新的节点
      this.refreshNode = this.$refs.deptTree.getNode(data)
    },
    // 加载所有角色信息
    findRoles: function() {
      findAll().then((res) => {
        this.roles = res.data
      })
    },
    // 加载部门角色信息
    getDeptRoles: function(data) {
      getDeptRoles(data.id).then((res) => {
        const roles = res.data
        const deptRoles = []
        for (let i = 0, len = roles.length; i < len; i++) {
          deptRoles.push(roles[i].roleId)
        }
        this.dataForm.deptRoles = deptRoles
      })
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
