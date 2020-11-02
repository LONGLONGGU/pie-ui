<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.title" placeholder="标题" />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            perms="sys:role:view"
            type="primary"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增"
            perms="sys:user:add"
            type="primary"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loading" :data="pageResult.content" :size="size" fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.releaseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column label="重要性">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column label="点击数">
        <template slot-scope="scope">
          <span>{{ scope.row.hitCount }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status === 0 ? 'danger':(row.status === 1?'info':'succes')">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="标题" min-width="200">
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" :size="size" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
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
  </div>
</template>
<script>
import KtButton from '@/components/KtButton'
import Pagination from '@/components/Pagination'
import { findPage } from '@/api/article'
export default {
  components: {
    KtButton,
    Pagination
  },
  filters: {
    statusFilter(status) {
      if (status === 0) {
        return '删除'
      } else if (status === 1) {
        return '草案'
      } else if (status === 2) {
        return '发表'
      }
      return '异常'
    }
  },
  data() {
    return {
      size: 'mini',
      loading: false,
      filters: { title: '' },
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: { }

    }
  },
  created() {
    this.findPage()
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      // if (data !== null) {
      //   this.pageRequest = data.pageRequest
      // }
      this.loading = true
      this.pageRequest.params = { name: '', value: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    }
  }

}
</script>
