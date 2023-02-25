import request from '@/utils/request'
const baseAdminUrl = 'pie-admin'
const baseAuthUrl = 'pie-auth'

export function tokenApply(data) {
  return request({
    url: baseAuthUrl + '/oauth/apply',
    method: 'post',
    data,
    headers: {
      'TokenAuthorization': 'Basic Y2xpZW50MjoxMjM0NTY='
    }
  })
}
// 分页查询
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/sysTokenApple/findPage',
    method: 'post',
    data
  })
}

export const addOrUpdate = data => {
  return request({
    url: baseAdminUrl + '/sysTokenApple/addOrUpdate',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = data => {
  return request({
    url: baseAdminUrl + '/sysTokenApple/batchDelete',
    method: 'post',
    data
  })
}
