import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

/*
 * 微信菜单管理
 */

export const saveMenu = (data) => {
  return request({
    url: baseAdminUrl + '/wechatmenu/add',
    method: 'post',
    data
  })
}

// 查询公众号菜单信息
export const findMenu = (data) => {
  return request({
    url: baseAdminUrl + '/wechatmenu/findMenu/' + data,
    method: 'get'
  })
}
