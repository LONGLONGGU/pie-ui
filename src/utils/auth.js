// import Cookies from 'js-cookie'
//
// const TokenKey = 'vue_admin_template_token'
//
// export function getToken() {
//   return Cookies.get(TokenKey)
// }
//
// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }
//
// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

const accessTokenKey = 'PIE_ACCESS_TOKEN'
const refreshTokenKey = 'PIE_REFRESH_TOKEN'

export function getToken() {
  return window.localStorage.getItem(accessTokenKey)
}

export function setToken(token) {
  window.localStorage.setItem(accessTokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(accessTokenKey)
}

export function getRefreshToken() {
  return window.localStorage.getItem(refreshTokenKey)
}

export function setRefreshToken(token) {
  window.localStorage.setItem(refreshTokenKey, token)
}

export function removeRefreshToken() {
  return window.localStorage.removeItem(refreshTokenKey)
}

