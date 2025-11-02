import axios from 'axios'

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE,
})

// Attach Authorization header if auth_token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
