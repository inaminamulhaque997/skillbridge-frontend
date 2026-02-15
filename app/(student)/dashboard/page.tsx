'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStudentBookings, getBookingsByStatus, formatDate, formatTime, getTimeUntilBooking, isToday } from '@/services/booking'
import { Booking } from '@/types/booking'
import { Calendar, Clock, BookOpen, TrendingUp, ArrowRight, Video, MessageSquare } from 'lucide-react'

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [nextSession, setNextSession] = useState<Booking | null>(null)

  useEffect(() => {
    if (user) {
      const bookings = getStudentBookings(user.id)
      const upcoming = getBookingsByStatus(user.id, 'upcoming')
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`)
          const dateB = new Date(`${b.date}T${b.startTime}`)
          return dateA.getTime() - dateB.getTime()
        })
      
      setAllBookings(bookings)
      setUpcomingBookings(upcoming.slice(0, 3))
      setNextSession(upcoming[0] || null)
    }
  }, [user])

  const completedCount = allBookings.filter(b => b.status === 'completed').length
  const totalHours = allBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.duration / 60, 0)
  
  const uniqueTutors = new Set(allBookings.map(b => b.tutorId)).size

  return (
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's your learning overview
          </p>
        </div>

        {/* Next Session Countdown */}
        {nextSession && isToday(nextSession.date) && (
          <Card className="mb-6 border-primary bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Your next session is today!</p>
                    <p className="text-muted-foreground">
                      {nextSession.subject} with {nextSession.tutorName} at {formatTime(nextSession.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {getTimeUntilBooking(nextSession.date, nextSession.startTime)}
                    </p>
                    <p className="text-sm text-muted-foreground">until start</p>
                  </div>
                  <Button size="lg" className="ml-4">
                    <Video className="mr-2 h-4 w-4" />
                    Join Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingBookings.length === 1 ? 'Session' : 'Sessions'} scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalHours.toFixed(1)} hours learned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tutors</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueTutors}</div>
              <p className="text-xs text-muted-foreground">In different subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {nextSession ? (
                <>
                  <div className="text-2xl font-bold">
                    {isToday(nextSession.date) ? 'Today' : formatDate(nextSession.date).split(',')[0]}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    at {formatTime(nextSession.startTime)}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">None</div>
                  <p className="text-xs text-muted-foreground">No upcoming sessions</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>Your scheduled tutoring sessions</CardDescription>
                </div>
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                          <AvatarFallback>
                            {booking.tutorName.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{booking.tutorName}</p>
                          <p className="text-sm text-muted-foreground">{booking.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {isToday(booking.date) ? 'Today' : formatDate(booking.date)} at{' '}
                            {formatTime(booking.startTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="capitalize">
                          {booking.status}
                        </Badge>
                        {isToday(booking.date) && (
                          <Button size="sm">
                            <Video className="mr-2 h-3 w-3" />
                            Join
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                    <Link href="/browse">
                      <Button>Find a Tutor</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* My Tutors & Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Favorite Tutors</CardTitle>
                <CardDescription>Your most booked tutors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {uniqueTutors > 0 ? (
                  Array.from(new Set(allBookings.map((b) => b.tutorId)))
                    .slice(0, 3)
                    .map((tutorId) => {
                      const booking = allBookings.find((b) => b.tutorId === tutorId)!
                      return (
                        <div key={tutorId} className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                            <AvatarFallback>
                              {booking.tutorName.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{booking.tutorName}</p>
                            <p className="text-xs text-muted-foreground">{booking.subject}</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No tutors yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/browse">
                  <Button className="w-full" variant="outline">
                    Find a Tutor
                  </Button>
                </Link>
                <Link href="/dashboard/bookings">
                  <Button className="w-full" variant="outline">
                    View All Bookings
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button className="w-full" variant="outline">
                    Edit Profile
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
