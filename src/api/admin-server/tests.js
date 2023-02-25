import request from '@/utils/request'
const baseTowThirdUrl = '/pie-two-third'
// 保存
export const save = () => {
  return request({
    url: baseTowThirdUrl + '/busEnterpriseInvestment/saveInvestment',
    method: 'GET'
  })
}
