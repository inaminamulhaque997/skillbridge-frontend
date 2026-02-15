'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/star-rating'
import { useAuth } from '@/contexts/auth-context'
import { sampleTutorProfile } from '@/data/tutor-profile'
import {
  Star,
  CheckCircle2,
  Users,
  Clock,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  BookOpen,
  Globe,
  GraduationCap,
} from 'lucide-react'

export default function TutorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [showFullBio, setShowFullBio] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [duration, setDuration] = useState(1)
  const [weekOffset, setWeekOffset] = useState(0)
  const [visibleReviews, setVisibleReviews] = useState(3)

  // In a real app, fetch tutor by ID from params.id
  const tutor = sampleTutorProfile

  const currentWeekAvailability = tutor.availability.slice(
    weekOffset * 7,
    weekOffset * 7 + 7
  )

  const handleTimeSlotClick = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const calculateTotal = () => {
    return tutor.hourlyRate * duration
  }

  const handleBookSession = () => {
    if (!isAuthenticated) {
      alert('Please login as a student to book a session.')
      router.push('/login')
      return
    }

    if (user?.role !== 'student') {
      alert('Only students can book sessions.')
      return
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time slot.')
      return
    }

    alert(
      `Booking session with ${tutor.name} on ${selectedDate} at ${selectedTime} for ${duration} hour(s). Total: $${calculateTotal()}`
    )
  }

  const handleMessageTutor = () => {
    if (!isAuthenticated) {
      alert('Please login to message this tutor.')
      router.push('/login')
      return
    }
    alert('Message feature coming soon!')
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = tutor.reviews.filter((r) => Math.floor(r.rating) === stars).length
    const percentage = (count / tutor.reviews.length) * 100
    return { stars, count, percentage }
  })

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Header */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20">
                    <AvatarImage src={tutor.avatar} alt={tutor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {tutor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{tutor.name}</h1>
                      {tutor.verified && (
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-3">{tutor.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{tutor.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{tutor.totalReviews}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{tutor.studentsTaught}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Students</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold">{tutor.responseTime}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {showFullBio
                      ? tutor.fullBio
                      : tutor.fullBio.slice(0, 300) + '...'}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-primary p-0 h-auto"
                  >
                    {showFullBio ? 'Read less' : 'Read more'}
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Languages</p>
                      <p className="text-sm text-muted-foreground">
                        {tutor.languages.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Education</p>
                      <p className="text-sm text-muted-foreground">{tutor.education}</p>
                    </div>
                  </div>
                </div>

                {tutor.certifications.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <p className="font-medium">Certifications</p>
                    </div>
                    <ul className="space-y-2">
                      {tutor.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Introduction */}
            <Card>
              <CardHeader>
                <CardTitle>Video Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary-foreground ml-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click to watch introduction video
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subjects & Expertise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subjects & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {tutor.subjectExpertise.map((subject) => (
                    <div
                      key={subject.name}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <span className="font-medium">{subject.name}</span>
                      <Badge
                        variant={
                          subject.level === 'Advanced'
                            ? 'default'
                            : subject.level === 'Intermediate'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {subject.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Availability
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                      disabled={weekOffset === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWeekOffset(weekOffset + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 gap-2 min-w-[600px]">
                    {currentWeekAvailability.map((day) => (
                      <div key={day.date} className="text-center">
                        <div className="mb-2 pb-2 border-b">
                          <p className="text-xs text-muted-foreground mb-1">
                            {day.dayOfWeek}
                          </p>
                          <p className="font-semibold">{day.day}</p>
                        </div>
                        <div className="space-y-2">
                          {day.slots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() =>
                                slot.available && handleTimeSlotClick(day.date, slot.time)
                              }
                              disabled={!slot.available}
                              className={`w-full text-xs py-2 px-1 rounded transition-colors ${
                                selectedDate === day.date && selectedTime === slot.time
                                  ? 'bg-primary text-primary-foreground'
                                  : slot.available
                                  ? 'bg-secondary hover:bg-primary/10 cursor-pointer'
                                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({tutor.totalReviews})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Distribution */}
                <div className="grid sm:grid-cols-2 gap-6 pb-6 border-b">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{tutor.rating}</div>
                    <StarRating rating={tutor.rating} size="lg" showNumber={false} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on {tutor.totalReviews} reviews
                    </p>
                  </div>
                  <div className="space-y-2">
                    {ratingDistribution.map(({ stars, count, percentage }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm w-12">{stars} star</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {tutor.reviews.slice(0, visibleReviews).map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {review.studentInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="font-semibold">{review.studentName}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                            <StarRating rating={review.rating} size="sm" showNumber={false} />
                          </div>
                          <Badge variant="outline" className="mb-2">
                            {review.subject}
                          </Badge>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {visibleReviews < tutor.reviews.length && (
                  <Button
                    variant="outline"
                    onClick={() => setVisibleReviews(visibleReviews + 3)}
                    className="w-full"
                  >
                    Load More Reviews
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="text-center pb-4 border-b">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">${tutor.hourlyRate}</span>
                    <span className="text-muted-foreground">/hour</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 1.5, 2].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setDuration(hours)}
                          className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            duration === hours
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {hours}hr
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium mb-1">Selected Time</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDate} at {selectedTime}
                      </p>
                      <p className="text-sm text-muted-foreground">Duration: {duration}hr</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-bold">${calculateTotal()}</span>
                  </div>

                  <Button onClick={handleBookSession} className="w-full" size="lg">
                    Book Session
                  </Button>

                  <Button
                    onClick={handleMessageTutor}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Tutor
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">{tutor.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last active</span>
                    <span className="font-medium">{tutor.lastActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response time</span>
                    <span className="font-medium">{tutor.avgResponseTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
