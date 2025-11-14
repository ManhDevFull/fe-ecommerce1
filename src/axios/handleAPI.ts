import axiosClient from "./axiosClient"

const handleAPI = async <T = any>(
    url: string, data? : any, method? : 'post'|'put'|'get'|'delete'|'patch'
): Promise<T> => {
  const res = await axiosClient(url, {
      method: method ?? 'get',
      data,
  })
  return res as T
}
export default handleAPI
