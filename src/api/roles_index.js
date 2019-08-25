// 这个文件封装了角色列表的接口方法

// 引入axios
import axios from '@/utils/myaxios.js'

// 获取全部角色信息
export const getAllRoles = () => {
  return axios({
    url: 'roles'
  })
}
