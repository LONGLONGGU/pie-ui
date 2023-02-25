import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

/*
 * 行政区划调用模块
 */

// 查询行政区划树
export const findDistrictTree = () => {
  return request({
    url: baseAdminUrl + '/district/findTree',
    method: 'get'
  })
}

// 异步加载行政区划树
export const asyncFindDistrictTree = (parentId) => {
  return request({
    url: baseAdminUrl + '/district/findTree/' + parentId,
    method: 'get'
  })
}
