import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'
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
// 删除
export const batchDelete = data => {
  return request({
    url: baseAdminUrl + '/article/remove/' + data,
    method: 'get',
    data
  })
}

// 附件上传
export const uploadFiles = (files) => {
  return request({
    url: baseAdminUrl + '/article/uploadFiles',
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: files
  })
}

