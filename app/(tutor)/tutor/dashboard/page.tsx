import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Users, Star, Calendar } from 'lucide-react'

export default function TutorDashboardPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tutor Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your tutoring sessions and track your performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground">Based on 89 reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sessions This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 remaining</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{"Today's Schedule"}</CardTitle>
                <CardDescription>Your tutoring sessions for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    student: 'Alex Thompson',
                    subject: 'Mathematics',
                    time: '10:00 AM - 11:00 AM',
                    status: 'completed',
                  },
                  {
                    student: 'Lisa Park',
                    subject: 'Physics',
                    time: '2:00 PM - 3:00 PM',
                    status: 'upcoming',
                  },
                  {
                    student: 'James Wilson',
                    subject: 'Mathematics',
                    time: '4:00 PM - 5:30 PM',
                    status: 'upcoming',
                  },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{session.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{session.student}</p>
                        <p className="text-sm text-muted-foreground">{session.subject}</p>
                        <p className="text-sm text-muted-foreground">{session.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.status === 'completed' ? 'secondary' : 'default'}>
                        {session.status}
                      </Badge>
                      {session.status === 'upcoming' && (
                        <Button size="sm">Start Session</Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>What your students are saying</CardDescription>
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
                ].map((review, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{review.student}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>New session requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Sarah Miller', subject: 'Mathematics', date: 'Tomorrow, 3 PM' },
                  { name: 'John Smith', subject: 'Physics', date: 'Wed, 10 AM' },
                ].map((request, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{request.name}</p>
                        <p className="text-xs text-muted-foreground">{request.subject}</p>
                        <p className="text-xs text-muted-foreground">{request.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Accept</Button>
                      <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Set Availability
                </Button>
                <Button className="w-full" variant="outline">
                  Update Profile
                </Button>
                <Button className="w-full" variant="outline">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
