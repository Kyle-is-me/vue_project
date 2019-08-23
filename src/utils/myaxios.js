// 这个文件封装axios
import axios from 'axios'

// 封装基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送前做点什么
//   console.log(config)
  // 获取token
  let mytoken = localStorage.getItem('itcast_manage_35')
  if (mytoken) {
    //  文档中要求须使用Authorization这个键
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  // Promise.reject(error)：终止本次请求
  return Promise.reject(error)
})

// 返回一个axios的promise对象
export default axios
