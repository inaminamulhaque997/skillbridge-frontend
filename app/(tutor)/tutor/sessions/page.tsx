'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTutorBookings, formatDate, formatTime, updateBookingStatus } from '@/services/booking'
import { Booking } from '@/types/booking'
import { Calendar, Clock, Video, Users, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function TutorSessionsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  const fetchBookings = async () => {
    if (!user) return
    
    try {
      const data = await getTutorBookings(user.id)
      setBookings(data)
    } catch (error) {
      console.error('[SkillBridge] Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  // Map backend status to display status
  const getDisplayStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'pending',
      'confirmed': 'upcoming',
      'completed': 'completed',
      'cancelled': 'cancelled',
    }
    return statusMap[status.toLowerCase()] || status
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed')
  const completedBookings = bookings.filter(b => b.status === 'completed')
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'CONFIRMED')
      toast.success('Booking confirmed!', {
        description: 'The session has been added to your schedule.',
      })
      fetchBookings() // Refresh the list
    } catch (error) {
      toast.error('Failed to confirm booking', {
        description: 'Please try again.',
      })
    }
  }

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'CANCELLED')
      toast.success('Booking rejected', {
        description: 'The booking has been cancelled.',
      })
      fetchBookings() // Refresh the list
    } catch (error) {
      toast.error('Failed to reject booking', {
        description: 'Please try again.',
      })
    }
  }

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'COMPLETED')
      toast.success('Session marked as completed!')
      fetchBookings()
    } catch (error) {
      toast.error('Failed to update booking')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500">Pending</Badge>
      case 'confirmed':
      case 'upcoming':
        return <Badge variant="default" className="bg-blue-500">Confirmed</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Sessions</h1>
          <p className="text-lg text-muted-foreground">
            Manage your tutoring sessions
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedBookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledBookings.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Tabs */}
        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="relative">
              Pending ({pendingBookings.length})
              {pendingBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <SessionsList 
              bookings={pendingBookings} 
              getStatusBadge={getStatusBadge} 
              showActions={true}
              onAccept={handleAcceptBooking}
              onReject={handleRejectBooking}
            />
          </TabsContent>
          <TabsContent value="upcoming">
            <SessionsList 
              bookings={upcomingBookings} 
              getStatusBadge={getStatusBadge}
              showCompleteButton={true}
              onComplete={handleCompleteBooking}
            />
          </TabsContent>
          <TabsContent value="completed">
            <SessionsList bookings={completedBookings} getStatusBadge={getStatusBadge} />
          </TabsContent>
          <TabsContent value="cancelled">
            <SessionsList bookings={cancelledBookings} getStatusBadge={getStatusBadge} />
          </TabsContent>
          <TabsContent value="all">
            <SessionsList bookings={bookings} getStatusBadge={getStatusBadge} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface SessionsListProps {
  bookings: Booking[]
  getStatusBadge: (status: string) => React.ReactNode
  showActions?: boolean
  showCompleteButton?: boolean
  onAccept?: (bookingId: string) => Promise<void>
  onReject?: (bookingId: string) => Promise<void>
  onComplete?: (bookingId: string) => Promise<void>
}

function SessionsList({ 
  bookings, 
  getStatusBadge, 
  showActions = false,
  showCompleteButton = false,
  onAccept,
  onReject,
  onComplete
}: SessionsListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAction = async (action: 'accept' | 'reject' | 'complete', bookingId: string) => {
    setProcessingId(bookingId)
    try {
      if (action === 'accept' && onAccept) {
        await onAccept(bookingId)
      } else if (action === 'reject' && onReject) {
        await onReject(bookingId)
      } else if (action === 'complete' && onComplete) {
        await onComplete(bookingId)
      }
    } finally {
      setProcessingId(null)
    }
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No sessions found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className={showActions ? 'border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-950/10' : ''}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                  <span className="text-xs font-medium">{formatTime(booking.startTime)}</span>
                  <span className="text-[10px]">{booking.duration}min</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{booking.subject || 'Tutoring Session'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.date)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Student ID: {booking.studentId}
                  </p>
                  {booking.notes && (
                    <p className="text-sm text-muted-foreground mt-1 italic">"{booking.notes}"</p>
                  )}
                  <p className="text-sm font-medium mt-1">
                    Price: ${booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(booking.status)}
                {showActions && booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleAction('accept', booking.id)}
                      disabled={processingId === booking.id}
                    >
                      {processingId === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleAction('reject', booking.id)}
                      disabled={processingId === booking.id}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
                {showCompleteButton && booking.status === 'confirmed' && (
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleAction('complete', booking.id)}
                    disabled={processingId === booking.id}
                  >
                    {processingId === booking.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Complete
                  </Button>
                )}
                {booking.status === 'confirmed' && !showCompleteButton && (
                  <Button size="sm">
                    <Video className="mr-2 h-3 w-3" />
                    Start Session
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}