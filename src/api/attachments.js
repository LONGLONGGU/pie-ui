import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

// 分页查询
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/attachments/findPage',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = data => {
  return request({
    url: baseAdminUrl + '/attachments/delete',
    method: 'post',
    data
  })
}

// 附件上传
export const uploadFiles = (files) => {
  return request({
    url: baseAdminUrl + '/upload',
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: files
  })
}

export const download = (fileId) => {
  return request({
    url: baseAdminUrl + '/download?fileId=' + fileId,
    method: 'GET',
    responseType: 'arraybuffer'
  })
}
