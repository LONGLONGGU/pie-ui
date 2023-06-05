<template>
  <div style="width:100%;height: 100%" class="fullSize">
    <div id="cesiumContainer" class="full-container" :style="viewStyle" />
    <div id="loadingOverlay">
      <h1>Loading...</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EarthViewer',
  viewerProperty: {},
  components: {},
  props: {
    viewStyle: {},
    viewerProperty: {},
    dropBackground: {
      default: false
    }
  },
  data() {
    return {
      viewer: null
    }
  },
  computed: {},
  mounted() {
    var cesiumKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMDY3ZjIzYy1hM2MyLTRjM2EtOWY5My00NGJlYzNkOGE5YmQiLCJpZCI6ODI2NjQsImlhdCI6MTY0Nzg0NDg2Mn0.W3vO2yZiNzAOj5lyp2caC25Bo7ZRyEL9z4VgRwxWM00'
    var TDU_Key = '4e78626bb255221b65e399d20d82963b'
    // 服务负载子域
    var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
    Cesium.Ion.defaultAccessToken = cesiumKey

    const viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false, // 左下角仪表盘（动画器件）
      timeline: false, // 时间轴
      geocoder: false, // 地址编码
      homeButton: true, // home键
      navigationHelpButton: false, // 导航帮助按钮是否显示
      baseLayerPicker: false, // 底图选择框是否显示
      fullscreenElement: 'cesiumContainer', //
      fullscreenButton: false, // 是否加载全屏
      shouldAnimate: true, // 自动播放动画控件
      infoBox: false,
      selectionIndicator: false,
      sceneModePicker: false,
      shadows: false,
      skyAtmosphere: false,
      // 设置渲染
      orderIndependentTranslucency: false,
      contextOptions: {
        webgl: {
          alpha: true
        }
      },
      imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        // 影像底图
        // url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + TDU_Key,
        url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        subdomains: subdomains,
        layer: 'tdtImgLayer',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible', // 使用谷歌的瓦片切片方式
        show: true,
        maximumLevel: 18 // 必须加上最大级数
      })
    })
    window.cesiumViewer = viewer
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    // 屏蔽天空盒
    viewer.scene.skyBox.show = false
    // 设置背景透明
    viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)

    // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    //   //影像注记
    //   url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + TDU_Key,
    //   subdomains: subdomains,
    //   layer: "tdtCiaLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    //   show: true
    // }));

    // 1.Cesium加载高德矢量地图
    // var layer = new Cesium.UrlTemplateImageryProvider({
    //   url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    //   minimumLevel: 4,
    //   maximumLevel: 20
    // })
    // viewer.imageryLayers.addImageryProvider(layer)
    // 2.Cesium加载高德影像

    var imgLayer = new Cesium.UrlTemplateImageryProvider({
      url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      minimumLevel: 2,
      maximumLevel: 18
    })
    viewer.imageryLayers.addImageryProvider(imgLayer)
    // 3.Cesium加载注记要素
    var annLayer = new Cesium.UrlTemplateImageryProvider({
      url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      minimumLevel: 2,
      maximumLevel: 18
    })

    viewer.imageryLayers.addImageryProvider(annLayer)

    // 清除cesium-widget-credits
    const credits = document.getElementsByClassName('cesium-widget-credits')
    credits[0].parentElement.removeChild(credits[0])

    // 禁止双击zoom
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
    viewer.scene.postProcessStages.fxaa.enabled = false
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(110, 30, 15000000.0), // 设置位置
      orientation: {
        heading: Cesium.Math.toRadians(0.0), // 方向
        pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
        roll: 0
      }
    })
    // 将三维球定位到云南
    setTimeout(() => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(102.734375, 25.041069, 178500),
        orientation: {
          heading: Cesium.Math.toRadians(348.4202942851978),
          pitch: Cesium.Math.toRadians(-89.74026687972041),
          roll: Cesium.Math.toRadians(0)
        },
        complete: function callback() {
          // 定位完成之后的回调函数
        }
      })
    }, 2000)
  },
  methods: {
  }
}
</script>

<style scoped>
.fullSize,
.full-container {
  position: absolute;
  /*top: 0;*/
  /*left: 0;*/
  border: none;
  height: 100%;
  width: 100%;
  margin: 0px;
  display: inherit;
}
.doubleViewer {
  width: 50%;
}
/*#cesiumContainer {*/
/*overflow: hidden;*/
/*position: fixed;*/
/*background: url('../../static/images/sky.jpg') no-repeat;*/
/*margin: 0px;*/
/*background-size: cover;*/
/*}*/

#loadingOverlay {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  display: none;
}

#loadingOverlay h1 {
  text-align: center;
  position: relative;
  top: 50%;
  margin-top: -0.5em;
}

#mousePositionId {
  position: absolute;
  right: 30px;
  bottom: 50px;
  z-index: 100;
  font-size: 20px;
}
.layer-picker-class {
  float: right;
}
</style>
<style>
html {
  overflow-x: hidden;
  overflow-y: hidden;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/kunming.png');
  background-size: 100% 100%;
}
</style>
