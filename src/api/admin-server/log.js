import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL
const baseMultipleDataSourceUrl = process.env.VUE_APP_BASE_MULTIPLE_DATASOURCE_URL
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
    url: baseAdminUrl + '/log/findPage',
    method: 'post',
    data
  })
}

// 导出统计信息
export const exportCount = data => {
  return request({
    url: baseMultipleDataSourceUrl + '/exportCountInfo',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export const querySystemStatisticsData = data => {
  return request({
    url: `${baseMultipleDataSourceUrl}/querySystemStatisticsData`,
    method: 'post',
    data: data
  })
}

