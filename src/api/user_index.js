// 封装有关用户管理的接口文件

// 引入axios
import axios from '@/utils/myaxios.js'
// 1获取全部用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
// 通过id获取用户数据
// export const getUserById = (userId) => {
//   return axios({
//     url: `users/${userId}`
//   })
// }
// 2实现提交编辑用户数据
export const editUserById = (data) => {
  return axios({
    method: 'put',
    url: `users/${data.id}`,
    data
  })
}

// 3修改用户状态
export const changeState = (uId, type) => {
  return axios({
    method: 'put',
    url: `users/${uId}/state/${type}`
  })
}

// 4添加用户
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
// 5实现角色分配
export const allotUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

// 6删除单个用户
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
