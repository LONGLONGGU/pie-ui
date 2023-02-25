<template>
  <div class="page-container">
    <el-row type="flex">
      <el-col :span="6">
        <!--工具栏-->
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:100%;">
          <el-form :inline="true" :size="size">
            <el-form-item>
              <el-input placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-folder" @click="addFolder">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width:100%;">
          <el-tree
            ref="dataSourceTree"
            :props="defaultProps"
            :load="loadNode"
            node-key="id"
            lazy
            default-expand-all
            :expand-on-click-node="false"
            @node-click="nodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <i v-if="data.type == 0" class="el-icon-folder" />
                <i v-else class="el-icon-coin" />
                {{ node.label }}</span>
              <span>
                <el-button
                  v-if="data.type == 0"
                  type="text"
                  icon="el-icon-plus"
                  @click="() => addDataSource(node,data)"
                />
                <el-button
                  type="text"
                  icon="el-icon-edit-outline"
                  @click="() => editDataSource(node,data)"
                />
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="() => singleDelete(node, data)"
                />
                <el-button
                  v-if="data.type == 1"
                  type="text"
                  size="mini"
                  icon="el-icon-receiving"
                  @click="() => backup(data)"
                />
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div style="float:left;padding-top:10px;padding-left:15px;width:100%;height:100%;" size="mini">
          <!--表格内容栏-->
          <el-table :data="pageResult.content" style="width: 100%">
            <el-table-column align="center" label="序号" width="100">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="备份时间" :formatter="dateFormat" />
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column label="是否上传云端" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isUpload"
                  disabled
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  @change="change(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button icon="fa fa-edit" size="mini" @click="restore(scope.row)">恢复</el-button>
                <el-button icon="fa fa-trash" size="mini" type="danger" @click="batchDelete(scope.row)">删除
                </el-button></template>
            </el-table-column>
          </el-table>
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
        label-width="110px"
        :size="size"
        style="text-align:left;"
        @keyup.enter.native="submitForm()"
      >

        <el-form-item label="类型">
          <template>
            <el-radio v-show="!dataForm.type" v-model="dataForm.type" :label="0">文件夹</el-radio>
            <el-radio v-show="dataForm.type" v-model="dataForm.type" :label="1">DB连接</el-radio>
          </template>
        </el-form-item>
        <el-form-item v-show="!dataForm.type" label="文件夹名称" prop="folderName">
          <el-input v-model="dataForm.folderName" placeholder="文件夹名称" />
        </el-form-item>
        <el-form-item label="上级文件夹">
          <el-input v-model="dataForm.parentName" disabled />
        </el-form-item>
        <el-form-item v-show="dataForm.type" label="数据源名称" prop="sourceName">
          <el-input v-model="dataForm.sourceName" placeholder="数据源名称" />
        </el-form-item>
        <el-form-item v-show="dataForm.type" label="数据库名称" prop="sourceName">
          <el-input v-model="dataForm.databaseName" placeholder="数据库名称" />
        </el-form-item>
        <el-form-item v-show="dataForm.type" label="IP" prop="ip">
          <el-input v-model="dataForm.ip" placeholder="IP" />
        </el-form-item>
        <el-form-item v-show="dataForm.type" label="端口" prop="port">
          <el-input v-model="dataForm.port" placeholder="端口" />
        </el-form-item>
        <el-form-item v-show="dataForm.type" label="用户名" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="用户名" />
        </el-form-item>
        <el-form-item v-show="dataForm.type" label="密码" prop="password">
          <el-input v-model="dataForm.password" placeholder="密码" />
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
import { format } from '@/utils/datetime'
import Pagination from '@/components/Pagination'
import { backup, restore, remove, asyncFindTree, save, singleDelete, findPage, batchDelete } from '@/api/backup-server/backup'
export default {
  components: {
    Pagination
  },
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1'
      }]
    }]
    return {
      size: 'small',
      filters: {
        name: ''
      },
      dataForm: {
        id: '',
        folderName: '',
        sourceName: '',
        databaseName: '',
        ip: '',
        port: '',
        name: '',
        type: 0,
        parentId: 0,
        parentName: '',
        userName: '',
        password: ''

      },
      dataRule: {
      },
      defaultProps: { // tree 控件的数据结构，需要设置 isLeaf
        children: 'children',
        label: 'name',
        isLeaf: 'hasChildren'
      },
      pageResult: {},
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      curNode: null,
      selectNode: null,
      dialogVisible: false,
      folderVisible: false,
      dataSourceVisible: false,
      showOperation: false,
      dataSourceType: 0,
      dataResult: [],
      data: JSON.parse(JSON.stringify(data))
    }
  },
  created() {
    // this.findRecords()
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      // console.log(this.curNode)
      this.loading = true
      this.pageRequest.params = { datasourceId: this.selectNode.id }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      })
    },
    batchDelete: function(data) {
      batchDelete(data).then((res) => {
        if (res.code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
          this.findPage()
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
      })
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
    addFolder: function() {
      this.dataForm = {
        id: '',
        name: '',
        type: 0,
        parentId: null,
        parentName: '顶级文件夹'
      }
      var dataSourceTree = this.$refs.dataSourceTree
      this.curNode = dataSourceTree.root
      this.dialogVisible = true
    },
    addDataSource: function(node, data) {
      this.curNode = node
      this.dataForm = {
        id: '',
        name: '',
        parentId: this.curNode.data.id,
        parentName: this.curNode.data.name,
        type: 1
      }
      this.dialogVisible = true
    },
    editDataSource: function(node, data) {
      this.dialogVisible = true
      this.curNode = node.parent
      if (this.curNode.data !== undefined) {
        data.parentId = this.curNode.data.id
        data.parentName = this.curNode.data.name
      } else {
        data.parentId = null
        data.parentName = '顶级文件夹'
        var dataSourceTree = this.$refs.dataSourceTree
        this.curNode = dataSourceTree.root
      }
      Object.assign(this.dataForm, data)
    },
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            console.log(this.dataForm)
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
              this.partialRefreshpartialRefresh(this.curNode)
            })
          })
        }
      })
    },
    singleDelete: function(node, data) {
      this.curNode = node.parent
      singleDelete(data).then(response => {
        const { code, msg } = response
        if (code === 200) {
          this.$message({ message: '删除成功', type: 'success' })
          this.partialRefreshpartialRefresh(this.curNode)
        } else {
          this.$message({ message: '操作失败, ' + msg, type: 'error' })
        }
      })
    },
    // findRecords: function(data) {
    //   findRecords().then(response => {
    //     const { code, data, msg } = response.data
    //     if (code === 200) {
    //       this.dataResult = data
    //     } else {
    //       this.$message({ message: '' + msg, type: 'error' })
    //     }
    //   })
    // },
    backup: function(data) {
      data.createTime = null
      backup(data).then(response => {
        const { code, msg } = response.data
        if (code === 200) {
          // this.findRecords()
          this.findPage()
          this.$message({ message: msg, type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + msg, type: 'error' })
        }
      })
    },
    restore: function(data) {
      restore(data).then(response => {
        const { code, msg } = response.data
        if (code === 200) {
          // this.findRecords()
          this.$message({ message: '恢复成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + msg, type: 'error' })
        }
      })
    },
    remove: function(data) {
      remove(data.name).then(response => {
        const { code, msg } = response.data
        if (code === 200) {
          this.findPage()
          this.$message({ message: '删除成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + msg, type: 'error' })
        }
      })
    },
    nodeClick(data, node) {
      if (data.type) {
        this.selectNode = data
        this.findPage()
      }

      // this.curNode = node
      // this.dataForm.parentId = this.curNode.data.id
      // this.dataForm.parentName = this.curNode.data.name
    },
    partialRefreshpartialRefresh(node) {
      node.loaded = false
      node.expand()
    },
    // 时间格式化
    dateFormat: function(row, column) {
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
