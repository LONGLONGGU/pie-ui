<template>
  <div style="width:100%;height: 100%" class="fullSize">
    <div id="cesiumContainer" class="full-container" />
    <div v-if="showPopup" class="popup" :style="{ top: popupTop + 'px', left: popupLeft + 'px' }">
      <h3>{{ selectedEntity.name }}</h3>
      <p>{{ selectedEntity.description }}</p>
      <div class="arrow" />
      <button @click="closePopup">关闭</button>
    </div>
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

  },
  data() {
    return {
      viewer: null,
      showPopup: false,
      selectedEntity: null,
      popupTop: 0,
      popupLeft: 0
    }
  },
  mounted() {
    this.initCesium()
  },
  methods: {
    initCesium() {
      const that = this
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
        minimumLevel: 3,
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

      // home跳转位置
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true
        // 你要飞的位置
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(116.44359, 39.950291, 4452909)
        })
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
      // 坐标拾取
      // 定义canvas屏幕点击事件，scene.canvas指的是HTMLCanvasElement元素，也就是屏幕画的东西
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction(function (event) {
        // 转换为不包含地形的笛卡尔坐标
        const clickPosition = viewer.scene.camera.pickEllipsoid(event.position)
        // 转经纬度（弧度）坐标
        const radiansPos = Cesium.Cartographic.fromCartesian(clickPosition)
        const height = Math.ceil(viewer.camera.positionCartographic.height)
        // 转角度
        console.log(
          '经度：' +
          Cesium.Math.toDegrees(radiansPos.longitude) +
          ', 纬度：' +
          Cesium.Math.toDegrees(radiansPos.latitude) +
          ', 高度' + height
        )
        var earthPosition = viewer.scene.pickPosition(event.position)

        // 获取 pick 拾取对象
        var pick = viewer.scene.pick(event.position)
        // 判断是否获取到了 pick
        if (!Cesium.defined(pick)) {
          viewer.entities.add({
            show: true,
            id: '001' + Math.random(),
            position: clickPosition,
            billboard: {
              image: require('../../assets/coffee.png'),
              scale: 0.3, // 比例
              color: Cesium.Color.WHITE.withAlpha(1)
            },
            label: {
              scale: 1,
              font: 'bolder 16px sans-serif',
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              text: '豆子0001', // 图标名称
              fillColor: Cesium.Color.fromCssColorString('#ffffff'),
              pixelOffset: new Cesium.Cartesian2(0, -30)
            }
          })
        } else {
          console.log('弹窗')
          // 显示弹窗
          console.log(that.showPopup)
          // 设置弹窗位置
          that.setPopupPosition(event.position)
          // 显示弹窗
          that.showPopup = true
          that.selectedEntity = { name: '123123', description: 'qwsdasdasdas' }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 监听鼠标移动事件
      handler.setInputAction(function () {
        console.log('点击了中键')
      },
        Cesium.ScreenSpaceEventType.MIDDLE_CLICK)
      handler.setInputAction(function () {
        console.log('滚动！')
      },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      handler.setInputAction(function () {
        console.log('双击了左键')
      },
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      handler.setInputAction(function (event) {
        console.log('点击了右键')
        var earthPosition = viewer.scene.pickPosition(event.position) // 点击坐标
        console.log(earthPosition)
        // 获取 pick 拾取对象
        var pick = viewer.scene.pick(event.position)
        // 判断是否获取到了 pick
        if (Cesium.defined(pick)) {
          const entity = pick.id
          console.log(entity._id)
          var model = viewer.entities.getById(entity._id) // 模型获取
          viewer.entities.remove(model) // 模型移除
        }

        // 取消鼠标点击事件
        // handler.destroy()
        // handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

      handler.setInputAction(function () {
        // 取消鼠标点击事件
        // handler.destroy()
        viewer.entities.removeAll()// 删除所有
        console.log('双击了右键，取消全部事件')
      }, Cesium.ScreenSpaceEventType.RIGHT_DOUBLE_CLICK)
    },
    setPopupPosition(position) {
      console.log('设置div跟随')
      // 将鼠标点击位置转换为屏幕坐标
      const windowPosition = new Cesium.Cartesian2(position.x, position.y)

      // 获取弹窗的宽度和高度
      const popupWidth = 80
      const popupHeight = 20

      // 计算弹窗的左上角坐标
      const left = windowPosition.x - popupWidth
      const top = windowPosition.y + popupHeight

      // 更新弹窗的位置
      this.popupLeft = left
      this.popupTop = top
    },
    closePopup() {
      // 关闭弹窗
      this.showPopup = false
      this.selectedEntity = null
    }
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
  background-image: url('../../assets/bg.png');
  background-size: 100% 100%;
}
.popup {
  position: absolute;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #fff;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
