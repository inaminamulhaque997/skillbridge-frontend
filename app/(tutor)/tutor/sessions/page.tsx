'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  getTutorBookings, 
  formatDate, 
  formatTime, 
  updateBookingStatus,
  cancelBooking 
} from '@/services/booking'
import { Booking, BookingStatus } from '@/types/booking'
import { 
  Calendar,
  Clock,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  CalendarX,
  AlertCircle,
  List,
  CalendarDays,
  Filter,
  Download
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

type ViewMode = 'list' | 'calendar'

export default function TutorSessionsPage() {
  const { user } = useAuth()
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'completed' | 'cancelled' | 'all'>('upcoming')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)

  useEffect(() => {
    if (user) {
      const bookings = getTutorBookings(user.id)
      setAllBookings(bookings)
      filterBookings(bookings, activeTab)
    }
  }, [user])

  const filterBookings = (bookings: Booking[], status: typeof activeTab) => {
    let filtered: Booking[] = []
    
    switch (status) {
      case 'upcoming':
        filtered = bookings.filter(b => b.status === 'upcoming')
        break
      case 'pending':
        // Mock pending - in real app would be separate status
        filtered = []
        break
      case 'completed':
        filtered = bookings.filter(b => b.status === 'completed')
        break
      case 'cancelled':
        filtered = bookings.filter(b => b.status === 'cancelled')
        break
      case 'all':
        filtered = bookings
        break
    }
    
    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`)
      const dateB = new Date(`${b.date}T${b.startTime}`)
      return dateB.getTime() - dateA.getTime()
    })
    
    setFilteredBookings(filtered)
  }

  const handleTabChange = (value: string) => {
    const tab = value as typeof activeTab
    setActiveTab(tab)
    filterBookings(allBookings, tab)
    setSelectedBookings([])
  }

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
  }

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(filteredBookings.map(b => b.id))
    }
  }

  const handleConfirmBooking = (booking: Booking) => {
    updateBookingStatus(booking.id, 'upcoming')
    toast.success('Session confirmed')
    // Refresh bookings
    if (user) {
      const bookings = getTutorBookings(user.id)
      setAllBookings(bookings)
      filterBookings(bookings, activeTab)
    }
  }

  const handleDeclineBooking = (booking: Booking) => {
    setBookingToCancel(booking)
  }

  const handleCancelBooking = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel.id)
      toast.success('Session cancelled')
      setBookingToCancel(null)
      
      // Refresh bookings
      if (user) {
        const bookings = getTutorBookings(user.id)
        setAllBookings(bookings)
        filterBookings(bookings, activeTab)
      }
    }
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-3 w-3" />
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      case 'cancelled':
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const renderSessionCard = (booking: Booking) => {
    const isPending = activeTab === 'pending'
    const isUpcoming = booking.status === 'upcoming'
    const isCompleted = booking.status === 'completed'

    return (
      <Card key={booking.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Checkbox for bulk selection */}
            <Checkbox
              checked={selectedBookings.includes(booking.id)}
              onCheckedChange={() => handleSelectBooking(booking.id)}
              className="mt-1"
            />

            {/* Student Info */}
            <Avatar className="h-14 w-14">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.studentId}`} />
              <AvatarFallback>
                {booking.studentId.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Session Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{booking.studentId}</h3>
                  <p className="text-sm text-muted-foreground">{booking.subject}</p>
                </div>
                <Badge variant={getStatusColor(booking.status)} className="capitalize gap-1">
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(booking.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </div>
              </div>

              {booking.notes && (
                <div className="bg-muted/50 p-3 rounded-md mb-3">
                  <p className="text-sm text-muted-foreground italic">
                    <span className="font-medium">Student Notes:</span> {booking.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isPending && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleConfirmBooking(booking)}
                      className="gap-2"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Confirm
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeclineBooking(booking)}
                      className="gap-2"
                    >
                      <XCircle className="h-3 w-3" />
                      Decline
                    </Button>
                  </>
                )}

                {isUpcoming && (
                  <>
                    <Button size="sm" className="gap-2">
                      <Video className="h-3 w-3" />
                      Join Session
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <MessageSquare className="h-3 w-3" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setBookingToCancel(booking)}
                      className="gap-2"
                    >
                      <CalendarX className="h-3 w-3" />
                      Cancel
                    </Button>
                  </>
                )}

                {isCompleted && (
                  <>
                    <Button size="sm" variant="outline" className="gap-2">
                      <CheckCircle className="h-3 w-3" />
                      View Review
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-2">
                      <AlertCircle className="h-3 w-3" />
                      Report Issue
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold">${booking.totalPrice}</p>
              <p className="text-xs text-muted-foreground">{booking.duration} min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Session Management</h1>
          <p className="text-lg text-muted-foreground">
            Manage your tutoring sessions and bookings
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold">{allBookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold">
                {allBookings.filter(b => b.status === 'upcoming').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">
                {allBookings.filter(b => b.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>View and manage all your tutoring sessions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedBookings.length > 0 && (
                  <div className="flex items-center gap-2 mr-4">
                    <span className="text-sm text-muted-foreground">
                      {selectedBookings.length} selected
                    </span>
                    <Button size="sm" variant="outline">
                      Bulk Action
                    </Button>
                  </div>
                )}
                
                <Button size="sm" variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <div className="flex border rounded-md">
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('calendar')}
                    className="rounded-l-none"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              {viewMode === 'list' && (
                <>
                  {filteredBookings.length > 0 && (
                    <div className="mb-4">
                      <Checkbox
                        checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="mr-2"
                      />
                      <span className="text-sm text-muted-foreground">Select all</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map(booking => renderSessionCard(booking))
                    ) : (
                      <div className="text-center py-12">
                        <CalendarX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
                        <p className="text-muted-foreground">
                          {activeTab === 'pending' && 'No pending session requests at the moment'}
                          {activeTab === 'upcoming' && 'No upcoming sessions scheduled'}
                          {activeTab === 'completed' && 'No completed sessions yet'}
                          {activeTab === 'cancelled' && 'No cancelled sessions'}
                          {activeTab === 'all' && 'No sessions available'}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {viewMode === 'calendar' && (
                <div className="text-center py-12">
                  <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                  <p className="text-muted-foreground">Calendar view coming soon</p>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? This action cannot be undone and the student will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Session</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
