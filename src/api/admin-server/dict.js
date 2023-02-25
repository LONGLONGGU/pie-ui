import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

/*
 * 字典管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/dict/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/dict/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/dict/findPage',
    method: 'post',
    data
  })
}

// 查询字典所有数据类型
export const findTypes = () => {
  return request({
    url: baseAdminUrl + '/dict/findTypes',
    method: 'get'
  })
}
// 查询该类型所有数据
export const findByType = (data) => {
  return request({
    url: baseAdminUrl + '/dict/findByType?type=' + data,
    method: 'get'
  })
}
