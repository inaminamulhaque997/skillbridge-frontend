'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle } from 'lucide-react'

interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  enabled: boolean
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function TutorAvailabilityPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [timezone, setTimezone] = useState('UTC+6')
  const [bufferTime, setBufferTime] = useState('15')
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState('8')
  
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '2', day: 'Tuesday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '3', day: 'Wednesday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '4', day: 'Thursday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '5', day: 'Friday', startTime: '09:00', endTime: '17:00', enabled: true },
    { id: '6', day: 'Saturday', startTime: '10:00', endTime: '14:00', enabled: false },
    { id: '7', day: 'Sunday', startTime: '10:00', endTime: '14:00', enabled: false },
  ])

  const [exceptions, setExceptions] = useState([
    { id: '1', date: '2026-02-25', reason: 'Personal appointment' },
  ])

  const toggleSlot = (id: string) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, enabled: !slot.enabled } : slot
    ))
  }

  const updateSlot = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const addException = () => {
    setExceptions([
      ...exceptions,
      { id: Date.now().toString(), date: '', reason: '' }
    ])
  }

  const removeException = (id: string) => {
    setExceptions(exceptions.filter(e => e.id !== id))
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Availability</h1>
          <p className="text-lg text-muted-foreground">
            Set your teaching hours and manage your schedule
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription>
                  Set your available hours for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {slots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg ${!slot.enabled ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex items-center justify-between sm:w-32">
                      <span className="font-medium">{slot.day}</span>
                      <Switch
                        checked={slot.enabled}
                        onCheckedChange={() => toggleSlot(slot.id)}
                      />
                    </div>
                    
                    {slot.enabled && (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    )}
                    
                    {!slot.enabled && (
                      <span className="text-sm text-muted-foreground">Unavailable</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Exceptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Date Exceptions
                </CardTitle>
                <CardDescription>
                  Block specific dates when you're not available
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exceptions.map((exception) => (
                  <div key={exception.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Input
                      type="date"
                      value={exception.date}
                      onChange={(e) => setExceptions(exceptions.map(ex => 
                        ex.id === exception.id ? { ...ex, date: e.target.value } : ex
                      ))}
                      className="w-40"
                    />
                    <Input
                      placeholder="Reason (optional)"
                      value={exception.reason}
                      onChange={(e) => setExceptions(exceptions.map(ex => 
                        ex.id === exception.id ? { ...ex, reason: e.target.value } : ex
                      ))}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeException(exception.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addException}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exception
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+6">UTC+6 (Dhaka)</SelectItem>
                      <SelectItem value="UTC+5">UTC+5 (Karachi)</SelectItem>
                      <SelectItem value="UTC+5:30">UTC+5:30 (Mumbai)</SelectItem>
                      <SelectItem value="UTC+8">UTC+8 (Singapore)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (Los Angeles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buffer">Buffer Time Between Sessions</Label>
                  <Select value={bufferTime} onValueChange={setBufferTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No buffer</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSessions">Max Sessions Per Day</Label>
                  <Select value={maxSessionsPerDay} onValueChange={setMaxSessionsPerDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 sessions</SelectItem>
                      <SelectItem value="6">6 sessions</SelectItem>
                      <SelectItem value="8">8 sessions</SelectItem>
                      <SelectItem value="10">10 sessions</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setSlots(slots.map(s => ({ ...s, enabled: true, startTime: '09:00', endTime: '17:00' })))}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Set 9-5 All Weekdays
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setSlots(slots.map(s => ({ ...s, enabled: false })))}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Clear All Availability
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Availability
                </>
              )}
            </Button>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Students can only book sessions during your available hours. 
                  Make sure to keep your schedule updated to avoid missed bookings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}