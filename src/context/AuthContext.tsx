import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'contributor' | 'admin'
  is_approved_contributor: boolean
  total_score: number
  problems_solved: number
  can_become_contributor: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserProfile = async (token: string): Promise<User | null> => {
    try {
      const response = await api.get('/auth/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const login = async (token: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const userData = await fetchUserProfile(token)
      if (userData) {
        // Admin dashboard - only admins can access
        if (userData.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.')
        }
        setUser(userData)
        localStorage.setItem('auth_token', token)
      } else {
        throw new Error('Failed to fetch user profile')
      }
    } catch (error: any) {
      setError(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }

  const refreshUser = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const userData = await fetchUserProfile(token)
      if (userData && userData.role === 'admin') {
        setUser(userData)
      } else {
        logout()
      }
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const userData = await fetchUserProfile(token)
          if (userData && userData.role === 'admin') {
            setUser(userData)
          } else {
            localStorage.removeItem('auth_token')
          }
        } catch (error) {
          localStorage.removeItem('auth_token')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
