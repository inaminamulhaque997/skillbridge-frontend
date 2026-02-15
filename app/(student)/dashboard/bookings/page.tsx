'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReviewModal } from '@/components/review-modal'
import {
  getBookingsByStatus,
  formatDate,
  formatTime,
  mockCancelBooking,
  hasReviewed,
  isToday,
} from '@/services/booking'
import { Booking } from '@/types/booking'
import {
  Calendar,
  Clock,
  Video,
  XCircle,
  Star,
  BookOpen,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function BookingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming')
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([])
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([])
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const loadBookings = () => {
    if (user) {
      setUpcomingBookings(getBookingsByStatus(user.id, 'upcoming'))
      setCompletedBookings(getBookingsByStatus(user.id, 'completed'))
      setCancelledBookings(getBookingsByStatus(user.id, 'cancelled'))
    }
  }

  useEffect(() => {
    loadBookings()
  }, [user])

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return

    setIsCancelling(true)

    try {
      await mockCancelBooking(bookingToCancel)
      toast.success('Booking cancelled', {
        description: 'Your booking has been cancelled successfully.',
      })
      loadBookings()
      setCancelModalOpen(false)
      setBookingToCancel(null)
    } catch (error) {
      toast.error('Failed to cancel booking', {
        description: 'Please try again or contact support.',
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const openReviewModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setReviewModalOpen(true)
  }

  const openCancelModal = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setCancelModalOpen(true)
  }

  const renderBookingCard = (booking: Booking, showActions: boolean = true) => {
    const canReview = booking.status === 'completed' && !hasReviewed(booking.id)
    const canJoin = booking.status === 'upcoming' && isToday(booking.date)

    return (
      <Card key={booking.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tutor Info */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-16 w-16">
                <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                <AvatarFallback className="text-lg">
                  {booking.tutorName.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{booking.tutorName}</h3>
                  <Badge variant={
                    booking.status === 'upcoming' ? 'default' :
                    booking.status === 'completed' ? 'secondary' :
                    'destructive'
                  } className="capitalize">
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-primary mb-2">{booking.subject}</p>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)} ({booking.duration} min)
                    </span>
                  </div>
                </div>
                {booking.notes && (
                  <div className="mt-2 p-2 bg-secondary/30 rounded text-sm">
                    <p className="text-muted-foreground">
                      <strong>Notes:</strong> {booking.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex flex-col gap-2 sm:min-w-[140px]">
                <div className="text-right mb-2">
                  <p className="text-2xl font-bold">${booking.totalPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Total price</p>
                </div>

                {booking.status === 'upcoming' && (
                  <>
                    {canJoin && (
                      <Button className="w-full">
                        <Video className="mr-2 h-4 w-4" />
                        Join Session
                      </Button>
                    )}
                    <Button variant="outline" className="w-full" disabled>
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => openCancelModal(booking.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}

                {booking.status === 'completed' && canReview && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openReviewModal(booking)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Leave Review
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your tutoring sessions
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Past ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => renderBookingCard(booking))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming sessions</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    You don't have any scheduled sessions. Find a tutor and book your first
                    session!
                  </p>
                  <Button onClick={() => window.location.href = '/browse'}>
                    Browse Tutors
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Tab */}
          <TabsContent value="past" className="space-y-4">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => renderBookingCard(booking))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No completed sessions</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Your completed sessions will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cancelled Tab */}
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length > 0 ? (
              cancelledBookings.map((booking) => renderBookingCard(booking, false))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No cancelled sessions</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You haven't cancelled any sessions.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Modal */}
        {selectedBooking && (
          <ReviewModal
            open={reviewModalOpen}
            onOpenChange={setReviewModalOpen}
            bookingId={selectedBooking.id}
            studentId={user?.id || ''}
            tutorId={selectedBooking.tutorId}
            tutorName={selectedBooking.tutorName}
            onReviewSubmitted={loadBookings}
          />
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Cancel Booking?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone
                and may incur cancellation fees depending on the timing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCancelling}>
                Keep Booking
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
