// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: frontend-web/src/App.jsx
// ============================================================

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext.jsx'
import AppRoutes         from './routes/AppRoutes.jsx'
import './assets/styles/index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
