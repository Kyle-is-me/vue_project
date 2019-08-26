// 这个文件封装了角色列表的接口方法

// 引入axios
import axios from '@/utils/myaxios.js'

// 获取全部角色信息
export const getAllRoles = () => {
  return axios({
    url: 'roles'
  })
}
// 删除角色指定权限
export const delRightById = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 添加角色
export const addRole = (data) => {
  return axios({
    method: 'post',
    url: 'roles',
    data
  })
}
// 删除角色
export const delRoleById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
