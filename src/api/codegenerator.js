import request from '@/utils/request'

// 分页查询
export const findPage = data => {
  return request({
    url: '/code/findPage',
    method: 'post',
    data
  })
}

// 生成代码
export const generator = data => {
  return request({
    url: '/code/generator',
    method: 'post',
    data
  })
}
