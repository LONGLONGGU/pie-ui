import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

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
    method: 'post',
    data
  })
}

export const restore = data => {
  return request({
    url: baseAdminUrl + '/backup/restore',
    method: 'post',
    data
  })
}

export const remove = data => {
  return request({
    url: baseAdminUrl + '/backup/delete?name=' + data,
    method: 'get'
  })
}
// 异步加载部门树
export const asyncFindTree = (parentId) => {
  return request({
    url: baseAdminUrl + '/backup/findTree/' + parentId,
    method: 'get'
  })
}

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/backup/save',
    method: 'post',
    data
  })
}

// 保存
export const singleDelete = (data) => {
  return request({
    url: baseAdminUrl + '/backup/delete',
    method: 'post',
    data
  })
}

// 分页查询
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/backup/findPage',
    method: 'post',
    data
  })
}

export const batchDelete = data => {
  return request({
    url: baseAdminUrl + '/backup/deleteBackupInfo',
    method: 'post',
    data
  })
}
