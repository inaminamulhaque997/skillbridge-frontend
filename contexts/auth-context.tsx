'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { User, UserRole } from '@/types/auth'
import { login as apiLogin, logout as apiLogout, getCurrentUser, register as apiRegister, RegisterData } from '@/services/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('[SkillBridge] Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      const response = await apiLogin({ email, password, role })
      setUser(response.user)

      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/admin')
      } else if (response.user.role === 'tutor') {
        router.push('/tutor/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await apiRegister(data)
      setUser(response.user)

      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/admin')
      } else if (response.user.role === 'tutor') {
        router.push('/tutor/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('[SkillBridge] Logout error:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
