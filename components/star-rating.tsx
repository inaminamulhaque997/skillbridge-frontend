import { Star } from 'lucide-react'

export interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number | 'sm' | 'md' | 'lg'
  showValue?: boolean
  showNumber?: boolean
  className?: string
}

// Size mapping for string sizes
const sizeMap: Record<'sm' | 'md' | 'lg', number> = {
  sm: 14,
  md: 16,
  lg: 20,
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  showValue = true,
  showNumber = true,
  className = '',
}: StarRatingProps) {
  // Convert string size to number
  const starSize = typeof size === 'string' ? sizeMap[size] || 16 : size
  
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div 
      className={`flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`Rating: ${rating} out of ${maxStars} stars`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="fill-yellow-400 text-yellow-400"
          size={starSize}
          aria-hidden="true"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative" aria-hidden="true">
          <Star className="text-yellow-400" size={starSize} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="fill-yellow-400 text-yellow-400" size={starSize} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="text-yellow-400"
          size={starSize}
          aria-hidden="true"
        />
      ))}

      {showValue && (
        <span className="font-semibold ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
