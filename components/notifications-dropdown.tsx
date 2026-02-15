'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  formatNotificationTime
} from '@/services/notifications'
import { Notification } from '@/types/notification'
import {
  Bell,
  Calendar,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  X,
  Trash2
} from 'lucide-react'

export function NotificationsDropdown() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  const loadNotifications = () => {
    if (!user) return
    
    const notifs = getNotifications(user.id)
    setNotifications(notifs.slice(0, 10)) // Show last 10
    setUnreadCount(getUnreadCount(user.id))
  }

  const handleMarkAsRead = (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (user) {
      markAsRead(user.id, notificationId)
      loadNotifications()
    }
  }

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id)
      loadNotifications()
    }
  }

  const handleDelete = (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (user) {
      deleteNotification(user.id, notificationId)
      loadNotifications()
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking_request':
      case 'booking_confirmed':
      case 'booking_cancelled':
        return <Calendar className="h-4 w-4" />
      case 'message':
        return <MessageSquare className="h-4 w-4" />
      case 'review':
        return <Star className="h-4 w-4" />
      case 'system':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'booking_request':
        return 'text-blue-600 bg-blue-100'
      case 'booking_confirmed':
        return 'text-green-600 bg-green-100'
      case 'booking_cancelled':
        return 'text-red-600 bg-red-100'
      case 'message':
        return 'text-purple-600 bg-purple-100'
      case 'review':
        return 'text-yellow-600 bg-yellow-100'
      case 'system':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (!user) return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-0 text-xs text-primary hover:text-primary/80"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length > 0 ? (
          <DropdownMenuGroup className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0"
                onSelect={(e) => {
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl
                  }
                }}
              >
                <div
                  className={`flex gap-3 p-3 w-full ${
                    !notification.read ? 'bg-accent/50' : ''
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="text-primary hover:text-primary/80 flex-shrink-0"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatNotificationTime(notification.timestamp)}
                      </span>
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ) : (
          <div className="py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
              <Link href="/notifications" className="text-sm text-primary font-medium">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
