import request from '@/utils/request'
const fileUploadUrl = process.env.VUE_APP_BASE_FILE_UPLOAD_URL
// 分页查询
export const findPage = data => {
  return request({
    url: fileUploadUrl + '/attachments/findPage',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = data => {
  return request({
    url: fileUploadUrl + '/attachments/delete',
    method: 'post',
    data
  })
}

// 附件上传
export const uploadFiles = (files) => {
  return request({
    url: fileUploadUrl + '/uploadServer',
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: files
  })
}
// 附件下载
export const download = (fileId) => {
  return request({
    url: fileUploadUrl + '/download?fileId=' + fileId,
    method: 'GET',
    responseType: 'arraybuffer'
  })
}
