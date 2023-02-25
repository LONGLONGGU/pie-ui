import request from '@/utils/request'
const baseAdminUrl = '/pie-data-clean'
/** **********************数据源开始**************************/
// 初始化查询
export const findAll = (fileId) => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/findAll',
    method: 'GET'
  })
}

// 保存
export const save = data => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/save',
    method: 'post',
    data
  })
}

// 检查连接情况
export const getlinkUrl = params => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/linkUrl',
    method: 'get',
    params
  })
}
/** **********************数据源结束**************************/

/** **********************数据集市开始**************************/
// 初始化数据源树
export const findDataSourceList = (fileId) => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/findAll',
    method: 'GET'
  })
}
// 初始化数据表树
export const findDataTableList = params => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/findAllTable',
    method: 'GET',
    params
  })
}

// 执行自定义语句
export const exeSql = params => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/exeSql',
    method: 'GET',
    params
  })
}

// 执行自定义语句
export const saveDataGroup = data => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/saveDataGroup',
    method: 'post',
    data
  })
}

/** **********************数据集市结束**************************/

/** **********************报告制作开始**************************/

// 保存echart图片

export const saveEchartPic = data => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/saveEchartPic',
    method: 'post',
    data
  })
}

/** **********************报告制作结束**************************/

// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/log/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/dataCleanManager/findPage',
    method: 'post',
    data
  })
}

// 开始清洗
export const startC = data => {
  return request({
    url: baseAdminUrl + '/dataCleanManager/startClean',
    method: 'post',
    data
  })
}
// 更新清洗进程
export const clearnProcess = data => {
  return request({
    url: baseAdminUrl + '/dataCleanManager/clean',
    method: 'post',
    data
  })
}
