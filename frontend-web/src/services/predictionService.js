// File: frontend-web/src/services/predictionService.js
import api from './api'
export const predictionService = {
  fullPrediction:  ()     => api.post('/predict/full').then(r => r.data),
  predictCutoff:   (body) => api.post('/predict/cutoff',    body).then(r => r.data),
  predictAdmission:(body) => api.post('/predict/admission', body).then(r => r.data),
  getHistory:      ()     => api.get('/predict/history').then(r => r.data),
}
