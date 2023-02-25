import request from '@/utils/request'
const baseAdminUrl = '/pie-data-manager'
/** **********************数据源开始**************************/
// 执行sql方法
export const ExeSql = params => {
  return request({
    url: baseAdminUrl + '/dScriptmysql/ExeSql',
    method: 'POST',
    params
  })
}
// 获取树
export const getTree = params => {
  return request({
    url: baseAdminUrl + '/dTreesqlscript/getObjectTree',
    method: 'GET',
    params
  })
}
// 保存sql脚本
export const saveScriptSql = (data) => {
  return request({
    url: baseAdminUrl + '/dScriptmysql/save',
    method: 'POST',
    data
  })
}
// 保存树节点
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/dTreesqlscript/save',
    method: 'POST',
    data
  })
}
// 删除树节点
export const Nodedelete = (data) => {
  return request({
    url: baseAdminUrl + '/dTreesqlscript/delete',
    method: 'POST',
    data
  })
}
// 用id查sql脚本
export const getfindByid = params => {
  return request({
    url: baseAdminUrl + '/dScriptmysql/getfindByid',
    method: 'POST',
    params
  })
}

// 查询上级名称
export const getObject = params => {
  return request({
    url: baseAdminUrl + '/dTreesqlscript/getObjectDTreesqlscript',
    method: 'POST',
    params
  })
}
// 查询数据源端
export const findAll = () => {
  return request({
    url: baseAdminUrl + '/dataSourceManager/list',
    method: 'GET'
  })
}
