<template>
  <div ref="cesiumContainer" />
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'Cesium',
  data() {

  },
  mounted() {
    const viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
      animation: false,
      timeline: false,
      imageryProvider: false
    })
  }
}
</script>
