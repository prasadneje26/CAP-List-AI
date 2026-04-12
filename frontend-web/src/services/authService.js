// File: frontend-web/src/services/authService.js
import api from './api'
export const authService = {
  login:    (email, password) => api.post('/auth/login',    { email, password }).then(r => r.data.data),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }).then(r => r.data.data),
  logout:   () => api.post('/auth/logout'),
  getMe:    () => api.get('/auth/me').then(r => r.data.data),
}
