import axios from 'axios'

export function request(config){
  const instance = axios.create({
    //mrly.top/api/shop
    baseURL: 'http://152.136.185.210:7878/api/m5',
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
