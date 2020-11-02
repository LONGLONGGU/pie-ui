<template>
  <div class="createPost-container">
    <el-form ref="postForm" :size="size" :model="postForm" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <div style=" background:#F8F8FF;">
          <el-button v-loading="loading" :size="size" style="margin-left: 10px;" type="success" @click="release()">
            发布
          </el-button>
          <el-button v-loading="loading" :size="size" style="margin-right: 20px;" type="warning" @click="submitForm()">
            保存
          </el-button>
        </div>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="title" required>
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item style="margin-bottom: 40px;" label="文章封面:">
              <el-upload
                class="avatar-uploader"
                :http-request="uploadFiles"
                action
                :file-list="fileList"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="postInfo-container">
          <el-row>
            <el-col :span="6">
              <el-form-item label-width="60px" label="作者:" class="postInfo-container-item">
                <el-input v-model="postForm.author" />

                <!-- <el-select v-model="postForm.author" filterable default-first-option remote placeholder="查询作者" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="60px" label="类型:" class="postInfo-container-item">
                <el-select v-model="postForm.type">
                  <el-option label="新闻咨询" :value="0" />
                  <el-option label="微信咨询" :value="1" />
                  <el-option label="知识共享" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.releaseTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期和时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="90px" label="重要性:" class="postInfo-container-item">
                <el-rate
                  v-model="postForm.importance"
                  :max="5"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :low-threshold="1"
                  :high-threshold="3"
                  style="display:inline-block"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="margin-bottom: 40px;" label-width="70px" label="摘要:">
            <el-input v-model="postForm.contentShort" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
            <!-- <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span> -->
          </el-form-item>
          <el-form-item prop="content" style="margin-bottom: 30px;">
            <Tinymce ref="editor" v-model="postForm.content" :height="400" />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import { uploadFiles, batchDelete, save, findByArticle } from '@/api/article'
const defaultForm = {
  id: '',
  title: '', // 文章题目
  coverImage: '', // 封面图标
  author: '', // 作者
  importance: 3, // 重要性
  releaseTime: '', // 发布时间
  contentShort: '', // 摘要
  content: '', // 文章内容
  status: 1, // 状态
  type: ''

}
export default {
  components: { MDinput, Tinymce, Sticky },
  data() {
    return {
      size: 'mini',
      postForm: Object.assign({}, defaultForm),
      displayTime: null,
      loading: false,
      fileList: [],
      imageUrl: ''
    }
  },
  created() {
    this.findByArticle()
  },
  methods: {

    findByArticle() {
      const id = this.$route.params.id
      if (id !== undefined) {
        findByArticle(id).then(response => {
          const { data } = response
          this.postForm = data
          this.imageUrl = this.postForm.coverImage
        })
      }
    },
    submitForm() {
      save(this.postForm).then(response => {
        const { code, data } = response
        if (code === 200) {
          console.log(data)

          this.$message({ message: '保存成功', type: 'success' })
        }
      })
    }, release() {
      this.postForm.status = 2
      save(this.postForm).then(response => {
        const { code, data } = response
        if (code === 200) {
          this.postForm = data
          this.$message({ message: '发布成功', type: 'success' })
        }
      })
    },
    uploadFiles(fileObject) {
      const formData = new FormData()
      formData.set('file', fileObject.file)
      uploadFiles(formData).then(response => {
        const { data } = response
        this.fileList.push({ id: data.id, name: data.fileName, url: data.filePath })
        this.imageUrl = 'http:' + process.env.VUE_APP_BASE_API + '/article/download?fileId=' + data.id
        this.postForm.coverImage = this.imageUrl
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传封面只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传封面超过 2MB!')
      }
      return isJPG && isLt2M
    },
    beforeRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm(`确定移除 ${file.name}？`).then(() => {
          return this.delete(file.id)
        })
      }
    },
    delete(fileId) {
      batchDelete(fileId).then(response => {
        this.$message.success('删除成功!')
        this.postForm.coverImage = ''
        this.imageUrl = ''
        this.fileList = []
      })
    }

  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.avatar-uploader .el-upload i {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload i:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>
