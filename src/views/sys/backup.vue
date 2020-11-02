<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <!-- <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名" />
        </el-form-item> -->
        <el-form-item>
          <el-button icon="el-icon-receiving" size="mini" @click="backup">备份</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <el-table :data="dataResult" style="width: 100%">
      <el-table-column align="center" label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件名" />
      <el-table-column prop="title" label="备注" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="fa fa-edit" size="mini" @click="restore(scope.row)">恢复</el-button>
          <el-button icon="fa fa-trash" size="mini" type="danger" @click="remove(scope.row)">删除
          </el-button></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { format } from '@/utils/datetime'
import { findRecords, backup, restore, remove } from '@/api/backup'
export default {
  components: {
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: ''
      },
      dataResult: [],
      showOperation: false
    }
  },
  created() {
    this.findRecords()
  },
  methods: {
    findRecords: function(data) {
      findRecords().then(response => {
        const { code, data, msg } = response.data
        if (code === 200) {
          this.dataResult = data
        } else {
          this.$message({ message: '' + msg, type: 'error' })
        }
      })
    },
    backup: function() {
      backup().then(response => {
        const { code, msg } = response.data
        if (code === 200) {
          this.findRecords()
          this.$message({ message: '备份成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + msg, type: 'error' })
        }
      })
    },
    restore: function(data) {
      restore(data.name).then(response => {
        const { code, msg } = response.data
        if (code === 200) {
          this.findRecords()
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
          this.findRecords()
          this.$message({ message: '删除成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + msg, type: 'error' })
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
