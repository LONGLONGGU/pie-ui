import request from '@/utils/request'
const baseAdminUrl = '/pie-data-clean'

/*
 * 操作日志模块
 */

// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/log/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/dataCleanManager/findPage',
    method: 'post',
    data
  })
}
// 保存
export const save = data => {
  return request({
    url: baseAdminUrl + '/dataCleanManager/save',
    method: 'post',
    data
  })
}
// 开始清洗
export const startC = data => {
  return request({
    url: baseAdminUrl + '/dataCleanManager/startClean',
    method: 'post',
    data
  })
}
// 更新清洗进程
export const clearnProcess = data => {
  return request({
    url: baseAdminUrl + '/dataCleanManager/clean',
    method: 'post',
    data
  })
}

