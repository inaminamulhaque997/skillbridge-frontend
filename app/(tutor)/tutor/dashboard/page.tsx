'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getTutorBookings, getBookingsByStatus, formatDate, formatTime, isToday } from '@/services/booking'
import { Booking } from '@/types/booking'
import { 
  DollarSign, 
  Users, 
  Star, 
  Calendar,
  TrendingUp,
  Clock,
  Video,
  Settings,
  BarChart3,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function TutorDashboardPage() {
  const { user } = useAuth()
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [todayBookings, setTodayBookings] = useState<Booking[]>([])
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [pendingRequests, setPendingRequests] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return
      
      try {
        const bookings = await getTutorBookings(user.id)
        const today = new Date().toISOString().split('T')[0]
        const todaySessions = bookings.filter(b => b.date === today && b.status === 'upcoming')
        const upcoming = bookings.filter(b => b.status === 'upcoming')
        
        setAllBookings(bookings)
        setTodayBookings(todaySessions)
        setUpcomingBookings(upcoming.slice(0, 5))
        // Mock pending requests - in real app would be separate status
        setPendingRequests([])
      } catch (error) {
        console.error('[SkillBridge] Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

  // Calculate statistics
  const completedBookings = allBookings.filter(b => b.status === 'completed')
  const thisMonthBookings = completedBookings.filter(b => {
    const bookingDate = new Date(b.date)
    const now = new Date()
    return bookingDate.getMonth() === now.getMonth() && 
           bookingDate.getFullYear() === now.getFullYear()
  })

  const monthlyEarnings = thisMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const uniqueStudents = new Set(allBookings.map(b => b.studentId)).size
  const averageRating = 4.9 // Mock - would come from reviews
  const responseRate = 98 // Mock percentage

  // Weekly bookings data for chart
  const weeklyBookings = [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 6 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 7 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 2 },
  ]

  const maxBookings = Math.max(...weeklyBookings.map(d => d.count))

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Earnings */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'Tutor'}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Here's your teaching overview and performance
              </p>
            </div>
            <Card className="md:w-64">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-primary">${totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${monthlyEarnings.toFixed(2)} this month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayBookings.length} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueStudents}</div>
              <p className="text-xs text-muted-foreground">Unique students taught</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-1">
                {averageRating}
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-xs text-muted-foreground">Based on 89 reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responseRate}%</div>
              <Progress value={responseRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your tutoring sessions for today</CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  {todayBookings.length} sessions
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayBookings.length > 0 ? (
                  todayBookings.map((booking) => {
                    const startTime = new Date(`${booking.date}T${booking.startTime}`)
                    const isPast = startTime < new Date()
                    
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                            <span className="text-xs font-medium">{formatTime(booking.startTime)}</span>
                            <span className="text-[10px]">{booking.duration}min</span>
                          </div>
                          <div>
                            <p className="font-semibold">{booking.studentId}</p>
                            <p className="text-sm text-muted-foreground">{booking.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={isPast ? 'secondary' : 'default'} className="capitalize">
                            {isPast ? 'completed' : 'upcoming'}
                          </Badge>
                          {!isPast && (
                            <Button size="sm">
                              <Video className="mr-2 h-3 w-3" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No sessions scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Bookings Chart */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your session bookings this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyBookings.map((day) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-muted-foreground">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="h-8 bg-secondary rounded-md overflow-hidden">
                          <div
                            className="h-full bg-primary flex items-center justify-end pr-2 text-xs font-medium text-primary-foreground transition-all"
                            style={{ width: `${(day.count / maxBookings) * 100}%` }}
                          >
                            {day.count > 0 && day.count}
                          </div>
                        </div>
                      </div>
                      <div className="w-8 text-sm text-muted-foreground text-right">
                        {day.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>What your students are saying</CardDescription>
                </div>
                <Link href="/tutor/reviews">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    student: 'Alex Thompson',
                    rating: 5,
                    comment: 'Excellent tutor! Very patient and explains concepts clearly.',
                    date: '2 days ago',
                  },
                  {
                    student: 'Emma Davis',
                    rating: 5,
                    comment: 'Best math tutor I have ever had. Highly recommend!',
                    date: '1 week ago',
                  },
                  {
                    student: 'Michael Kim',
                    rating: 4,
                    comment: 'Great explanations and always well-prepared for sessions.',
                    date: '1 week ago',
                  },
                ].map((review, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{review.student}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Session Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Session Requests</CardTitle>
                <CardDescription>Pending confirmations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="space-y-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {request.studentId.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{request.studentId}</p>
                          <p className="text-xs text-muted-foreground">{request.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(request.date)} at {formatTime(request.startTime)}
                          </p>
                          {request.notes && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              "{request.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <CheckCircle className="mr-2 h-3 w-3" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <XCircle className="mr-2 h-3 w-3" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No pending requests</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/tutor/availability">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Update Availability
                  </Button>
                </Link>
                <Link href="/tutor/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/tutor/analytics">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
