// 封装有关用户管理的接口文件

// 引入axios
import axios from '@/utils/myaxios.js'
// 获取全部用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
// 通过id获取用户数据
export const getUserById = (userId) => {
  return axios({
    url: `users/${userId}`
  })
}
// 提交编辑用户数据
export const editUserById = (userId, data) => {
  return axios({
    method: 'put',
    url: `users/${userId}`,
    data
  })
}
// 获取全部角色信息
export const getAllRoles = () => {
  return axios({
    url: 'roles'
  })
}
// 修改用户状态
export const changeState = (uId, type) => {
  return axios({
    method: 'put',
    url: `users/${uId}/state/${type}`
  })
}
