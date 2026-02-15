export type UserRole = 'student' | 'tutor' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}
