// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: frontend-web/src/context/AuthContext.jsx
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cap_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    localStorage.setItem('cap_user',  JSON.stringify(data.user))
    localStorage.setItem('cap_token', data.accessToken)
    localStorage.setItem('cap_refresh', data.refreshToken)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await authService.register(name, email, password)
    setUser(data.user)
    localStorage.setItem('cap_user',  JSON.stringify(data.user))
    localStorage.setItem('cap_token', data.accessToken)
    localStorage.setItem('cap_refresh', data.refreshToken)
    return data
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('cap_user')
    localStorage.removeItem('cap_token')
    localStorage.removeItem('cap_refresh')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
