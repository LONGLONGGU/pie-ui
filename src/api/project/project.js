import request from '@/utils/request'
const pieProjectService = process.env.VUE_APP_BASE_PROJECT_URL
/*
 * 项目
 */
// 保存
export const save = (data) => {
  return request({
    url: pieProjectService + '/busProject/admin/addOrUpdate',
    method: 'post',
    data
  })
}
// 分页查询 gyl
export const findPage = data => {
  return request({
    url: pieProjectService + '/busProject/admin/findPage',
    method: 'post',
    data
  })
}
// 查询项目详情信息
export const getProject = data => {
  return request({
    url: pieProjectService + '/busProject/admin/get/' + data,
    method: 'get',
    data
  })
}
// 删除
export const projectDelete = data => {
  return request({
    url: pieProjectService + '/busProject/admin/batchDelete',
    method: 'post',
    data
  })
}

// 切换项目状态
export const projectStatusSwitching = data => {
  return request({
    url: pieProjectService + '/busProject/admin/projectStatusSwitching',
    method: 'post',
    data
  })
}

// 设置项目是否是重点项目
export const setKeyProject = data => {
  return request({
    url: pieProjectService + '/busProject/admin/setKeyProject',
    method: 'post',
    data
  })
}

// 设置项目是否是热点项目
export const setHotFlag = data => {
  return request({
    url: pieProjectService + '/busProject/admin/setHotFlag',
    method: 'post',
    data
  })
}

// 导出项目信息
export const exportExcelProject = data => {
  return request({
    url: pieProjectService + '/busProject/admin/exportExcelProject',
    method: 'POST',
    responseType: 'arraybuffer',
    data
  })
}
// 分页查询项目附件信息
export const findAttachmentPage = data => {
  return request({
    url: pieProjectService + '/busProjectAttachments/admin/findPage',
    method: 'post',
    data
  })
}

// 导出项目报告功能
export const exportReport = data => {
  return request({
    url: pieProjectService + '/projectReport/exportProjectReport/' + data,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

// 查询项目推荐企业地区搜索下拉列表
export const getProjectRecommendEnterpriseAddress = data => {
  return request({
    url: pieProjectService + '/busProject/admin/getProjectRecommendEnterprisePie',
    method: 'post',
    data
  })
}

// 查询项目推荐企业信息
export const listProjectRecommendEnterprise = data => {
  return request({
    url: pieProjectService + '/busProject/admin/listProjectRecommendEnterprise',
    method: 'post',
    data
  })
}

// 获查询时间列表
export const listQueryDate = data => {
  return request({
    url: pieProjectService + '/busProject/admin/listQueryDate',
    method: 'get'
  })
}

// 获取推荐政策列表信息
export const findRecommendPolicy = data => {
  return request({
    url: pieProjectService + '/busProject/admin/findRecommendPolicy',
    method: 'post',
    data
  })
}

