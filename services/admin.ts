import { apiClient } from '@/lib/api-client'
import type { PlatformUser, SubjectCategory, PlatformStats } from '@/types/admin'

// API Response types
interface ApiResponse<T> {
  success: boolean
  statusCode: number
  data: T
  message: string
}

// Backend types
interface BackendUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Paginated response wrapper
interface PaginatedUsersResponse {
  users: BackendUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface PaginatedBookingsResponse {
  bookings: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface BackendCategory {
  id: string
  name: string
  description?: string
  icon?: string
  createdAt: string
}

interface BackendStats {
  totalUsers: number
  activeUsers: number
  totalTutors: number
  activeTutors: number
  totalStudents: number
  activeStudents: number
  totalBookings: number
  todayBookings: number
  weekBookings: number
  monthBookings: number
  totalRevenue: number
  monthRevenue: number
}

// Map backend user to frontend format
const mapBackendUser = (user: BackendUser): PlatformUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase() as 'student' | 'tutor' | 'admin',
    status: user.isActive ? 'active' : 'banned',
    avatar: user.avatar,
    joinedDate: user.createdAt,
    lastActive: user.updatedAt,
  }
}

// Map backend category to frontend format
const mapBackendCategory = (category: BackendCategory, tutorCount: number = 0): SubjectCategory => {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon || '📚',
    description: category.description || '',
    tutorCount,
    status: 'active',
    order: 1,
  }
}

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<PlatformUser[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedUsersResponse>>('/api/admin/users')
    // Handle paginated response - backend returns { users: [], pagination: {} }
    const users = response.data.users || response.data
    if (Array.isArray(users)) {
      return users.map(mapBackendUser)
    }
    return []
  } catch (error) {
    console.error('[SkillBridge] Error fetching users:', error)
    throw error
  }
}

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<PlatformUser | null> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendUser>>(`/api/admin/users/${id}`)
    return mapBackendUser(response.data)
  } catch (error) {
    console.error('[SkillBridge] Error fetching user:', error)
    return null
  }
}

/**
 * Update user (admin only)
 */
export const updateUser = async (userId: string, data: { isActive?: boolean; role?: string }): Promise<PlatformUser> => {
  try {
    const response = await apiClient.patch<ApiResponse<BackendUser>>(`/api/admin/users/${userId}`, data)
    return mapBackendUser(response.data)
  } catch (error) {
    console.error('[SkillBridge] Error updating user:', error)
    throw error
  }
}

/**
 * Ban user
 */
export const banUser = async (userId: string, reason?: string): Promise<boolean> => {
  try {
    await updateUser(userId, { isActive: false })
    return true
  } catch (error) {
    console.error('[SkillBridge] Error banning user:', error)
    return false
  }
}

/**
 * Unban user
 */
export const unbanUser = async (userId: string): Promise<boolean> => {
  try {
    await updateUser(userId, { isActive: true })
    return true
  } catch (error) {
    console.error('[SkillBridge] Error unbanning user:', error)
    return false
  }
}

/**
 * Delete user
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/api/admin/users/${userId}`)
    return true
  } catch (error) {
    console.error('[SkillBridge] Error deleting user:', error)
    return false
  }
}

/**
 * Get all categories
 */
export const getAllCategories = async (): Promise<SubjectCategory[]> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendCategory[]>>('/api/admin/categories')
    return response.data.map((cat) => mapBackendCategory(cat))
  } catch (error) {
    console.error('[SkillBridge] Error fetching categories:', error)
    throw error
  }
}

/**
 * Add category
 */
export const addCategory = async (category: Omit<SubjectCategory, 'id'>): Promise<SubjectCategory> => {
  try {
    const response = await apiClient.post<ApiResponse<BackendCategory>>('/api/admin/categories', {
      name: category.name,
      description: category.description,
      icon: category.icon,
    })
    return mapBackendCategory(response.data, category.tutorCount)
  } catch (error) {
    console.error('[SkillBridge] Error adding category:', error)
    throw error
  }
}

/**
 * Update category
 */
export const updateCategory = async (id: string, updates: Partial<SubjectCategory>): Promise<boolean> => {
  try {
    await apiClient.put(`/api/admin/categories/${id}`, updates)
    return true
  } catch (error) {
    console.error('[SkillBridge] Error updating category:', error)
    return false
  }
}

/**
 * Delete category
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/api/admin/categories/${id}`)
    return true
  } catch (error) {
    console.error('[SkillBridge] Error deleting category:', error)
    return false
  }
}

/**
 * Toggle category status (active/inactive)
 */
export const toggleCategoryStatus = async (id: string): Promise<boolean> => {
  try {
    await apiClient.patch(`/api/admin/categories/${id}/toggle-status`)
    return true
  } catch (error) {
    console.error('[SkillBridge] Error toggling category status:', error)
    return false
  }
}

/**
 * Get platform statistics
 */
export const getPlatformStats = async (): Promise<PlatformStats> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendStats>>('/api/admin/stats')
    const stats = response.data
    
    return {
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      totalTutors: stats.totalTutors,
      activeTutors: stats.activeTutors,
      totalStudents: stats.totalStudents,
      activeStudents: stats.activeStudents,
      totalBookings: stats.totalBookings,
      todayBookings: stats.todayBookings,
      weekBookings: stats.weekBookings,
      monthBookings: stats.monthBookings,
      totalRevenue: stats.totalRevenue,
      monthRevenue: stats.monthRevenue,
      platformRating: 4.8, // Default value - would need separate endpoint
      completionRate: 94, // Default value - would need separate endpoint
    }
  } catch (error) {
    console.error('[SkillBridge] Error fetching stats:', error)
    throw error
  }
}
