import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

/*
 * 机构管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/wechatinfo/add',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/wechatinfo/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: baseAdminUrl + '/wechatinfo/findPage',
    method: 'post',
    data
  })
}
