import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

/*
 * 机构管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/org/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/org/delete',
    method: 'post',
    data
  })
}

// 单个删除方法
export const removeById = (data) => {
  return request({
    url: baseAdminUrl + '/org/delete/' + data,
    method: 'get',
    data
  })
}

// 重置管理员密码
export const resetAdminPwd = (data) => {
  return request({
    url: baseAdminUrl + '/user/resetPwdByOrgId/' + data,
    method: 'get',
    data
  })
}

// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/org/findPage',
    method: 'post',
    data
  })
}

// 查询机构菜单集合
export const findOrgMenus = (params) => {
  return request({
    url: baseAdminUrl + '/org/findOrgMenus',
    method: 'get',
    params
  })
}

// 保存机构菜单
export const saveOrgMenus = (data) => {
  return request({
    url: baseAdminUrl + '/org/saveOrgMenus',
    method: 'post',
    data
  })
}
