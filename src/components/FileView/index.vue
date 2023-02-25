<template>
  <div v-loading="loading" class="file-view">
    <!-- 视频播放器组件 -->
    <videoPlayer v-if="selfType == 'video'" class="player-item" :options="selfOptions" @closeVideo="closePreview" />
    <!-- 音频播放器 -->
    <audio-player v-else-if="selfType == 'audio'" class="player-item" :url="selfOptions" @closeAudio="closePreview" />
    <!-- pdf预览组件 -->
    <pdf-online v-else-if="selfType == 'iframe'" class="player-item" :pdfurl="selfOptions" @closePDF="closePreview" />
    <!-- 图片预览 -->
    <img-online v-else-if="selfType == 'img'" class="player-item" :url="selfOptions" @closeImg="closePreview" />
  </div>
</template>

<script>
/**
 * 通用模块 预览聚合组件
 * props：无 所需参数在父组件调用本组件方法时通过方法参数传入
 * 输出：浏览关闭
 * 其他操作均在组件内部完成
 * 盒子样式请在使用时根据情况在父组件中设定，暂不在此设置统一展示方式
 */
import videoPlayer from '@/components/FileView/video-player.vue' // 导入视频播放组件
import audioPlayer from '@/components/FileView/audio-player' // 导入音频播放组件
import pdfOnline from '@/components/FileView/pdf-online' // 导入pdf预览组件
import imgOnline from '@/components/FileView/img-online' // 导入img预览组件

export default {
  components: { videoPlayer, audioPlayer, pdfOnline, imgOnline },
  props: {
    /**
     * 预览文件类型
     * video视频，audio音频，img图片，iframe其他可预览类型【txt,html,pdf】
     */
    previewType: {
      type: String,
      default: 'img'
    },
    /**
     * 文件地址或配置项
     */
    previewOptions: [Object, String]
  },
  data() {
    return {
      loading: false, // laod状态
      type: null, // 文件类型
      options: null, // 文件地址或配置项
      show_preview: false // 是否显示文件预览
    }
  },
  computed: {
    selfType() {
      return this.previewType
    },
    selfOptions() {
      return this.previewOptions
    }
  },
  methods: {
    // 关闭预览
    closePreview() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  .file-view{
    z-index: 111;

    >.player-item{
      position: static;
      width: 100%;
      height: 100%;
    }
  }
</style>
