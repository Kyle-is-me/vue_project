// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取商品列表数据
export const getAllGoods = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
