import request from '@/utils/request'

/*
 * 部门管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: '/dept/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: '/dept/delete',
    method: 'post',
    data
  })
}
// 查询机构树
export const findDeptTree = () => {
  return request({
    url: '/dept/findTree',
    method: 'get'
  })
}
