import { login, getInfo, findPermissions } from '@/api/admin-server/user'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_NICK_NAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSION: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password, captcha, captToken } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: account.trim(),
        password: password,
        captcha: captcha,
        captToken: captToken,
        grant_type: 'password',
        logInType: 'pc'
      }).then(response => {
        const { code, data } = response
        if (code === 200) {
          const { access_token, refresh_token, token_type } = data
          const token = token_type + ' ' + access_token
          commit('SET_TOKEN', token)
          setToken(token)
          setRefreshToken(refresh_token)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  refreshToken({ commit }, refreshToken) {
    commit('SET_TOKEN', undefined)
    return new Promise((resolve, reject) => {
      login({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }).then(response => {
        const { access_token, refresh_token, token_type } = response.data
        const token = token_type + ' ' + access_token
        commit('SET_TOKEN', token)
        setToken(token)
        setRefreshToken(refresh_token)
        resolve(token)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('验证失败，请重新登录。')
        }
        const { name, avatar, nickName } = data

        commit('SET_NAME', name)
        commit('SET_NICK_NAME', nickName)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户权限
  getPermissions({ commit }) {
    return new Promise(resolve => {
      findPermissions({ name: state.name }).then((response) => {
        const { data } = response
        commit('SET_PERMISSION', data)
        resolve()
      })
    })
  },
  // 用户退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      removeRefreshToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeRefreshToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

