import axios from 'axios'
export function makeClient(apiBase, token){
  const inst = axios.create({ baseURL: apiBase })
  if(token){
    inst.interceptors.request.use(cfg => {
      cfg.headers = cfg.headers || {}
      cfg.headers.Authorization = `Bearer ${token}`
      return cfg
    })
  }
  return inst
}