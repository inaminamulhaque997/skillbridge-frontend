import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Star } from 'lucide-react'

// Mock data for demonstration
const tutors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    subjects: ['Mathematics', 'Physics'],
    rating: 4.9,
    reviews: 127,
    hourlyRate: 45,
    bio: 'PhD in Mathematics with 10 years of teaching experience',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: '/avatars/michael.jpg',
    subjects: ['Programming', 'Computer Science'],
    rating: 5.0,
    reviews: 89,
    hourlyRate: 60,
    bio: 'Senior Software Engineer and coding mentor',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: '/avatars/emily.jpg',
    subjects: ['English', 'Literature'],
    rating: 4.8,
    reviews: 156,
    hourlyRate: 40,
    bio: 'Published author and English literature specialist',
  },
  {
    id: 4,
    name: 'David Kim',
    avatar: '/avatars/david.jpg',
    subjects: ['Chemistry', 'Biology'],
    rating: 4.9,
    reviews: 92,
    hourlyRate: 50,
    bio: 'University professor with research background',
  },
]

export default function BrowseTutorsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse Tutors</h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect tutor to help you achieve your learning goals
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by subject, name, or keyword..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={tutor.avatar} alt={tutor.name} />
                    <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="mb-2">{tutor.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{tutor.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({tutor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{tutor.bio}</CardDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-foreground">${tutor.hourlyRate}</span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                  </div>
                  <Button>View Profile</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
