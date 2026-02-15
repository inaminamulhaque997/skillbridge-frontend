import { Booking, CreateBookingData, BookingReview, BookingStatus } from '@/types/booking'

const BOOKINGS_STORAGE_KEY = 'skillbridge_bookings'
const REVIEWS_STORAGE_KEY = 'skillbridge_reviews'

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    studentId: 'student-1',
    tutorId: '1',
    tutorName: 'Sarah Chen',
    tutorAvatar: '/placeholder.svg?height=80&width=80',
    subject: 'Programming',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    hourlyRate: 45,
    totalPrice: 67.5,
    status: 'upcoming',
    notes: 'Need help with React components and state management',
    meetingLink: 'https://meet.skillbridge.com/session-1',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'booking-2',
    studentId: 'student-1',
    tutorId: '3',
    tutorName: 'Emily Watson',
    tutorAvatar: '/placeholder.svg?height=80&width=80',
    subject: 'Mathematics',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
    startTime: '10:00',
    endTime: '11:00',
    duration: 60,
    hourlyRate: 35,
    totalPrice: 35,
    status: 'completed',
    notes: 'Calculus tutoring',
    meetingLink: 'https://meet.skillbridge.com/session-2',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'booking-3',
    studentId: 'student-1',
    tutorId: '2',
    tutorName: 'Michael Rodriguez',
    tutorAvatar: '/placeholder.svg?height=80&width=80',
    subject: 'Design',
    date: new Date(Date.now() - 432000000).toISOString().split('T')[0], // 5 days ago
    startTime: '16:00',
    endTime: '17:00',
    duration: 60,
    hourlyRate: 40,
    totalPrice: 40,
    status: 'cancelled',
    notes: 'UI/UX principles',
    createdAt: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
]

// Initialize mock data in localStorage
const initializeMockData = () => {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem(BOOKINGS_STORAGE_KEY)) {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(mockBookings))
  }
  if (!localStorage.getItem(REVIEWS_STORAGE_KEY)) {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify([]))
  }
}

// Get all bookings
const getBookings = (): Booking[] => {
  if (typeof window === 'undefined') return []
  
  initializeMockData()
  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Get bookings by student ID
export const getStudentBookings = (studentId: string): Booking[] => {
  return getBookings().filter((booking) => booking.studentId === studentId)
}

// Get bookings by tutor ID
export const getTutorBookings = (tutorId: string): Booking[] => {
  return getBookings().filter((booking) => booking.tutorId === tutorId)
}

// Get bookings by status
export const getBookingsByStatus = (
  userId: string,
  status: BookingStatus,
  userType: 'student' | 'tutor' = 'student'
): Booking[] => {
  const bookings = userType === 'tutor' ? getTutorBookings(userId) : getStudentBookings(userId)
  return bookings.filter((booking) => booking.status === status)
}

// Create a new booking
export const mockCreateBooking = async (
  data: CreateBookingData,
  studentId: string
): Promise<Booking> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const bookings = getBookings()
  
  const endTime = calculateEndTime(data.startTime, data.duration)
  const hourlyRate = 45 // Would come from tutor data
  const totalPrice = (hourlyRate / 60) * data.duration

  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    studentId,
    tutorId: data.tutorId,
    tutorName: 'Tutor Name', // Would come from tutor data
    subject: data.subject,
    date: data.date,
    startTime: data.startTime,
    endTime,
    duration: data.duration,
    hourlyRate,
    totalPrice,
    status: 'upcoming',
    notes: data.notes,
    meetingLink: `https://meet.skillbridge.com/session-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  bookings.push(newBooking)
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))

  return newBooking
}

// Cancel a booking
export const mockCancelBooking = async (bookingId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const bookings = getBookings()
  const index = bookings.findIndex((b) => b.id === bookingId)

  if (index === -1) {
    throw new Error('Booking not found')
  }

  bookings[index].status = 'cancelled'
  bookings[index].updatedAt = new Date().toISOString()

  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
}

// Submit a review
export const mockSubmitReview = async (
  review: Omit<BookingReview, 'id' | 'createdAt'>
): Promise<BookingReview> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const reviews = getReviews()

  const newReview: BookingReview = {
    ...review,
    id: `review-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  reviews.push(newReview)
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))

  // Mark booking as reviewed
  const bookings = getBookings()
  const bookingIndex = bookings.findIndex((b) => b.id === review.bookingId)
  if (bookingIndex !== -1) {
    bookings[bookingIndex].updatedAt = new Date().toISOString()
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
  }

  return newReview
}

// Get reviews
const getReviews = (): BookingReview[] => {
  if (typeof window === 'undefined') return []
  
  initializeMockData()
  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Check if booking has been reviewed
export const hasReviewed = (bookingId: string): boolean => {
  const reviews = getReviews()
  return reviews.some((review) => review.bookingId === bookingId)
}

// Helper function to calculate end time
const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + duration
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

// Format time for display
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Format date for display
export const formatDate = (date: string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Check if booking is today
export const isToday = (date: string): boolean => {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

// Get time until booking
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
