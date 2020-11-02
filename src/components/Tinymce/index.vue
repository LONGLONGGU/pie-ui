<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <Editor
      v-model="myValue"
      class="tinymce-textarea"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    />
    <el-upload
      class="upload-demo"
      drag
      :http-request="uploadFiles"
      action
      multiple
      :file-list="fileList"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png/mp4文件，且不超过10M</div>
    </el-upload>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import plugins from './plugins'
import toolbar from './toolbar'
import { uploadFiles, batchDelete } from '@/api/article'

export default {
  name: 'Tinymce',
  components: {
    Editor
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      fullscreen: false,
      // 初始化配置
      init: {
        language_url: '/tinymce/langs/zh_CN.js', // 语言包的路径
        language: 'zh_CN', // 语言
        skin_url: '/tinymce/skins/ui/oxide', // skin路径
        plugins: plugins,
        toolbar: toolbar,
        height: this.height, // 编辑器高度
        body_class: 'panel-body ',
        object_resizing: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'merge', // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: 'merge', // propmt, merge, clear
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        branding: false, //   // 去水印
        menubar: true // 顶部菜单栏显示
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        // images_upload_handler: (blobInfo, success, failure) => {
        //   const formData = new FormData()
        //   formData.append('file', blobInfo.blob())
        //   uploadImage(formData).then(response => {
        //     console.log(response)
        //     const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        //     success(img)
        //   })
        // }
      },
      myValue: this.value,
      fileList: []
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },

  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  },
  mounted() {
    tinymce.init({})
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    },
    uploadFiles(fileObject) {
      const formData = new FormData()
      formData.set('file', fileObject.file)
      uploadFiles(formData).then(response => {
        const { data } = response
        this.fileList.push({ id: data.id, name: data.fileName + '，文件地址：' + 'http:' + process.env.VUE_APP_BASE_API + '/article/download?fileId=' + data.id, url: data.filePath })
        this.$message({ message: response, type: 'success' })
      })
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
        this.imageUrl = ''
        this.fileList = []
      })
    }

  }
}

</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
