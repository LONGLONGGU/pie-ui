import request from '@/utils/request'
const baseAdminUrl = '/pie-admin'

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/menu/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/menu/delete',
    method: 'post',
    data
  })
}
export function findMneu(params) {
  return request({
    url: baseAdminUrl + '/menu/findNavTree',
    method: 'get',
    params: params
  })
}
// 查找导航菜单树
export const findNavTree = (params) => {
  return request({
    url: baseAdminUrl + '/menu/findNavTree',
    method: 'get',
    params
  })
}

// 查找导航菜单树
export const findMenuTree = () => {
  return request({
    url: baseAdminUrl + '/menu/findMenuTree',
    method: 'get'
  })
}
