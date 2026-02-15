import { User, UserRole } from '@/types/auth'

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

// Mock database of users
const MOCK_USERS: Record<string, User & { password: string }> = {
  'student@test.com': {
    id: '1',
    email: 'student@test.com',
    name: 'Sarah Johnson',
    role: 'student',
    avatar: '/placeholder.svg?height=40&width=40',
    password: 'password123',
  },
  'tutor@test.com': {
    id: '2',
    email: 'tutor@test.com',
    name: 'Michael Rodriguez',
    role: 'tutor',
    avatar: '/placeholder.svg?height=40&width=40',
    password: 'password123',
  },
  'admin@skillbridge.com': {
    id: '3',
    email: 'admin@skillbridge.com',
    name: 'Admin User',
    role: 'admin',
    avatar: '/placeholder.svg?height=40&width=40',
    password: 'admin123',
  },
}

// Storage keys
const STORAGE_KEYS = {
  USER: 'skillbridge_user',
  TOKEN: 'skillbridge_token',
  REGISTERED_USERS: 'skillbridge_registered_users',
}

// Helper: Get all users (including dynamically registered ones)
const getAllUsers = (): Record<string, User & { password: string }> => {
  if (typeof window === 'undefined') return MOCK_USERS

  const stored = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
  const registeredUsers = stored ? JSON.parse(stored) : {}
  return { ...MOCK_USERS, ...registeredUsers }
}

// Helper: Save registered users
const saveRegisteredUser = (email: string, user: User & { password: string }) => {
  if (typeof window === 'undefined') return

  const allUsers = getAllUsers()
  allUsers[email] = user
  
  // Only save non-default users
  const { [email]: _, ...defaultUsers } = MOCK_USERS
  const customUsers = Object.keys(allUsers)
    .filter((key) => !Object.keys(defaultUsers).includes(key))
    .reduce((acc, key) => {
      acc[key] = allUsers[key]
      return acc
    }, {} as Record<string, User & { password: string }>)

  localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(customUsers))
}

// Helper: Generate mock token
const generateToken = (user: User): string => {
  return `mock_token_${user.id}_${Date.now()}`
}

// Helper: Simulate network delay
const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock user registration
 * Simulates API call with validation and error handling
 */
export const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  await simulateDelay(1000)

  // Validation
  if (!data.email || !data.fullName || !data.password) {
    throw new Error('All required fields must be filled')
  }

  if (data.password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }

  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match')
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    throw new Error('Please enter a valid email address')
  }

  // Check if user already exists
  const allUsers = getAllUsers()
  if (allUsers[data.email]) {
    throw new Error('An account with this email already exists')
  }

  // Role-specific validation
  if (data.role === 'student' && !data.educationLevel) {
    throw new Error('Education level is required for students')
  }

  if (data.role === 'tutor') {
    if (!data.expertise) {
      throw new Error('Expertise is required for tutors')
    }
    if (!data.experience) {
      throw new Error('Experience is required for tutors')
    }
    if (!data.hourlyRate || isNaN(Number(data.hourlyRate))) {
      throw new Error('Valid hourly rate is required for tutors')
    }
  }

  // Create new user
  const newUser: User & { password: string } = {
    id: `user_${Date.now()}`,
    email: data.email,
    name: data.fullName,
    role: data.role,
    avatar: '/placeholder.svg?height=40&width=40',
    password: data.password,
  }

  // Save to "database"
  saveRegisteredUser(data.email, newUser)

  // Generate token
  const token = generateToken(newUser)

  // Store auth data
  if (typeof window !== 'undefined') {
    const { password, ...userWithoutPassword } = newUser
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword))
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  }

  const { password: _, ...userResponse } = newUser
  return {
    user: userResponse,
    token,
  }
}

/**
 * Mock user login
 * Simulates API call with authentication
 */
export const mockLogin = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  await simulateDelay(1000)

  // Validation
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required')
  }

  // Check if user exists
  const allUsers = getAllUsers()
  const user = allUsers[credentials.email]

  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Verify password
  if (user.password !== credentials.password) {
    throw new Error('Invalid email or password')
  }

  // Verify role if specified
  if (credentials.role && user.role !== credentials.role) {
    throw new Error(`This account is registered as a ${user.role}, not a ${credentials.role}`)
  }

  // Generate token
  const token = generateToken(user)

  // Store auth data
  if (typeof window !== 'undefined') {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword))
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  }

  const { password: _, ...userResponse } = user
  return {
    user: userResponse,
    token,
  }
}

/**
 * Mock logout
 * Clears stored authentication data
 */
export const mockLogout = async (): Promise<void> => {
  await simulateDelay(300)

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }
}

/**
 * Get current authenticated user
 * Returns user from storage or null if not authenticated
 */
export const mockGetCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null

  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (!userStr || !token) {
      return null
    }

    const user: User = JSON.parse(userStr)
    return user
  } catch (error) {
    console.error('[v0] Error getting current user:', error)
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
  const user = mockGetCurrentUser()
  return user?.role === requiredRole
}

/**
 * Get authentication token
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

// Export mock users for testing reference
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
