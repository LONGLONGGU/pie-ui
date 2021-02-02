import request from '@/utils/request'

/*
 * 微信菜单管理
 */

export const saveMenu = (data) => {
  return request({
    url: '/wechatmenu/add',
    method: 'post',
    data
  })
}

// 查询公众号菜单信息
export const findMenu = (data) => {
  return request({
    url: '/wechatmenu/findMenu/' + data,
    method: 'get'
  })
}
