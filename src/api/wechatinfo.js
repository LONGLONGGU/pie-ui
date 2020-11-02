import request from '@/utils/request'

/*
 * 机构管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: '/wechatinfo/add',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return request({
    url: '/wechatinfo/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: '/wechatinfo/findPage',
    method: 'post',
    data
  })
}
