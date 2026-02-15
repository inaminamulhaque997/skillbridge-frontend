import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/star-rating'

export interface TutorCardProps {
  name: string
  subject: string
  rating: number
  reviews: number
  rate: number
  image?: string
  initials: string
  href?: string
  className?: string
}

export function TutorCard({
  name,
  subject,
  rating,
  reviews,
  rate,
  image,
  initials,
  href = '#',
  className = '',
}: TutorCardProps) {
  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
      role="article"
      aria-label={`Tutor profile for ${name}`}
    >
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20 border-4 border-primary/10">
            <AvatarImage src={image} alt={`${name} profile picture`} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-base font-medium text-primary">
          {subject}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <StarRating rating={rating} />
          <span className="text-sm text-muted-foreground" aria-label={`${reviews} reviews`}>
            ({reviews} reviews)
          </span>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-foreground">${rate}</span>
          <span className="text-muted-foreground">/hour</span>
        </div>
        <Link href={href} className="block">
          <Button 
            className="w-full group-hover:bg-primary/90 transition-colors"
            aria-label={`View ${name}'s profile`}
          >
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
