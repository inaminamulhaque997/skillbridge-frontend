import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface CategoryBadgeProps {
  name: string
  icon: LucideIcon
  count: number
  href?: string
  onClick?: () => void
  className?: string
}

export function CategoryBadge({
  name,
  icon: Icon,
  count,
  href,
  onClick,
  className = '',
}: CategoryBadgeProps) {
  const Component = href ? 'a' : 'div'
  const cardProps = href
    ? { as: 'a', href }
    : onClick
    ? { as: 'button', onClick, type: 'button' as const }
    : {}

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 hover:-translate-y-1 ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
      aria-label={`Browse ${name} category with ${count} tutors`}
    >
      <CardContent className="p-6 text-center space-y-3">
        <div className="flex justify-center">
          <div 
            className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            aria-hidden="true"
          >
            <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
          </div>
        </div>
        <h3 className="font-semibold text-lg text-foreground">
          {name}
        </h3>
        <Badge variant="secondary" className="font-normal">
          {count} tutors
        </Badge>
      </CardContent>
    </Card>
  )
}
