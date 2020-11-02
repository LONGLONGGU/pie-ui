import request from '@/utils/request'

// 分页查询
export const findPage = data => {
  return request({
    url: '/article/findPage',
    method: 'post',
    data
  })
}
// 保存
export const save = (data) => {
  return request({
    url: '/article/add',
    method: 'post',
    data
  })
}
// 查询文章信息
export const findByArticle = (data) => {
  return request({
    url: '/article/' + data,
    method: 'get',
    data
  })
}
// 删除
export const batchDelete = data => {
  return request({
    url: '/article/remove/' + data,
    method: 'get',
    data
  })
}

// 附件上传
export const uploadFiles = (files) => {
  return request({
    url: '/article/uploadFiles',
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: files
  })
}

