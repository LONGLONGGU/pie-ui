import { constantRoutes } from '@/router'
import router from '@/router'
import { findMneu } from '@/api/menu'
import store from '@/store'
import Layout from '@/views/layout'
import container from '@/views/layout/container'
import { getIFramePath } from '@/utils/iframe'
const state = {
  routes: [],
  addRoutes: [],
  sideBarMenus: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    router.addRoutes(routes)
    state.routes = constantRoutes.concat(routes)
  },
  SET_SIDEBAR: (state, menus) => {
    state.sideBarMenus = menus
  }
}
const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      findMneu({ userName: store.getters.name }).then(response => {
        const { data } = response
        const routes = filterAsyncRoutes(data)
        commit('SET_ROUTES', routes)
        resolve(routes)
      })
    })
  },
  generateSideBarMenus({ commit }, menus) {
    commit('SET_SIDEBAR', menus)
  }
}
export function filterAsyncRoutes(routes) {
  const result = []
  routes.forEach(route => {
    const item = { ... route }
    const nestedUrl = getIFramePath(item.nestedUrl)
    if (nestedUrl) {
      const iFrameUrl = {
        'path': item.url,
        'url': item.nestedUrl
      }
      store.commit('addIFrameUrl', iFrameUrl)
    }
    if (item.children.length > 0) {
      item.component = Layout
      item.path = item.url
      item.meta = { title: item.name, icon: item.icon }
      item.redirect = getSubRoutesPath(item.children)
      item.children = filterAsyncRoutes(item.children)
      result.push(item)
    } else {
      if (item.parentId !== null && item.parentId !== 0) {
        item.path = item.url
        item.component = resolve => item.nestedUrl !== null && item.nestedUrl !== '' ? require([`@/components/IFrame/index`], resolve) : require([`@/views${item.url.split('/:')[0]}.vue`], resolve)
        item.meta = { title: item.name, icon: item.icon }
      } else {
        item.path = item.url
        item.component = container
        item.children = [{
          meta: { title: item.name, icon: item.icon },
          path: item.url,
          name: item.name,
          component: resolve => item.nestedUrl !== null && item.nestedUrl !== '' ? require([`@/components/IFrame/index`], resolve) : require([`@/views${item.url.split('/:')[0]}.vue`], resolve)
        }]
      }
      result.push(item)
    }
  })
  return result
}
function getSubRoutesPath(routes) {
  let subRoutesPath = ''
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].children.length > 0) {
      return getSubRoutesPath(routes[i].children)
    }
    subRoutesPath = routes[i].url
    break
  }
  return subRoutesPath
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
