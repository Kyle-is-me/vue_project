// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取所有权限数据
export const getAllRights = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
