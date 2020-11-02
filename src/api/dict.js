import request from '@/utils/request'

/*
 * 字典管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: '/dict/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: '/dict/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: '/dict/findPage',
    method: 'post',
    data
  })
}

// 查询字典所有数据类型
export const findTypes = () => {
  return request({
    url: '/dict/findTypes',
    method: 'get'
  })
}
// 查询该类型所有数据
export const findByType = (data) => {
  return request({
    url: '/dict/findByType?type=' + data,
    method: 'get'
  })
}
