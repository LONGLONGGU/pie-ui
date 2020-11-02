import request from '@/utils/request'

/*
 * 机构管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: '/org/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return request({
    url: '/org/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: '/org/findPage',
    method: 'post',
    data
  })
}

// 查询机构菜单集合
export const findOrgMenus = (params) => {
  return request({
    url: '/org/findOrgMenus',
    method: 'get',
    params
  })
}

// 保存架构菜单
export const saveOrgMenus = (data) => {
  return request({
    url: '/org/saveOrgMenus',
    method: 'post',
    data
  })
}
