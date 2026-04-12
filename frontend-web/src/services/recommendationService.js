// File: frontend-web/src/services/recommendationService.js
import api from './api'
export const recommendationService = {
  get: () => api.get('/recommendations').then(r => r.data),
}
