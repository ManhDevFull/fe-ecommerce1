import axios from "axios";
import queryString from "query-string";
const url = ''
const axiosClient = axios.create({
  baseURL: url,
  paramsSerializer: (params) => queryString.stringify(params)
})
axiosClient.interceptors.request.use(async (config: any) => {
  const accesstoken = ''
  config.headers = {
    Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
    Accept: 'application/json',
    ...config.headers
  }
  return { ...config, data: config.data ?? null }
})
axios.interceptors.response.use(
  (res: any) => {
    if (res.data && res.status >= 200 && res.status <= 299) {
      return res.data
    } else {
      return Promise.reject(res.data)
    }
  },
  (error: any) => {
    const { response } = error
    return Promise.reject(response.data)
  }
)
export default axiosClient