<template>
  <div>
    <!--表格栏-->
    <el-table
      v-loading="loading"
      :data="data.content"
      :highlight-current-row="highlightCurrentRow"
      element-loading-text="拼命加载中"
      :border="border"
      :stripe="stripe"
      :show-overflow-tooltip="showOverflowTooltip"
      :max-height="maxHeight"
      :size="size"
      :align="align"
      style="width:100%;"
      @selection-change="selectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column v-if="showBatchDelete & showOperation" type="selection" width="40" />
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        header-align="center"
        align="center"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :type="column.type"
        :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable"
      />
      <el-table-column
        v-if="showOperation"
        label="操作"
        width="300"
        fixed="right"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            label="编辑"
            :perms="permsEdit"
            :size="size"
            @click="handleEdit(scope.$index, scope.row)"
          />
          <kt-button
          v-show="isDownloadButton"
          icon="el-icon-download"
          label="下载报告"
          :perms="downloadReport"
          :size="size"
          @click="exportReport(scope.$index, scope.row)"
          >
          </kt-button>
          <kt-button
            icon="fa fa-trash"
            label="删除"
            :perms="permsDelete"
            :size="size"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <kt-button
        v-if="showBatchDelete & showOperation"
        label="批量删除"
        :perms="permsDelete"
        :size="size"
        type="danger"
        :disabled="this.selections.length===0"
        style="float:left;"
        @click="handleBatchDelete()"
      />
      <el-pagination
        layout="total, prev, pager, next, jumper"
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        :total="data.totalSize"
        style="float:right;"
        @current-change="refreshPageRequest"
      />
    </div>
  </div>
</template>

<script>
import KtButton from '@/components/KtButton'
export default {
  name: 'KtTable',
  components: {
    KtButton
  },
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String, // 编辑权限标识
    downloadReport:String,//下载权限标识
    permsDelete: String,// 删除权限标识
    isDownloadButton:{
      type:Boolean,
      default: false
    },
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
    align: { // 文本对齐方式
      type: String,
      default: 'left'
    },
    maxHeight: { // 表格最大高度
      type: Number,
      default: 420
    },
    showOperation: { // 是否显示操作组件
      type: Boolean,
      default: true
    },
    border: { // 是否显示边框
      type: Boolean,
      default: false
    },
    stripe: { // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: { // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: { // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: { // 是否显示操作组件
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 分页信息
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false, // 加载标识
      selections: [] // 列表选中列
    }
  },
  mounted() {
    this.refreshPageRequest(1)
  },
  methods: {
    // 分页查询
    findPage: function() {
      this.loading = true
      const callback = res => {
        console.log(res)
        this.loading = false
      }
      this.$emit('findPage', { pageRequest: this.pageRequest, callback: callback })
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections
      this.$emit('selectionChange', { selections: selections })
    },
    // 选择切换
    handleCurrentChange: function(val) {
      this.$emit('handleCurrentChange', { val: val })
    },
    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 编辑
    handleEdit: function(index, row) {
      this.$emit('handleEdit', { index: index, row: row })
    },
    //下载 说明：添加下载报告按钮（张关强）
    exportReport:function(index, row){
      this.$emit('downloadFile', { index: index, row: row })
    },
    // 删除
    handleDelete: function(index, row) {
      this.delete(row.id)
    },
    // 批量删除
    handleBatchDelete: function() {
      const ids = this.selections.map(item => item.id).toString()
      this.delete(ids)
    },
    // 删除操作
    delete: function(ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const params = []
        const idArray = (ids + '').split(',')
        for (var i = 0; i < idArray.length; i++) {
          params.push({ 'id': idArray[i] })
        }
        this.loading = true
        const callback = res => {
          if (res.code == 200) {
            this.$message({ message: '删除成功', type: 'success' })
            this.findPage()
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
          this.loading = false
        }
        this.$emit('handleDelete', { params: params, callback: callback })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
</style>
