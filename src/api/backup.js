import request from '@/utils/request'

export const findRecords = data => {
  return request({
    url: '/backup/findRecords',
    method: 'get',
    data
  })
}

export const backup = data => {
  return request({
    url: '/backup/backup',
    method: 'get',
    data
  })
}

export const restore = data => {
  return request({
    url: '/backup/restore?name=' + data,
    method: 'get'
  })
}

export const remove = data => {
  return request({
    url: '/backup/delete?name=' + data,
    method: 'get'
  })
}

