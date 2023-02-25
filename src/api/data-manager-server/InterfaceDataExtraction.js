import request from '@/utils/request'
const baseTowThirdUrl = '/pie-data-manager'

import Qs from 'qs'
/************************数据源开始**************************/
//初始化查询
export const extractionData = (data)=> {
  return request({
    url: baseTowThirdUrl + '/busPolicy/extractionData',
    method: 'POST',
    data
  })

}
//保存
export const saveObject = (data)=> {
  return request({
    url: baseTowThirdUrl + '/busPolicy/saveObject',
    method: 'POST',
    data
  })

}
//查询数据源端
export const findAll = () => {
  return request({
    //url: baseAdminUrl + '/dataSourceManager/findAll',
    url: baseTowThirdUrl + '/dataSourceManager/list',
    method: 'GET',
  })
}
//查询表
export const selectTable = (data)=> {
  return request({
    url: baseTowThirdUrl + '/busPolicy/selectTable',
    method: 'POST',
    data
  })
}
//查询列
export const selectColumn = (data)=> {
  return request({
    url: baseTowThirdUrl + '/busPolicy/selectColumn',
    method: 'POST',
    data
  })
}
//保存成常用请求接口
export const save = (data)=> {
  return request({
    url: baseTowThirdUrl + '/dRequesHabit/save',
    method: 'POST',
    data
  })
}

//保存成常用请求接口11
export const getObject = (data)=> {
  return request({
    url: baseTowThirdUrl + '/dRequesHabit/tObject',
    method: 'POST',
    data
  })
}
// 查询常用请求接口
export const findPage = (data)=> {
  return request({
    url: baseTowThirdUrl + '/dRequesHabit/findPage',
    method: 'POST',
    data
  })
}
// 查询进度
export const realTime = (data)=> {
  return request({
    url: baseTowThirdUrl + '/busPolicy/realTime',
    method: 'POST',
    data
  })
}
//保存进度2
export const realTimeSave = (data)=> {
  return request({
    url: baseTowThirdUrl + '/busPolicy/realTimeSave',
    method: 'POST',
    data
  })
}
//测试接口
export const gettt = (data)=> {
  return request({
    url: baseTowThirdUrl + '/busPolicy/getdd',
    method: 'POST',
    data
  })
}
