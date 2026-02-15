'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { User, AuthContextType, UserRole } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('skillbridge_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('[v0] Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on role
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        role: role || 'student',
        avatar: undefined,
      }

      // Store in localStorage (replace with httpOnly cookies in production)
      localStorage.setItem('skillbridge_user', JSON.stringify(mockUser))
      localStorage.setItem('skillbridge_token', 'mock-jwt-token')

      setUser(mockUser)

      // Redirect based on role
      if (mockUser.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (mockUser.role === 'tutor') {
        router.push('/tutor/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('[v0] Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('skillbridge_user')
    localStorage.removeItem('skillbridge_token')
    setUser(null)
    router.push('/')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
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
