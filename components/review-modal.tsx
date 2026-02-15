'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { mockSubmitReview } from '@/services/booking'
import { Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingId: string
  studentId: string
  tutorId: string
  tutorName: string
  onReviewSubmitted?: () => void
}

export function ReviewModal({
  open,
  onOpenChange,
  bookingId,
  studentId,
  tutorId,
  tutorName,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a review')
      return
    }

    setIsLoading(true)

    try {
      await mockSubmitReview({
        bookingId,
        studentId,
        tutorId,
        rating,
        comment: comment.trim(),
        isAnonymous,
      })

      toast.success('Review submitted!', {
        description: `Thank you for reviewing ${tutorName}.`,
      })

      onOpenChange(false)
      onReviewSubmitted?.()
      
      // Reset form
      setRating(0)
      setComment('')
      setIsAnonymous(false)
    } catch (error) {
      toast.error('Failed to submit review', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {tutorName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating <span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                  disabled={isLoading}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">
              Your Review <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="review-comment"
              placeholder="Tell others about your experience with this tutor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters ({comment.length}/10)
            </p>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              disabled={isLoading}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Post anonymously
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || rating === 0 || comment.trim().length < 10}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
