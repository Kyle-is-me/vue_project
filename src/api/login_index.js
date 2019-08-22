// 封装api接口的方法

// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 实现登录验证
export const login = (data) => {
  // 看接口文档
  // axios返回一个promise对象
  return axios({
    //   url：请求的路径，封装axios的时候已经设置过基准路径了，所有axios会自动拼接
    url: 'login',
    // 请求方式，默认为get
    method: 'post',
    // 传递的数据，如果是get方式，就需要用params，post方式就用data
    data
  })
}
