import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import jquery from 'jquery'

// 引入echart
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import wl from 'wl-vue-select'
import 'wl-vue-select/lib/wl-vue-select.css'

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(wl)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  jquery,
  store,
  render: h => h(App)
})
