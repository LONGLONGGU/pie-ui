import request from '@/utils/request'
const baseAdminUrl = '/pie-data-manager'
/** **********************数据源开始**************************/
// 初始化查询
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/findPage',
    method: 'POST',
    data
  })
}
//   修改/保存
export const save = data => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/save',
    method: 'post',
    data
  })
}
// 删除
export const deleted = (data) => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/delete',
    method: 'POST',
    data
  })
}
//连接测试
export const Connection = (data) => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/Connection',
    method: 'POST',
    data
  })
}
//查询表
export const selectTable = (data) => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/selectTable',
    method: 'POST',
    data
  })
}

//更新数据
export const flushLucene = () => {
  return request({
    url: baseAdminUrl + '/dRequesHabit/flushLucene',
    method: 'POST'
  })
}
