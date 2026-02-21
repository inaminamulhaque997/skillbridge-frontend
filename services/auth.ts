import { User, UserRole } from '@/types/auth'
import { apiClient } from '@/lib/api-client'

// Type definitions for auth service
export interface RegisterData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  // Student-specific fields
  educationLevel?: string
  learningGoals?: string
  // Tutor-specific fields
  expertise?: string
  experience?: string
  hourlyRate?: string
  bio?: string
}

export interface LoginCredentials {
  email: string
  password: string
  role?: UserRole // Optional: can be used to verify role on login
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthError {
  message: string
  field?: string
}

// Storage keys
const STORAGE_KEYS = {
  USER: 'skillbridge_user',
  TOKEN: 'skillbridge_token',
}

// API Response types (matching backend ApiResponse format)
interface ApiAuthResponse {
  success: boolean
  statusCode: number
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string
    }
    token: string
  }
  message: string
}

interface ApiUserResponse {
  success: boolean
  statusCode: number
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string
    }
  }
  message: string
}

// Helper: Map backend user to frontend user format
const mapBackendUser = (backendUser: ApiAuthResponse['data']['user']): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    role: backendUser.role.toLowerCase() as UserRole,
    avatar: backendUser.avatar || '/placeholder.svg?height=40&width=40',
  }
}

/**
 * User registration
 * Calls the backend API
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Map frontend role to backend format (uppercase)
    const roleMap: Record<UserRole, string> = {
      student: 'STUDENT',
      tutor: 'TUTOR',
      admin: 'ADMIN',
    }

    const response = await apiClient.post<ApiAuthResponse>('/api/auth/register', {
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: roleMap[data.role],
    })

    const { user, token } = response.data

    // Store auth data
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mapBackendUser(user)))
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    }

    return {
      user: mapBackendUser(user),
      token,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed'
    throw new Error(message)
  }
}

/**
 * User login
 * Calls the backend API
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<ApiAuthResponse>('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })

    const { user, token } = response.data

    // Store auth data
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mapBackendUser(user)))
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    }

    return {
      user: mapBackendUser(user),
      token,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed'
    throw new Error(message)
  }
}

/**
 * Logout
 * Clears stored authentication data and calls backend to clear cookie
 */
export const logout = async (): Promise<void> => {
  try {
    // Call backend to clear the HTTP-only cookie
    await apiClient.post('/api/auth/logout')
  } catch (error) {
    console.error('[SkillBridge] Error during logout:', error)
  } finally {
    // Always clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
    }
  }
}

/**
 * Get current authenticated user
 * Returns user from storage or fetches from API
 */
export const getCurrentUser = async (): Promise<User | null> => {
  if (typeof window === 'undefined') return null

  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (!userStr || !token) {
      return null
    }

    // Optionally verify with backend
    try {
      const response = await apiClient.get<ApiUserResponse>('/api/auth/me')
      const user = mapBackendUser(response.data.user)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      return user
    } catch {
      // If API call fails, return stored user
      const user: User = JSON.parse(userStr)
      return user
    }
  } catch (error) {
    console.error('[SkillBridge] Error getting current user:', error)
    return null
  }
}

/**
 * Get stored user (sync version)
 */
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null

  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null

    const user: User = JSON.parse(userStr)
    return user
  } catch (error) {
    console.error('[SkillBridge] Error getting stored user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  return !!token
}

/**
 * Verify user has required role
 */
export const hasRole = (requiredRole: UserRole): boolean => {
  const user = getStoredUser()
  return user?.role === requiredRole
}

/**
 * Get authentication token
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

// Keep mock functions for backward compatibility during transition
// These will be replaced by the real functions above
export const mockRegister = register
export const mockLogin = login
export const mockLogout = logout
export const mockGetCurrentUser = getStoredUser

// Export mock test users for reference
export const MOCK_TEST_USERS = {
  student: {
    email: 'student@test.com',
    password: 'password123',
    role: 'student' as UserRole,
  },
  tutor: {
    email: 'tutor@test.com',
    password: 'password123',
    role: 'tutor' as UserRole,
  },
  admin: {
    email: 'admin@skillbridge.com',
    password: 'admin123',
    role: 'admin' as UserRole,
  },
}
