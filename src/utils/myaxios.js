// 这个文件封装axios
import axios from 'axios'

// 封装基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 返回一个axios的promise对象
export default axios
