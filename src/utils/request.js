import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken } from '@/utils/auth'

// 数据传输默认为json格式
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['Set-Cookie'] = 'HttpOnly;Secure;SameSite=None'
// # 额外补充，后台服务首先要允许跨域访问
axios.defaults.headers['Access-Control-Allow-Credentials'] = 'true'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 50 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['token'] = getToken()
      // 调整请求协议头信息
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
/*
service.interceptors.response.use(
  /!**
   * If you want to get http information such as headers or status
   * Please return  response => response
  *!/

  /!**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   *!/
  response => {
    const res = response.data
    if (response.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
*/

// 处理response信息
let refreshing = false // 正在刷新标识，避免重复刷新
let waitQueue = [] // 请求等待队列
service.interceptors.response.use(
  response => {
    const { code, msg, data } = response.data
    if (code !== 200) {
      if (code === 10002) { // access_token过期 使用refresh_token刷新换取access_token
        const config = response.config
        if (refreshing === false) {
          refreshing = true
          const refreshToken = getRefreshToken()
          return store.dispatch('user/refreshToken', refreshToken).then((token) => {
            config.headers['Authorization'] = token
            config.baseURL = '' // 请求重试时，url已包含baseURL
            waitQueue.forEach(callback => callback(token)) // 已刷新token，所有队列中的请求重试
            waitQueue = []
            return service(config)
          }).catch(() => { // refresh_token也过期，直接跳转登录页面重新登录
            return Promise.reject(new Error(msg || 'Error'))
          }).finally(() => {
            refreshing = false
          })
        } else {
          // 正在刷新token，返回未执行resolve的Promise,刷新token执行回调
          return new Promise(resolve => {
            waitQueue.push((token) => {
              config.headers['Authorization'] = token
              config.baseURL = '' // 请求重试时，url已包含baseURL
              resolve(service(config))
            })
          })
        }
      } else if (code === 10004) { // token续期失败
        MessageBox.confirm(
          '当前页面已失效，请重新登录', '确认退出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (code === 500 || code === 403) {
        return response.data
      } else {
        // 判断是否是下载接口，如果是下载接口，直接返回数据信息
        if (response.config && response.config.responseType === 'arraybuffer') {
          return response.data
        } else {
          Message({
            message: msg || '系统出错',
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject(new Error(msg || 'Error'))
        }
      }
    }
    return { code, msg, data }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
