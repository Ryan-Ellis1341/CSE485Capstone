import axios from 'axios'
export function makeClient(baseURL, token){
  const c = axios.create({ baseURL })
  c.interceptors.request.use(cfg => { if(token) cfg.headers['Authorization'] = `Bearer ${token}`; return cfg })
  return c
}