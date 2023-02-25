import request from '@/utils/request'
const baseQuartzUrl = process.env.VUE_APP_BASE_QUARTZ_URL

// 分页查询
export const findPage = data => {
  return request({
    url: baseQuartzUrl + '/quartz/findPage',
    method: 'post',
    data
  })
}
// 保存
export const save = data => {
  return request({
    url: baseQuartzUrl + '/quartz/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = data => {
  return request({
    url: baseQuartzUrl + '/quartz/delete',
    method: 'post',
    data
  })
}

// 启动停止任务
export const starOrStopJob = data => {
  return request({
    url: baseQuartzUrl + '/quartz/starOrStopJob',
    method: 'post',
    data
  })
}
