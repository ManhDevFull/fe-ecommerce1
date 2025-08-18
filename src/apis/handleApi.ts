import axiosClient from "./axiosClient"

const handleAPI = async (
  url: string, data?: any, method?: 'get' | 'post' | 'put' | 'delete'
) => {
  return await axiosClient(url, {
    method: method ?? 'get',
    data
  })
}
export default handleAPI