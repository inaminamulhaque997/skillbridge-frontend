import { apiClient } from '@/lib/api-client'

// Types matching the backend
export interface Tutor {
  id: string
  name: string
  avatar?: string
  initials: string
  subjects: string[]
  rating: number
  reviews: number
  hourlyRate: number
  bio: string
  verified: boolean
  availability: string[]
  experience: string
}

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

// API Response types
interface ApiResponse<T> {
  success: boolean
  statusCode: number
  data: T
  message: string
}

interface TutorListItem {
  id: string
  name: string
  avatar?: string
  role: string
  tutorProfile: {
    id: string
    bio: string
    hourlyRate: string | number
    education?: string
    experience?: string
    subjects: string[]
    languages: string[]
  }
  averageRating?: number
  totalReviews?: number
}

interface TutorWithProfile extends TutorProfile {
  averageRating?: number
  totalReviews?: number
}

/**
 * Get all tutors
 */
export const getTutors = async (): Promise<Tutor[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ tutors: TutorListItem[] }>>('/api/tutors')
    
    // Map backend response to frontend format
    return response.data.tutors.map((tutor) => ({
      id: tutor.id,
      name: tutor.name,
      avatar: tutor.avatar,
      initials: tutor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      subjects: tutor.tutorProfile?.subjects || [],
      rating: tutor.averageRating || 0,
      reviews: tutor.totalReviews || 0,
      hourlyRate: Number(tutor.tutorProfile?.hourlyRate || 0),
      bio: tutor.tutorProfile?.bio || '',
      verified: true,
      availability: [],
      experience: tutor.tutorProfile?.experience || '',
    }))
  } catch (error) {
    console.error('[SkillBridge] Error fetching tutors:', error)
    throw error
  }
}

/**
 * Get tutor by ID
 */
export const getTutorById = async (id: string): Promise<TutorProfile> => {
  try {
    const response = await apiClient.get<ApiResponse<TutorWithProfile>>(`/api/tutors/${id}`)
    const tutor = response.data
    
    return {
      id: tutor.id,
      userId: tutor.userId,
      bio: tutor.bio,
      hourlyRate: Number(tutor.hourlyRate),
      education: tutor.education,
      experience: tutor.experience,
      subjects: tutor.subjects,
      languages: tutor.languages,
      user: tutor.user,
    }
  } catch (error) {
    console.error('[SkillBridge] Error fetching tutor:', error)
    throw error
  }
}

/**
 * Get tutor availability
 */
export const getTutorAvailability = async (tutorId: string): Promise<{ dayOfWeek: number; startTime: string; endTime: string }[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ dayOfWeek: number; startTime: string; endTime: string }[]>>(
      `/api/tutors/${tutorId}/availability`
    )
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error fetching availability:', error)
    throw error
  }
}
