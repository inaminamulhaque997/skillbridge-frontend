import { apiClient } from '@/lib/api-client'

// Types for categories
export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  createdAt: string
}

// API Response types
interface ApiResponse<T> {
  success: boolean
  statusCode: number
  data: T
  message: string
}

/**
 * Get all categories (public endpoint)
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/categories')
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error fetching categories:', error)
    throw error
  }
}

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`)
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error fetching category:', error)
    throw error
  }
}

// Default categories for fallback
export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Mathematics', description: 'Algebra, Calculus, Statistics', icon: '📐', createdAt: new Date().toISOString() },
  { id: '2', name: 'Science', description: 'Physics, Chemistry, Biology', icon: '🔬', createdAt: new Date().toISOString() },
  { id: '3', name: 'Languages', description: 'English, Spanish, French, and more', icon: '🌍', createdAt: new Date().toISOString() },
  { id: '4', name: 'Programming', description: 'Web Development, Mobile Apps, Data Science', icon: '💻', createdAt: new Date().toISOString() },
  { id: '5', name: 'Music', description: 'Piano, Guitar, Voice, and more', icon: '🎵', createdAt: new Date().toISOString() },
  { id: '6', name: 'Art & Design', description: 'Drawing, Painting, Digital Art', icon: '🎨', createdAt: new Date().toISOString() },
]