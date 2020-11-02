import request from '@/utils/request'

/*
 * 操作日志模块
 */

// 删除
export const batchDelete = (data) => {
  return request({
    url: '/loginlog/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: '/loginlog/findPage',
    method: 'post',
    data
  })
}
