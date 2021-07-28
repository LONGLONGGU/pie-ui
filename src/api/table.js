import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

export function getList(params) {
  return request({
    url: baseAdminUrl + '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
