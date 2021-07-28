import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

/*
 * 操作日志模块
 */

// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/loginlog/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/loginlog/findPage',
    method: 'post',
    data
  })
}
