export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'upcoming'

export interface Booking {
  id: string
  studentId: string
  tutorId: string
  tutorName: string
  tutorAvatar?: string
  subject: string
  date: string // ISO date string
  startTime: string // e.g., "14:00"
  endTime: string // e.g., "15:00"
  duration: number // in minutes
  hourlyRate: number
  totalPrice: number
  status: BookingStatus
  notes?: string
  meetingLink?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingData {
  tutorId: string
  date: string
  startTime: string
  duration: number
  subject: string
  notes?: string
}

export interface BookingReview {
  id: string
  bookingId: string
  studentId: string
  tutorId: string
  rating: number
  comment: string
  isAnonymous: boolean
  createdAt: string
}
