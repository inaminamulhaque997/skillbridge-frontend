import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/star-rating'
import { BadgeCheck, Eye } from 'lucide-react'

export interface TutorCardEnhancedProps {
  id: string
  name: string
  avatar?: string
  initials: string
  subjects: string[]
  rating: number
  reviews: number
  hourlyRate: number
  bio: string
  verified?: boolean
  href?: string
  className?: string
}

export function TutorCardEnhanced({
  id,
  name,
  avatar,
  initials,
  subjects,
  rating,
  reviews,
  hourlyRate,
  bio,
  verified = false,
  href = `/tutors/${id}`,
  className = '',
}: TutorCardEnhancedProps) {
  const [showBio, setShowBio] = useState(false)

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${className}`}
      role="article"
      aria-label={`Tutor profile for ${name}`}
      onMouseEnter={() => setShowBio(true)}
      onMouseLeave={() => setShowBio(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Large Avatar */}
          <Avatar className="h-20 w-20 border-4 border-primary/10 flex-shrink-0">
            <AvatarImage src={avatar} alt={`${name} profile picture`} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Name with Verification Badge */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-foreground truncate">{name}</h3>
              {verified && (
                <BadgeCheck
                  className="h-5 w-5 text-primary flex-shrink-0"
                  aria-label="Verified tutor"
                />
              )}
            </div>

            {/* Subjects */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {subjects.slice(0, 3).map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
              {subjects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{subjects.length - 3}
                </Badge>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={rating} size="sm" />
              <span className="font-semibold text-sm">{rating}</span>
              <span className="text-sm text-muted-foreground">
                ({reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-foreground">${hourlyRate}</span>
              <span className="text-muted-foreground text-sm">/hour</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={href}>
                  <Eye className="mr-2 h-4 w-4" />
                  Quick View
                </Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href={`${href}/book`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bio Preview on Hover */}
        {showBio && (
          <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
