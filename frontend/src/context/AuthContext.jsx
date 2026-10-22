import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../lib/apiClient'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../lib/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const logout = useCallback(() => {
    clearAccessToken()
    setUser(null)
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function restoreSession() {
      const storedToken = getAccessToken()
      if (!storedToken) {
        if (!isCancelled) {
          setIsBootstrapping(false)
        }
        return
      }

      try {
        const sessionUser = await authApi.getCurrentUser()
        if (!isCancelled) {
          setUser(sessionUser)
        }
      } catch {
        clearAccessToken()
        if (!isCancelled) {
          setUser(null)
        }
      } finally {
        if (!isCancelled) {
          setIsBootstrapping(false)
        }
      }
    }

    restoreSession()

    return () => {
      isCancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const loginResponse = await authApi.login({ email, password })
    setAccessToken(loginResponse.accessToken)
    setUser(loginResponse.user)
    return loginResponse
  }, [])

  const value = useMemo(
    () => ({
      user,
      isBootstrapping,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, isBootstrapping, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
