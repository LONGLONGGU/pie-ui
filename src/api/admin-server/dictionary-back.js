import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

// 异步加载树形结构信息
export const asyncFindTree = (parentId) => {
  return request({
    url: baseAdminUrl + '/sysDictionary/asyncFindTree/' + parentId,
    method: 'get'
  })
}

// 验证数据字典code是否重复
export const validateDicCode = data => {
  return request({
    url: baseAdminUrl + '/sysDictionary/validateCode',
    method: 'post',
    data
  })
}

// 保存数据字典值信息
export const saveAdd = data => {
  return request({
    url: baseAdminUrl + '/sysDictionary/saveAdd',
    method: 'post',
    data
  })
}

// 删除数据字典值信息
export const deleteDict = (id) => {
  return request({
    url: baseAdminUrl + '/sysDictionary/delete/' + id,
    method: 'get'
  })
}

// 查询数据字典值分页信息
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/sysDictionaryData/findPage',
    method: 'post',
    data
  })
}

// 初始化数据源树
export const findDataSourceList = (fileId) => {
  return request({
    url: baseAdminUrl + '/sysDictionary/findAll',
    method: 'GET'
  })
}

// 保存值
export const saveData = data => {
  return request({
    url: baseAdminUrl + '/sysDictionaryData/saveData',
    method: 'post',
    data
  })
}
// 逻辑删除树数据
export const deleteNode = params => {
  return request({
    url: baseAdminUrl + '/sysDictionary/delete',
    method: 'get',
    params
  })
}

// 逻辑删除数值
export const deleteData = params => {
  return request({
    url: baseAdminUrl + '/sysDictionaryData/deleteList',
    method: 'get',
    params
  })
}
