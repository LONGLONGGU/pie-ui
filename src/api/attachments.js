import request from '@/utils/request'

// 分页查询
export const findPage = data => {
  return request({
    url: '/attachments/findPage',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = data => {
  return request({
    url: '/attachments/delete',
    method: 'post',
    data
  })
}

// 附件上传
export const uploadFiles = (files) => {
  return request({
    url: '/upload',
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: files
  })
}

export const download = (fileId) => {
  return request({
    url: '/download?fileId=' + fileId,
    method: 'GET',
    responseType: 'arraybuffer'
  })
}
