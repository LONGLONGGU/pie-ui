import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

export const findRecords = data => {
  return request({
    url: baseAdminUrl + '/backup/findRecords',
    method: 'get',
    data
  })
}

export const backup = data => {
  return request({
    url: baseAdminUrl + '/backup/backup',
    method: 'get',
    data
  })
}

export const restore = data => {
  return request({
    url: baseAdminUrl + '/backup/restore?name=' + data,
    method: 'get'
  })
}

export const remove = data => {
  return request({
    url: baseAdminUrl + '/backup/delete?name=' + data,
    method: 'get'
  })
}

