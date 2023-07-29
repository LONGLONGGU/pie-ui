import request from '@/utils/request'
const activitiServiceUrl = 'pie-activiti-service'

// 分页查询
export const findPage = data => {
  return request({
    url: activitiServiceUrl + '/repository/findPage',
    method: 'post',
    data
  })
}
