import { Notification, NotificationType } from '@/types/notification'

const NOTIFICATIONS_KEY = 'skillbridge_notifications'

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking_request',
    title: 'New Booking Request',
    message: 'Sarah Johnson wants to book a session for Mathematics',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    read: false,
    actionUrl: '/tutor/sessions',
    metadata: { bookingId: 'booking-1' }
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Michael Chen sent you a message',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
    actionUrl: '/messages',
    metadata: { userId: 'user-2' }
  },
  {
    id: '3',
    type: 'review',
    title: 'New Review',
    message: 'Emma Davis left you a 5-star review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    actionUrl: '/tutor/reviews'
  },
  {
    id: '4',
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: 'Your session with Alex Thompson is confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    actionUrl: '/tutor/sessions'
  },
  {
    id: '5',
    type: 'system',
    title: 'Platform Update',
    message: 'New features available: Video recording and session notes',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true
  }
]

// Get all notifications for a user
export const getNotifications = (userId: string): Notification[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userId}`)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return mockNotifications
    }
  }
  
  // Initialize with mock notifications
  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(mockNotifications))
  return mockNotifications
}

// Get unread notification count
export const getUnreadCount = (userId: string): number => {
  const notifications = getNotifications(userId)
  return notifications.filter(n => !n.read).length
}

// Mark notification as read
export const markAsRead = (userId: string, notificationId: string): void => {
  const notifications = getNotifications(userId)
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  )
  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(updated))
}

// Mark all notifications as read
export const markAllAsRead = (userId: string): void => {
  const notifications = getNotifications(userId)
  const updated = notifications.map(n => ({ ...n, read: true }))
  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(updated))
}

// Delete a notification
export const deleteNotification = (userId: string, notificationId: string): void => {
  const notifications = getNotifications(userId)
  const updated = notifications.filter(n => n.id !== notificationId)
  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(updated))
}

// Add a new notification
export const addNotification = (userId: string, notification: Omit<Notification, 'id'>): void => {
  const notifications = getNotifications(userId)
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substr(2, 9)
  }
  const updated = [newNotification, ...notifications]
  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(updated))
}

// Format timestamp for display
export const formatNotificationTime = (timestamp: string): string => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now.getTime() - time.getTime()
  
  const minutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return time.toLocaleDateString()
}
