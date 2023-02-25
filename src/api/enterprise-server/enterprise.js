import request from '@/utils/request'
const baseAdminUrl = '/pie-enterprise'
/*
 * 操作日志模块
 */

// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/findPage',
    method: 'post',
    data
  })
}

// 行业查询
export const tradeList = (data) => {
  return request({
    url: baseAdminUrl + '/busTrade/pc/getTree',
    method: 'post',
    data
  })
}

// // 产业查询
// export const industryList = (data) => {
//   return request({
//     url: baseAdminUrl + '/busIndustry/app/getTree',
//     method: 'post',
//     data
//   })
// }

// 行政区划查询
export const districtList = (data) => {
  return request({
    url: baseAdminUrl + '/busDistrict/pc/getDistrictTree',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/delete',
    method: 'post',
    data
  })
}

// 模糊查询（抽屉）
export const searchName = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/fuzzySearch',
    method: 'post',
    data
  })
}

// 模糊查询（页面列表）
export const searchByName = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/searchByName',
    method: 'post',
    data
  })
}

// id查询附件信息
export const searchFile = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterpriseAttachments/listBusAttachment/',
    method: 'post',
    data
  })
}

// 收录方法
export const addEnterprise = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/addEnterprise',
    method: 'post',
    data
  })
}

// 查询行政区划name
export const findDistrict = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/findDistrict',
    method: 'post',
    data
  })
}

// 查询行业name
export const findTrade = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/findTrade',
    method: 'post',
    data
  })
}

// 查询清洗后的行业name
export const findCleanTrade = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/findCleanTrade',
    method: 'post',
    data
  })
}

// 手动收录方法
export const addHandEnterprise = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/addHandEnterprise',
    method: 'post',
    data
  })
}

// 更新方法
export const updateEnterprise = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/updateEnterprise',
    method: 'post',
    data
  })
}

// 修改方法
export const alterEnterprise = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/alterEnterprise',
    method: 'post',
    data
  })
}

// 企业行业关联表入库
export const enterpriseTrade = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/enterpriseTrade',
    method: 'post',
    data
  })
}

// 附件删除
export const batchDeleteFiles = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterpriseAttachments/delete',
    method: 'post',
    data
  })
}

// bus_enterprise数据库附件删除
export const deleteBusFile = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterpriseAttachments/deleteFile',
    method: 'post',
    data
  })
}
// 附件上传
export const uploadFiles = (files) => {
  return request({
    url: baseAdminUrl + '/busEnterpriseAttachments/upload',
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
    url: baseAdminUrl + '/busEnterpriseAttachments/download/?fileId=' + fileId,
    method: 'GET',
    responseType: 'arraybuffer'
  })
}

// 附件表添加
export const insertFile = (data) => {
  return request({
    url: baseAdminUrl + '/busEnterpriseAttachments/insert',
    method: 'POST',
    data
  })
}
// 导出报告
export const exportReport = (fileId) => {
  return request({
    url: baseAdminUrl + '/busEnterprise/exportWordTwo/' + fileId,
    method: 'GET',
    responseType: 'arraybuffer'
  })
}
// // 导入
// export const input = (files) => {
//   return request({
//     url: baseAdminUrl + '/busEnterprise/input',
//     method: 'POST',
//     headers: {
//       'Content-type': 'multipart/form-data'
//     },
//     data: files
//   })
// }

