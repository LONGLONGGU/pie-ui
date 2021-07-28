import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'
export function login(data) {
  return request({
    url: baseAdminUrl + '/login',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: baseAdminUrl + '/logout',
    method: 'post'
  })
}
export function getInfo(token) {
  return request({
    url: baseAdminUrl + '/user/info',
    method: 'get',
    params: { token }
  })
}

// 查找用户的菜单权限标识集合
export const findPermissions = params => {
  return request({
    url: baseAdminUrl + '/user/findPermissions',
    method: 'get',
    params
  })
}
// 保存
export const save = data => {
  return request({
    url: baseAdminUrl + '/user/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = data => {
  return request({
    url: baseAdminUrl + '/user/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/user/findPage',
    method: 'post',
    data
  })
}
// 查询用户角色信息
export const findUserRoles = params => {
  return request({
    url: baseAdminUrl + '/user/findUserRoles',
    method: 'get',
    params
  })
}
// 切换用户状态
export const userStatusSwitching = data => {
  return request({
    url: baseAdminUrl + '/user/userStatusSwitching',
    method: 'post',
    data
  })
}

// 查询用户详情信息
export const findByName = params => {
  return request({
    url: baseAdminUrl + '/user/findByName',
    method: 'get',
    params
  })
}
// 修改个人信息
export const updatePersonal = data => {
  return request({
    url: baseAdminUrl + '/user/updatePersonal',
    method: 'post',
    data
  })
}

// 更新用户密码
export const updatePassword = (params) => {
  return request({
    url: baseAdminUrl + '/user/updatePassword',
    method: 'get',
    params
  })
}

// 下载用户头像
export const download = (data) => {
  return request({
    url: baseAdminUrl + '/download?fileId=' + data,
    responseType: 'arraybuffer',
    method: 'get'
  }).then(function(response) { // 将后台的图片二进制流传华为base64
    return 'data:image/png;base64,' + btoa(
      new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
  })
}
