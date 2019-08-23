// 封装有关用户管理的接口文件

// 引入axios
import axios from '@/utils/myaxios.js'

export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
