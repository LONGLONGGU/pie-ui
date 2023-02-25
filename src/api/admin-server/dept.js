import request from '@/utils/request'
const baseAdminUrl = process.env.VUE_APP_BASE_ADMIN_URL

// 保存
export const save = (data) => {
  return request({
    url: baseAdminUrl + '/dept/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return request({
    url: baseAdminUrl + '/dept/delete',
    method: 'post',
    data
  })
}

// 查询部门树
export const findDeptTree = () => {
  return request({
    url: baseAdminUrl + '/dept/findTree',
    method: 'get'
  })
}

// 异步加载部门树
export const asyncFindTree = (parentId) => {
  return request({
    url: baseAdminUrl + '/dept/findTree/' + parentId,
    method: 'get'
  })
}

// 查询部门角色信息
export const getDeptRoles = (deptId) => {
  return request({
    url: baseAdminUrl + '/dept/getDeptRoles/' + deptId,
    method: 'get'
  })
}
