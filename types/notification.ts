export type NotificationType = 
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'message'
  | 'review'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  metadata?: {
    bookingId?: string
    userId?: string
    [key: string]: any
  }
}
