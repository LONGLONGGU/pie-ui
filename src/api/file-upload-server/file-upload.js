import request from '@/utils/request'
const baseFileUploadUrl = process.env.VUE_APP_BASE_FILE_UPLOAD_URL
// 删除
export const batchDeleteFiles = data => {
  return request({
    url: baseFileUploadUrl + '/deleteServer?fileId=' + data,
    method: 'get',
    data
  })
}

// 附件上传
export const uploadFiles = (files) => {
  return request({
    url: baseFileUploadUrl + '/uploadServer',
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
    url: baseFileUploadUrl + '/download?fileId=' + fileId,
    method: 'GET',
    responseType: 'arraybuffer'
  })
}
