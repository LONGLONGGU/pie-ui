import request from '@/utils/request'

/*
 * 微信菜单管理
 */

export const saveMenu = (data) => {
  return request({
    url: '/buswechatmenu/save',
    method: 'post',
    data
  })
}

// 查询公众号菜单信息
export const findMenu = (data) => {
  return request({
    url: '/buswechatmenu/findMenu/' + data,
    method: 'get'
  })
}
