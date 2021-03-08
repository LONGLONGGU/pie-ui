<template>
  <div align="center" style="margin:10px">
    <el-upload class="avatar-uploader" :action="action" :headers="headers" :show-file-list="false"
      :on-success="handleAvatarSuccess" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <span v-if="imageUrl" class="el-upload-action" @click.stop="handleRemove()">
        <i class="el-icon-delete"></i>
      </span>
      <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    imageUrl: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      action: process.env.VUE_APP_BASE_API + '/upload',
      headers: {
        Authorization: getToken()
      }
    }
  },
  methods: {
    // 移除图片
    handleRemove () {
      this.$emit('onremove')
    },
    // 上传成功回调
    handleAvatarSuccess (res, file) {
      this.$emit('onsuccess', res, file)
    },
    // 上传前格式和图片大小限制
    beforeAvatarUpload (file) {
      const type = file.type === 'image/jpeg' || 'image/jpg' || 'image/webp' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!type) {
        this.$message.error('图片格式不正确!(只能包含jpg，png，webp，JPEG)')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return type && isLt2M
    }
  }
}
</script>
<style scoped lang="scss">
.avatar-uploader {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-image: url("~@/assets/default.png");
  background-size: 100% 100%;
}
.avatar-uploader-icon {
  font-size: 0;
  color: #fff;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar-uploader-icon:hover {
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.3);
}
.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  display: block;
}
.el-upload-action {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 0;
  color: #fff;
  text-align: center;
  line-height: 120px;
}
.el-upload-action:hover {
  font-size: 20px;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>