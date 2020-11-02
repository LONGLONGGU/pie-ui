<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            perms="sys:menu:view"
            type="primary"
            @click="findTreeData(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增"
            perms="sys:menu:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
    <el-table
      v-loading="loading"
      :data="tableTreeDdata"
      stripe
      size="mini"
      style="width: 100%;"
      row-key="id"
      element-loading-text="拼命加载中..."
    >
      <el-table-column prop="id" header-align="center" align="center" width="120" label="ID" />
      <table-tree-column prop="name" header-align="center" tree-key="id" width="150" label="名称" />
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" width="120" label="上级菜单" />
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      />
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      />
      <el-table-column prop="orderNum" header-align="center" align="center" label="排序" />
      <el-table-column fixed="right" header-align="center" align="center" width="185" label="操作">
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            label="编辑"
            perms="sys:menu:edit"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            label="删除"
            perms="sys:menu:delete"
            type="danger"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      width="60%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="160px"
        :size="size"
        style="text-align:left;"
        @keyup.enter.native="submitForm()"
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio v-for="(type, index) in menuTypeList" :key="index" :label="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="隐藏">
          <el-radio-group v-model="dataForm.hidden">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name">
          <el-input v-model="dataForm.name" :placeholder="menuTypeList[dataForm.type] + '名称'" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName"
            :node-key="''+dataForm.parentId"
            :current-change-handle="handleTreeSelectChange"
          />
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
          <el-input v-model="dataForm.perms" placeholder="如: sys:user:add, sys:user:edit, sys:user:delete" />
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1 | dataForm.type === 0" label="菜单路由" prop="url">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.url" placeholder="菜单路由" />
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px;">
                <div slot="content">
                  <p>URL格式：</p>
                  <p>1.常规业开发一层目录一层路由，例如一级菜单那么就是/system，二级菜单那么就是/system/user</p>
                  <p>示例：系统管理：/sys 用户管理：/sys/user</p>
                </div>
                <i class="el-icon-warning" />
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="嵌套外部地址">
          <el-radio-group v-model="isNested">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1 & isNested === '0'" label="nestedUrl" prop="nestedUrl">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.nestedUrl" placeholder="嵌套地址" />
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px;">
                <div slot="content">
                  <p>URL格式：</p>
                  <p>1.嵌套外部网页，如通过菜单打开外部网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                  <p>示例：嵌套接口文档：http://localhost:8081/swagger-ui.html  嵌套网页：http://127.0.0.1:8000</p>
                </div>
                <i class="el-icon-warning" />
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号" />
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover"
              >
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in dataForm.iconList"
                    :key="index"
                    :class="{ 'is-active': item === dataForm.icon }"
                    @click="iconActiveHandle(item)"
                  >
                    <icon-svg :name="item" />
                  </el-button>
                </div>
              </el-popover>
              <el-input
                v-model="dataForm.icon"
                v-popover:iconListPopover
                :readonly="false"
                placeholder="菜单图标名称（如：fa fa-home fa-lg）"
                class="icon-list__input"
              />
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click="submitForm()">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
import TableTreeColumn from '@/components/TableTreeColumn'
import PopupTreeInput from '@/components/PopupTreeInput'
import FaIconTooltip from '@/components/FaIconTooltip'
import { findMenuTree, batchDelete, save } from '@/api/menu'
export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      size: 'small',
      loading: false,
      filters: {
        name: ''
      },
      tableTreeDdata: [],
      dialogVisible: false,
      menuTypeList: ['目录', '菜单', '按钮'],
      isNested: '1',
      dataForm: {
        id: '',
        type: 1,
        hidden: false,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        nestedUrl: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      dataRule: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  mounted() {
    this.findTreeData()
  },
  methods: {
    // 获取数据
    findTreeData: function() {
      this.loading = true
      findMenuTree().then(res => {
        this.tableTreeDdata = res.data
        this.popupTreeData = this.getParentMenuTree(res.data)
        this.loading = false
      })
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      const parent = {
        parentId: 0,
        name: '顶级菜单',
        children: tableTreeDdata
      }
      return [parent]
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.dataForm = {
        id: '',
        type: 1,
        hidden: false,
        typeList: ['目录', '菜单', '按钮'],
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        nestedUrl: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      }
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true
      Object.assign(this.dataForm, row)
      if (row.nestedUrl === null || row.nestedUrl === '') {
        this.isNested = '1'
      } else {
        this.isNested = '0'
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // let params = this.getDeleteIds([], row);
        batchDelete(row).then(res => {
          console.log(res)
          this.findTreeData()
          this.$message({ message: '删除成功', type: 'success' })
        })
      })
    },
    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.id })
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i])
        }
      }
      return ids
    },
    // 菜单树选中
    handleTreeSelectChange(data) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    submitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            save(params).then(res => {
              this.editLoading = false
              if (res.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
                this.$refs['dataForm'].resetFields()
                this.dialogVisible = false
              } else {
                this.$message({
                  message: '操作失败, ' + res.msg,
                  type: 'error'
                })
              }
              this.findTreeData()
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
