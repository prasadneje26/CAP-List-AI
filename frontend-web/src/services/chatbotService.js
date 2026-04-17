// File: frontend-web/src/services/chatbotService.js
import api from './api'
export const chatbotService = {
  ask: (message, history = []) =>
    api.post('/chatbot/ask', { message, history }).then(r => r.data.data),
}
