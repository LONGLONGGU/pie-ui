import request from '@/utils/request'

// 保存
export const save = (data) => {
  return request({
    url: '/menu/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: '/menu/delete',
    method: 'post',
    data
  })
}
export function findMneu(params) {
  return request({
    url: '/menu/findNavTree',
    method: 'get',
    params: params
  })
}
// 查找导航菜单树
export const findNavTree = (params) => {
  return request({
    url: '/menu/findNavTree',
    method: 'get',
    params
  })
}

// 查找导航菜单树
export const findMenuTree = () => {
  return request({
    url: '/menu/findMenuTree',
    method: 'get'
  })
}
