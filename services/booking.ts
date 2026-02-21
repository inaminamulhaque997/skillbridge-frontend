import { apiClient } from '@/lib/api-client'
import type { Booking, CreateBookingData, BookingReview, BookingStatus } from '@/types/booking'
import { getStoredUser } from './auth'

// API Response types
interface ApiResponse<T> {
  success: boolean
  statusCode: number
  data: T
  message: string
}

// Backend booking type
interface BackendBooking {
  id: string
  studentId: string
  tutorId: string
  date: string
  startTime: string
  endTime: string
  status: string
  price: number
  notes?: string
  createdAt: string
  updatedAt: string
  student?: {
    id: string
    name: string
    avatar?: string
  }
  tutor?: {
    id: string
    name: string
    avatar?: string
  }
}

// Map backend booking to frontend format
const mapBackendBooking = (booking: BackendBooking): Booking => {
  return {
    id: booking.id,
    studentId: booking.studentId,
    tutorId: booking.tutorId,
    tutorName: booking.tutor?.name || 'Unknown Tutor',
    tutorAvatar: booking.tutor?.avatar,
    subject: '', // Will be populated from tutor subjects if needed
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    duration: 60, // Default duration
    hourlyRate: Number(booking.price),
    totalPrice: Number(booking.price),
    status: booking.status.toLowerCase() as BookingStatus,
    notes: booking.notes,
    meetingLink: undefined,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }
}

/**
 * Get all bookings for current user (student or tutor)
 */
export const getBookings = async (): Promise<Booking[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ bookings: BackendBooking[], pagination: { page: number, limit: number, total: number, totalPages: number } }>>('/api/bookings')
    return response.data.bookings.map(mapBackendBooking)
  } catch (error) {
    console.error('[SkillBridge] Error fetching bookings:', error)
    throw error
  }
}

/**
 * Get bookings by student ID
 */
export const getStudentBookings = async (studentId: string): Promise<Booking[]> => {
  // The backend handles filtering by role, just call the endpoint
  return getBookings()
}

/**
 * Get bookings by tutor ID
 */
export const getTutorBookings = async (tutorId: string): Promise<Booking[]> => {
  // The backend handles filtering by role, just call the endpoint
  return getBookings()
}

/**
 * Get bookings by status
 */
export const getBookingsByStatus = async (
  userId: string,
  status: BookingStatus,
  userType: 'student' | 'tutor' = 'student'
): Promise<Booking[]> => {
  const bookings = await getBookings()
  return bookings.filter((booking) => booking.status === status)
}

/**
 * Create a new booking
 */
export const createBooking = async (
  data: CreateBookingData
): Promise<Booking> => {
  try {
    // Convert startTime to 24-hour format if needed
    const startTime24 = convertTo24HourFormat(data.startTime)
    
    // Calculate endTime from startTime and duration
    const endTime = calculateEndTime(startTime24, data.duration)
    
    const response = await apiClient.post<ApiResponse<BackendBooking>>('/api/bookings', {
      tutorId: data.tutorId,
      date: data.date,
      startTime: startTime24,
      endTime: endTime,
      notes: data.notes,
    })

    return mapBackendBooking(response.data)
  } catch (error) {
    console.error('[SkillBridge] Error creating booking:', error)
    throw error
  }
}

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    await apiClient.patch(`/api/bookings/${bookingId}/cancel`)
  } catch (error) {
    console.error('[SkillBridge] Error cancelling booking:', error)
    throw error
  }
}

/**
 * Update booking status (for tutors to accept/reject bookings)
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
): Promise<Booking> => {
  try {
    const response = await apiClient.patch<ApiResponse<BackendBooking>>(
      `/api/bookings/${bookingId}/status`,
      { status }
    )
    return mapBackendBooking(response.data)
  } catch (error) {
    console.error('[SkillBridge] Error updating booking status:', error)
    throw error
  }
}

/**
 * Submit a review for a booking
 */
export const submitReview = async (
  bookingId: string,
  rating: number,
  comment?: string,
  isAnonymous: boolean = false
): Promise<BookingReview> => {
  try {
    const response = await apiClient.post<ApiResponse<BookingReview>>('/api/reviews', {
      bookingId,
      rating,
      comment,
      isAnonymous,
    })
    return response.data
  } catch (error) {
    console.error('[SkillBridge] Error submitting review:', error)
    throw error
  }
}

/**
 * Check if booking has been reviewed
 */
export const hasReviewed = async (bookingId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<ApiResponse<{ exists: boolean }>>(
      `/api/reviews/booking/${bookingId}`
    )
    return response.data.exists
  } catch {
    return false
  }
}

// Convert 12-hour time format (e.g., "09:00 AM") to 24-hour format (e.g., "09:00")
const convertTo24HourFormat = (time: string): string => {
  // If already in 24-hour format (HH:mm), return as is
  if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return time
  }
  
  // Parse 12-hour format (e.g., "09:00 AM" or "02:30 PM")
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) {
    // If it doesn't match expected formats, try to extract just the time part
    const timeOnly = time.replace(/\s*(AM|PM)$/i, '')
    if (/^\d{1,2}:\d{2}$/.test(timeOnly)) {
      return timeOnly
    }
    return time // Return as is if we can't parse
  }
  
  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const period = match[3].toUpperCase()
  
  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

// Helper functions (still useful for formatting)
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + durationMinutes
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export const formatDate = (date: string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const isToday = (date: string): boolean => {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

export const getTimeUntilBooking = (date: string, startTime: string): string => {
  const bookingDateTime = new Date(`${date}T${startTime}:00`)
  const now = new Date()
  const diff = bookingDateTime.getTime() - now.getTime()

  if (diff < 0) return 'Past'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours < 1) return `in ${minutes}m`
  if (hours < 24) return `in ${hours}h ${minutes}m`

  const days = Math.floor(hours / 24)
  return `in ${days}d`
}

// Keep mock functions for backward compatibility during transition
export const mockCreateBooking = createBooking
export const mockCancelBooking = cancelBooking
export const mockSubmitReview = async (review: Omit<BookingReview, 'id' | 'createdAt'>): Promise<BookingReview> => {
  return submitReview(review.bookingId, review.rating, review.comment, review.isAnonymous)
}
