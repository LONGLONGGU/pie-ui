import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

// 分页查询
export const findPage = data => {
  return request({
    url: baseAdminUrl + '/code/findPage',
    method: 'post',
    data
  })
}

// 生成代码
export const generator = data => {
  return request({
    url: baseAdminUrl + '/code/generator',
    method: 'post',
    data
  })
}
