'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { createBooking, formatDate, formatTime } from '@/services/booking'
import { Loader2, Calendar, Clock, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutorId: string
  tutorName: string
  selectedDate: string
  selectedTime: string
  duration: number
  hourlyRate: number
  subjects: string[]
  studentId: string
}

export function BookingModal({
  open,
  onOpenChange,
  tutorId,
  tutorName,
  selectedDate,
  selectedTime,
  duration,
  hourlyRate,
  subjects,
  studentId,
}: BookingModalProps) {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || '')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = (hourlyRate / 60) * duration

  const handleConfirm = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject')
      return
    }

    setIsLoading(true)

    try {
      await createBooking({
        tutorId,
        date: selectedDate,
        startTime: selectedTime,
        duration,
        subject: selectedSubject,
        notes: notes.trim() || undefined,
      })

      toast.success('Booking confirmed!', {
        description: `Your session with ${tutorName} has been scheduled.`,
      })

      onOpenChange(false)
      router.push('/dashboard/bookings')
    } catch (error) {
      toast.error('Booking failed', {
        description: 'Please try again or contact support.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Review your booking details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedDate)} at {formatTime(selectedTime)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {duration} minutes ({duration / 60} hour{duration > 60 ? 's' : ''})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Price Breakdown</p>
                <div className="text-sm text-muted-foreground space-y-1 mt-1">
                  <div className="flex justify-between">
                    <span>Hourly rate:</span>
                    <span>${hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{duration} min</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground border-t pt-1 mt-1">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject <span className="text-destructive">*</span>
            </Label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes for {tutorName} (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What would you like to focus on in this session?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Let your tutor know what you'd like to cover
            </p>
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
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              <>Confirm Booking</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
