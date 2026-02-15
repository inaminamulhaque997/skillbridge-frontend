import { PlatformUser, SubjectCategory, PlatformStats } from '@/types/admin'
import { getBookings } from './booking'

// Mock users data
const mockUsers: PlatformUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'tutor',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2024-02-15',
    sessionsCount: 145,
  },
  {
    id: 'user-2',
    name: 'Alex Thompson',
    email: 'alex.t@example.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-02-01',
    lastActive: '2024-02-15',
    sessionsCount: 23,
    totalSpent: 1035,
  },
  {
    id: 'user-3',
    name: 'Michael Rodriguez',
    email: 'michael.r@example.com',
    role: 'tutor',
    status: 'active',
    joinedDate: '2024-01-20',
    lastActive: '2024-02-14',
    sessionsCount: 98,
  },
  {
    id: 'user-4',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-02-05',
    lastActive: '2024-02-15',
    sessionsCount: 15,
    totalSpent: 900,
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'tutor',
    status: 'banned',
    joinedDate: '2023-12-10',
    lastActive: '2024-01-20',
    sessionsCount: 45,
  },
]

// Mock categories
const mockCategories: SubjectCategory[] = [
  { id: 'cat-1', name: 'Mathematics', icon: '🔢', description: 'Algebra, Calculus, Geometry', tutorCount: 45, status: 'active', order: 1 },
  { id: 'cat-2', name: 'Science', icon: '🔬', description: 'Physics, Chemistry, Biology', tutorCount: 38, status: 'active', order: 2 },
  { id: 'cat-3', name: 'Programming', icon: '💻', description: 'Web Dev, Python, Java', tutorCount: 52, status: 'active', order: 3 },
  { id: 'cat-4', name: 'Languages', icon: '🗣️', description: 'English, Spanish, French', tutorCount: 29, status: 'active', order: 4 },
  { id: 'cat-5', name: 'Business', icon: '💼', description: 'Marketing, Finance, Management', tutorCount: 18, status: 'active', order: 5 },
]

// Get all users
export const getAllUsers = (): PlatformUser[] => {
  return mockUsers
}

// Get user by ID
export const getUserById = (id: string): PlatformUser | undefined => {
  return mockUsers.find((user) => user.id === id)
}

// Get users by role
export const getUsersByRole = (role: 'student' | 'tutor' | 'admin'): PlatformUser[] => {
  return mockUsers.filter((user) => user.role === role)
}

// Get users by status
export const getUsersByStatus = (status: 'active' | 'banned' | 'pending'): PlatformUser[] => {
  return mockUsers.filter((user) => user.status === status)
}

// Ban user
export const banUser = (userId: string, reason: string): boolean => {
  console.log(`[v0] Banning user ${userId} for reason: ${reason}`)
  return true
}

// Unban user
export const unbanUser = (userId: string): boolean => {
  console.log(`[v0] Unbanning user ${userId}`)
  return true
}

// Delete user
export const deleteUser = (userId: string): boolean => {
  console.log(`[v0] Deleting user ${userId}`)
  return true
}

// Update user role
export const updateUserRole = (userId: string, newRole: 'student' | 'tutor' | 'admin'): boolean => {
  console.log(`[v0] Updating user ${userId} role to ${newRole}`)
  return true
}

// Get all categories
export const getAllCategories = (): SubjectCategory[] => {
  return mockCategories
}

// Add category
export const addCategory = (category: Omit<SubjectCategory, 'id'>): SubjectCategory => {
  const newCategory = {
    ...category,
    id: `cat-${Date.now()}`,
  }
  console.log('[v0] Adding new category:', newCategory)
  return newCategory
}

// Update category
export const updateCategory = (id: string, updates: Partial<SubjectCategory>): boolean => {
  console.log(`[v0] Updating category ${id}:`, updates)
  return true
}

// Delete category
export const deleteCategory = (id: string): boolean => {
  console.log(`[v0] Deleting category ${id}`)
  return true
}

// Toggle category status
export const toggleCategoryStatus = (id: string): boolean => {
  console.log(`[v0] Toggling category ${id} status`)
  return true
}

// Get platform statistics
export const getPlatformStats = (): PlatformStats => {
  const bookings = getBookings()
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter((u) => u.status === 'active').length,
    totalTutors: mockUsers.filter((u) => u.role === 'tutor').length,
    activeTutors: mockUsers.filter((u) => u.role === 'tutor' && u.status === 'active').length,
    totalStudents: mockUsers.filter((u) => u.role === 'student').length,
    activeStudents: mockUsers.filter((u) => u.role === 'student' && u.status === 'active').length,
    totalBookings: bookings.length,
    todayBookings: bookings.filter((b) => b.date === today).length,
    weekBookings: bookings.filter((b) => b.date >= weekAgo).length,
    monthBookings: bookings.filter((b) => b.date >= monthAgo).length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    monthRevenue: bookings.filter((b) => b.date >= monthAgo).reduce((sum, b) => sum + b.totalPrice, 0),
    platformRating: 4.8,
    completionRate: 94,
  }
}
