import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

export function getList(params) {
  return request({
    url: baseAdminUrl + '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
