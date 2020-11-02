import request from '@/utils/request'

/*
 * 角色管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: '/role/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: '/role/findPage',
    method: 'post',
    data
  })
}
// 查询全部
export const findAll = () => {
  return request({
    url: '/role/findAll',
    method: 'get'
  })
}
// 查询角色菜单集合
export const findRoleMenus = (params) => {
  return request({
    url: '/role/findRoleMenus',
    method: 'get',
    params
  })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
  return request({
    url: '/role/saveRoleMenus',
    method: 'post',
    data
  })
}
