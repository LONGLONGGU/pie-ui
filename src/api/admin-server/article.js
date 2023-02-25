import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL
// 分页查询
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/article/findPage',
    method: 'post',
    data
  })
}
// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/article/add',
    method: 'post',
    data
  })
}
// 查询文章信息
export const findByArticle = (data) => {
  return request({
    url: baseAdminUrl + '/article/' + data,
    method: 'get',
    data
  })
}
