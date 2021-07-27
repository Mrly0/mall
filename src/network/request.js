import axios from 'axios'

export function request(config){
  const instance = axios.create({
    baseURL: 'mrly.top/api/shop',
    timeout: 5000
  })
  // reques 请求 拦截
  instance.interceptors.request.use(config => {
    return config
  },err => {

  })

  instance.interceptors.response.use(res => {
      return res.data
  },
    err => {
    console.log(err);
  })

  return instance(config)
}
