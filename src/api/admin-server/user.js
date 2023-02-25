import request from '@/utils/request'
const baseAdminUrl = 'pie-admin'
const baseAuthUrl = 'pie-auth'
// 登录方法
export function login(data) {
  return request({
    url: baseAuthUrl + '/oauth/token',
    method: 'post',
    data,
    headers: {
      // 客户端信息加密摘要认证（将clientId和clientSecret通过Base64进行加密），明文：client:123456
      'Authorization': 'Basic Y2xpZW50OjEyMzQ1Ng=='
    }
  })
}

// 退出方法
export function logout() {
  return request({
    url: baseAuthUrl + '/oauth/logout',
    method: 'post'
  })
}

// 查询当前登录用户信息
export function getInfo() {
  return request({
    url: baseAdminUrl + '/user/info',
    method: 'get'
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
    url: baseAdminUrl + '/fileUpload/download?fileId=' + data,
    responseType: 'arraybuffer',
    method: 'get'
  }).then(function(response) { // 将后台的图片二进制流传华为base64
    return 'data:image/png;base64,' + btoa(
      new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
  })
}

// 更新用户密码
export const importUserExcel = (data) => {
  return request({
    url: baseAdminUrl + '/user/importUserExcel',
    method: 'POST',
    data
  })
}

export const exportExcelUser = data => {
  return request({
    url: baseAdminUrl + '/user/exportExcelUser',
    method: 'POST',
    responseType: 'arraybuffer',
    data
  })
}
export const exportAllExcelUser = () => {
  return request({
    url: baseAdminUrl + '/user/exportAllExcelUser',
    method: 'POST',
    responseType: 'arraybuffer'
  })
}
// 重置管理员密码
export const resetPwd = (data) => {
  return request({
    url: baseAdminUrl + '/user/resetPwd/' + data,
    method: 'get'
  })
}
