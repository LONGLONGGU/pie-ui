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

// 保存数据字典值信息
export const saveData = data => {
  return request({
    url: baseAdminUrl + '/sysDictionaryData/saveData',
    method: 'post',
    data
  })
}

// 单个删除数据字典信息
export const deleteData = (id) => {
  return request({
    url: baseAdminUrl + '/sysDictionaryData/delete/' + id,
    method: 'get'
  })
}

// 批量删除数据字典信息
export const batchDeleteData = data => {
  debugger
  return request({
    url: baseAdminUrl + '/sysDictionaryData/batchDeleteData',
    method: 'post',
    data
  })
}

// 查询数据字典
export const getDictionaryByCode = (params) => {
  return request({
    url: baseAdminUrl + '/sysDictionaryData/findDicByCode',
    method: 'get',
    params
  })
}
