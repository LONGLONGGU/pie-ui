import request from '@/utils/request'
const pieAppDownloadServiceUrl = 'pie-app-download-service'

// 分页查询
export const findPage = (data) => {
  return request({
    url: pieAppDownloadServiceUrl + '/busAppVersion/web/findPage',
    method: 'post',
    data
  })
}

// 保存
export const save = (data) => {
  return request({
    url: pieAppDownloadServiceUrl + '/busAppVersion/web/addOrUpdate',
    method: 'post',
    data
  })
}

// 通过ID查询记录信息
export const getById = (id) => {
  return request({
    url: pieAppDownloadServiceUrl + '/busAppVersion/web/get/' + id,
    method: 'get'
  })
}

// 删除
export const appDelete = data => {
  return request({
    url: pieAppDownloadServiceUrl + '/busAppVersion/web/batchDelete',
    method: 'post',
    data
  })
}

// 切换发布状态
export const stateSwitching = data => {
  return request({
    url: pieAppDownloadServiceUrl + '/busAppVersion/web/stateSwitching',
    method: 'post',
    data
  })
}

// 查询App下载记录
export const findPageDownload = (data) => {
  return request({
    url: pieAppDownloadServiceUrl + '/busAppDownload/web/findPage',
    method: 'post',
    data
  })
}

