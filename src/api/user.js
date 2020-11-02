import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 查找用户的菜单权限标识集合
export const findPermissions = params => {
  return request({
    url: '/user/findPermissions',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
// 保存
export const save = data => {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = data => {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = data => {
  return request({
    url: '/user/findPage',
    method: 'post',
    data
  })
}
// 查询用户角色信息
export const findUserRoles = params => {
  return request({
    url: '/user/findUserRoles',
    method: 'get',
    params
  })
}
// 切换用户状态
export const userStatusSwitching = data => {
  return request({
    url: '/user/userStatusSwitching',
    method: 'post',
    data
  })
}
