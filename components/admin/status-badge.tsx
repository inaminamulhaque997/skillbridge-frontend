import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'banned' | 'pending' | 'completed' | 'cancelled' | 'upcoming'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    active: 'bg-green-100 text-green-700 hover:bg-green-100',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    banned: 'bg-red-100 text-red-700 hover:bg-red-100',
    pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    completed: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    cancelled: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    upcoming: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100',
  }

  return (
    <Badge variant="secondary" className={cn(variants[status], 'capitalize', className)}>
      {status}
    </Badge>
  )
}
