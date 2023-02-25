import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

/*
 * 角色管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/role/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/role/delete',
    method: 'post',
    data
  })
}

// 删除
export const deleteById = (data) => {
  return request({
    url: baseAdminUrl + '/role/delete/' + data,
    method: 'get',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/role/findPage',
    method: 'post',
    data
  })
}
// 查询全部
export const findAll = () => {
  return request({
    url: baseAdminUrl + '/role/findAll',
    method: 'get'
  })
}
// 查询角色菜单集合
export const findRoleMenus = (params) => {
  return request({
    url: baseAdminUrl + '/role/findRoleMenus',
    method: 'get',
    params
  })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
  return request({
    url: baseAdminUrl + '/role/saveRoleMenus',
    method: 'post',
    data
  })
}
