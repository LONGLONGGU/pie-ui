import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 重定向白名单

router.beforeEach(async(to, from, next) => {
  // 开始启动进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      handleIFrameUrl(to)
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          console.log('获取用户信息')
          await store.dispatch('user/getInfo')
          // 获取权限信息
          await store.dispatch('user/getPermissions')
          // 生成菜单路由信息
          await store.dispatch('permission/generateRoutes')
          next({ ...to, replace: true })
        } catch (error) {
          // 删除用户信息重定向到首页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果没有token重定向到白名单
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(to) {
  console.log(to)
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  const iframeUrls = store.state.iframe.iframeUrls
  iframeUrls.filter(item => {
    if (item.path === to.path) {
      store.commit('setIFrameUrl', item.url)
    }
  })
}

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
