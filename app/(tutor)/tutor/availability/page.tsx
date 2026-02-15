'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Save, 
  X,
  Clock,
  CalendarX
} from 'lucide-react'
import { toast } from 'sonner'

type TimeSlot = {
  time: string
  available: boolean
}

type DaySchedule = {
  day: string
  date: string
  slots: TimeSlot[]
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
]

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function TutorAvailabilityPage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [timezone, setTimezone] = useState('America/New_York')
  const [bulkEditMode, setBulkEditMode] = useState(false)
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())
  const [exceptionDate, setExceptionDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Initialize schedule with some availability
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    daysOfWeek.map((day, index) => ({
      day,
      date: getDateForDay(index, currentWeek),
      slots: timeSlots.map((time) => ({
        time,
        available: index < 5 && (time >= '09:00' && time <= '17:00'), // Weekdays 9-5 by default
      })),
    }))
  )

  function getDateForDay(dayIndex: number, weekOffset: number) {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = dayIndex + 1 - currentDay + weekOffset * 7
    const date = new Date(today.setDate(today.getDate() + diff))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const toggleSlot = (dayIndex: number, slotIndex: number) => {
    if (bulkEditMode) {
      const slotId = `${dayIndex}-${slotIndex}`
      const newSelected = new Set(selectedSlots)
      if (newSelected.has(slotId)) {
        newSelected.delete(slotId)
      } else {
        newSelected.add(slotId)
      }
      setSelectedSlots(newSelected)
    } else {
      const newSchedule = [...schedule]
      newSchedule[dayIndex].slots[slotIndex].available = 
        !newSchedule[dayIndex].slots[slotIndex].available
      setSchedule(newSchedule)
    }
  }

  const setBulkAvailability = (available: boolean) => {
    const newSchedule = [...schedule]
    selectedSlots.forEach((slotId) => {
      const [dayIndex, slotIndex] = slotId.split('-').map(Number)
      newSchedule[dayIndex].slots[slotIndex].available = available
    })
    setSchedule(newSchedule)
    setSelectedSlots(new Set())
    setBulkEditMode(false)
    toast.success(`Set ${selectedSlots.size} slots to ${available ? 'available' : 'unavailable'}`)
  }

  const copyToNextWeek = () => {
    toast.success('Schedule copied to next week')
  }

  const saveChanges = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success('Availability updated successfully')
  }

  const addException = () => {
    if (exceptionDate) {
      toast.success(`Blocked date: ${exceptionDate}`)
      setExceptionDate('')
    }
  }

  const navigateWeek = (direction: number) => {
    const newWeek = currentWeek + direction
    setCurrentWeek(newWeek)
    setSchedule(
      daysOfWeek.map((day, index) => ({
        day,
        date: getDateForDay(index, newWeek),
        slots: timeSlots.map((time) => ({
          time,
          available: index < 5 && (time >= '09:00' && time <= '17:00'),
        })),
      }))
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Availability</h1>
          <p className="text-lg text-muted-foreground">
            Set your weekly schedule and availability preferences
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Card className="flex-1">
            <CardContent className="p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateWeek(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center min-w-[200px]">
                  <p className="text-sm font-medium">
                    {currentWeek === 0
                      ? 'This Week'
                      : currentWeek > 0
                      ? `${currentWeek} week${currentWeek > 1 ? 's' : ''} ahead`
                      : `${Math.abs(currentWeek)} week${Math.abs(currentWeek) > 1 ? 's' : ''} ago`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateWeek(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Label htmlFor="timezone" className="text-sm whitespace-nowrap">
                  Timezone:
                </Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone" className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">EST (GMT-5)</SelectItem>
                    <SelectItem value="America/Chicago">CST (GMT-6)</SelectItem>
                    <SelectItem value="America/Denver">MST (GMT-7)</SelectItem>
                    <SelectItem value="America/Los_Angeles">PST (GMT-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-wrap items-center gap-2">
              {bulkEditMode ? (
                <>
                  <Badge variant="secondary">
                    {selectedSlots.size} slots selected
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => setBulkAvailability(true)}
                    disabled={selectedSlots.size === 0}
                  >
                    Set Available
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBulkAvailability(false)}
                    disabled={selectedSlots.size === 0}
                  >
                    Set Unavailable
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setBulkEditMode(false)
                      setSelectedSlots(new Set())
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => setBulkEditMode(true)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Bulk Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyToNextWeek}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Next Week
                  </Button>
                  <Button size="sm" onClick={saveChanges} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Header Row */}
                <div className="grid grid-cols-8 border-b bg-muted/50">
                  <div className="p-3 text-sm font-medium">Time</div>
                  {schedule.map((day) => (
                    <div key={day.day} className="p-3 text-center border-l">
                      <div className="text-sm font-medium">{day.day.substring(0, 3)}</div>
                      <div className="text-xs text-muted-foreground">{day.date}</div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="max-h-[600px] overflow-y-auto">
                  {timeSlots.map((time, slotIndex) => (
                    <div
                      key={time}
                      className="grid grid-cols-8 border-b hover:bg-accent/5 transition-colors"
                    >
                      <div className="p-3 text-sm font-medium text-muted-foreground">
                        {time}
                      </div>
                      {schedule.map((day, dayIndex) => {
                        const slot = day.slots[slotIndex]
                        const slotId = `${dayIndex}-${slotIndex}`
                        const isSelected = selectedSlots.has(slotId)

                        return (
                          <button
                            key={`${day.day}-${time}`}
                            onClick={() => toggleSlot(dayIndex, slotIndex)}
                            className={`p-3 border-l transition-all ${
                              bulkEditMode
                                ? isSelected
                                  ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 ring-inset'
                                  : 'hover:bg-accent'
                                : slot.available
                                ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
                                : 'bg-secondary hover:bg-accent'
                            }`}
                          >
                            {bulkEditMode ? (
                              isSelected && (
                                <div className="flex items-center justify-center">
                                  <Checkbox checked className="pointer-events-none" />
                                </div>
                              )
                            ) : (
                              slot.available && (
                                <div className="text-xs font-medium text-green-700 dark:text-green-400">
                                  ✓
                                </div>
                              )
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exception Dates */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Exception Dates</CardTitle>
            <CardDescription>Block specific dates (vacations, holidays, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="date"
                value={exceptionDate}
                onChange={(e) => setExceptionDate(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={addException} disabled={!exceptionDate}>
                <CalendarX className="mr-2 h-4 w-4" />
                Block Date
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
