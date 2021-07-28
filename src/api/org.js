import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

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

// 保存架构菜单
export const saveOrgMenus = (data) => {
  return request({
    url: baseAdminUrl + '/org/saveOrgMenus',
    method: 'post',
    data
  })
}
