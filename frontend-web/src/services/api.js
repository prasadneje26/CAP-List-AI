// File: frontend-web/src/services/api.js
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('cap_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('cap_refresh')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken: refresh })
          localStorage.setItem('cap_token', data.data.accessToken)
          err.config.headers.Authorization = `Bearer ${data.data.accessToken}`
          return api(err.config)
        } catch { localStorage.clear(); window.location.href = '/login' }
      }
    }
    return Promise.reject(err)
  }
)

export default api
