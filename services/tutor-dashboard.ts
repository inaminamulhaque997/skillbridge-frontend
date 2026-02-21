import { apiClient } from '@/lib/api-client'

// Types for tutor dashboard
export interface TutorProfile {
  id: string
  userId: string
  bio: string
  hourlyRate: number
  education?: string
  experience?: string
  subjects: string[]
  languages: string[]
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface AvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface TutorSession {
  id: string
  studentId: string
  studentName: string
  studentAvatar?: string
  date: string
  startTime: string
  endTime: string
  status: string
  price: number
  notes?: string
}

export interface UpdateProfileData {
  bio?: string
  hourlyRate?: number
  education?: string
  experience?: string
  subjects?: string[]
  languages?: string[]
}

// API Response types
interface ApiResponse<T> {
  success: boolean
  statusCode: number
  data: T
  message: string
}

/**
 * Get tutor's own profile
 */
export const getMyProfile = async (): Promise<TutorProfile> => {
  try {
    const response = await apiClient.get<ApiResponse<TutorProfile>>('/api/tutor/profile')
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error fetching tutor profile:', error)
    throw error
  }
}

/**
 * Update tutor's profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<TutorProfile> => {
  try {
    const response = await apiClient.put<ApiResponse<TutorProfile>>('/api/tutor/profile', data)
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error updating tutor profile:', error)
    throw error
  }
}

/**
 * Get tutor's availability
 */
export const getMyAvailability = async (): Promise<AvailabilitySlot[]> => {
  try {
    const response = await apiClient.get<ApiResponse<AvailabilitySlot[]>>('/api/tutor/availability')
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error fetching availability:', error)
    throw error
  }
}

/**
 * Update tutor's availability
 */
export const updateAvailability = async (slots: Omit<AvailabilitySlot, 'isActive'>[]): Promise<AvailabilitySlot[]> => {
  try {
    const response = await apiClient.put<ApiResponse<AvailabilitySlot[]>>('/api/tutor/availability', { slots })
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error updating availability:', error)
    throw error
  }
}

/**
 * Get tutor's sessions/bookings
 */
export const getMySessions = async (page = 1, limit = 10): Promise<{
  sessions: TutorSession[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> => {
  try {
    const response = await apiClient.get<ApiResponse<{
      sessions: TutorSession[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>>(`/api/tutor/sessions?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error fetching sessions:', error)
    throw error
  }
}

// Helper function to get day name from day number
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayOfWeek] || ''
}

// Helper function to format time slot
export const formatTimeSlot = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`
}