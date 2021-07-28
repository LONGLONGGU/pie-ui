import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

/*
 * 部门管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/dept/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/dept/delete',
    method: 'post',
    data
  })
}
// 查询部门树
export const findDeptTree = () => {
  return request({
    url: baseAdminUrl + '/dept/findTree',
    method: 'get'
  })
}

// 异步加载部门树
export const asyncFindTree = (parentId) => {
  return request({
    url: baseAdminUrl + '/dept/findTree/' + parentId,
    method: 'get'
  })
}
