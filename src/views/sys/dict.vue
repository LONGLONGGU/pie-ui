<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-select v-model="filters.type" placeholder="类型">
            <el-option label="全部" value="" />
            <el-option v-for="item in types" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.label" placeholder="名称" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            perms="sys:dict:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增"
            perms="sys:dict:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table
      perms-edit="sys:dict:edit"
      perms-delete="sys:dict:delete"
      :data="pageResult"
      :columns="columns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    />
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
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
        <el-form-item label="名称" prop="label">
          <el-input v-model="dataForm.label" auto-complete="off" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="dataForm.value" auto-complete="off" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="dataForm.type" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dataForm.sort" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述 " prop="description">
          <el-input v-model="dataForm.description" auto-complete="off" type="textarea" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitForm">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import KtTable from '@/components/KtTable'
import KtButton from '@/components/KtButton'
import { format } from '@/utils/datetime'
import { findTypes, findPage, batchDelete, save } from '@/api/dict'
export default {
  components: {
    KtTable,
    KtButton
  },
  data() {
    return {
      size: 'small',
      filters: {
        type: '',
        label: ''
      },
      columns: [
        { prop: 'id', label: 'ID', minWidth: 50 },
        { prop: 'type', label: '类型', minWidth: 80 },
        { prop: 'label', label: '名称', minWidth: 100 },
        { prop: 'value', label: '值', minWidth: 100 },
        { prop: 'sort', label: '排序', minWidth: 80 },
        { prop: 'description', label: '描述', minWidth: 120 },
        { prop: 'remarks', label: '备注', minWidth: 120 },
        { prop: 'createBy', label: '创建人', minWidth: 100 },
        { prop: 'createTime', label: '创建时间', minWidth: 120, formatter: this.dateFormat }
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      types: [],
      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        label: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: '',
        label: '',
        value: '',
        type: '',
        sort: 0,
        description: '',
        remarks: ''
      }
    }
  },
  mounted() {
    this.findTypes()
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.params = { type: this.filters.type, label: this.filters.label }
      findPage(this.pageRequest).then((res) => {
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 获取字典类型
    findTypes: function() {
      findTypes().then((res) => {
        if (res.code === 200) {
          console.log(res)
          this.types = res.data
        }
      })
    },
    // 批量删除
    handleDelete: function(data) {
      batchDelete(data.params).then(data != null ? data.callback : '')
    },
    // 显示新增界面
    handleAdd: function() {
      this.editDialogVisible = true
      this.operation = true
      this.dataForm = {
        id: '',
        label: '',
        value: '',
        type: '',
        sort: null,
        description: '',
        remarks: ''
      }
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.editDialogVisible = true
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
              if (res.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.editLoading = false
              this.$refs['dataForm'].resetFields()
              this.editDialogVisible = false
              this.findPage(null)
            })
          })
        }
      })
    },
    // 时间格式化
    dateFormat: function(row, column) {
      return format(row[column.property])
    }
  }
}
</script>

<style scoped>
</style>
