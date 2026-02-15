'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Upload, 
  Save, 
  Eye, 
  Plus, 
  X, 
  FileVideo,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

type Subject = {
  name: string
  expertise: 'beginner' | 'intermediate' | 'expert'
}

type Education = {
  id: string
  degree: string
  institution: string
  year: string
}

export default function TutorProfileEditPage() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [showPreview, setShowPreview] = useState(false)

  // Profile data
  const [profileData, setProfileData] = useState({
    displayName: user?.name || '',
    headline: 'Experienced Math Tutor | PhD in Mathematics',
    bio: `Passionate educator with 10+ years of experience helping students excel in mathematics. 
    
I specialize in breaking down complex concepts into easy-to-understand lessons. My teaching approach is personalized and student-centered, ensuring that each session is productive and engaging.

My students consistently improve their grades and develop a genuine appreciation for math.`,
    hourlyRate: '45',
    currency: 'USD',
    videoUrl: '',
    subjects: [
      { name: 'Mathematics', expertise: 'expert' as const },
      { name: 'Calculus', expertise: 'expert' as const },
      { name: 'Algebra', expertise: 'expert' as const },
    ],
    education: [
      { id: '1', degree: 'PhD in Mathematics', institution: 'MIT', year: '2015' },
      { id: '2', degree: 'MS in Mathematics', institution: 'Stanford University', year: '2012' },
    ],
    teachingStyles: ['Visual', 'Hands-on', 'Patient', 'Structured'],
  })

  const [newSubject, setNewSubject] = useState({ name: '', expertise: 'intermediate' as const })
  const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' })

  const teachingStyleOptions = [
    'Visual',
    'Hands-on',
    'Patient',
    'Structured',
    'Interactive',
    'Flexible',
    'Encouraging',
    'Detail-oriented',
  ]

  const handleSave = async () => {
    setIsSaving(true)
    setAutoSaveStatus('saving')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSaving(false)
    setAutoSaveStatus('saved')
    toast.success('Profile updated successfully!')
    
    setTimeout(() => {
      setAutoSaveStatus('unsaved')
    }, 3000)
  }

  const addSubject = () => {
    if (newSubject.name) {
      setProfileData({
        ...profileData,
        subjects: [...profileData.subjects, newSubject],
      })
      setNewSubject({ name: '', expertise: 'intermediate' })
      toast.success('Subject added')
    }
  }

  const removeSubject = (index: number) => {
    setProfileData({
      ...profileData,
      subjects: profileData.subjects.filter((_, i) => i !== index),
    })
  }

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setProfileData({
        ...profileData,
        education: [
          ...profileData.education,
          { ...newEducation, id: Date.now().toString() },
        ],
      })
      setNewEducation({ degree: '', institution: '', year: '' })
      toast.success('Education added')
    }
  }

  const removeEducation = (id: string) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter((e) => e.id !== id),
    })
  }

  const toggleTeachingStyle = (style: string) => {
    if (profileData.teachingStyles.includes(style)) {
      setProfileData({
        ...profileData,
        teachingStyles: profileData.teachingStyles.filter((s) => s !== style),
      })
    } else {
      setProfileData({
        ...profileData,
        teachingStyles: [...profileData.teachingStyles, style],
      })
    }
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Edit Profile</h1>
            <p className="text-lg text-muted-foreground">
              Update your public tutor profile information
            </p>
          </div>
          <div className="flex items-center gap-3">
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>All changes saved</span>
              </div>
            )}
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Edit Mode' : 'Preview'}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Publish Changes'}
            </Button>
          </div>
        </div>

        {showPreview ? (
          /* Preview Mode */
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user?.avatar} alt={profileData.displayName} />
                    <AvatarFallback className="text-3xl">
                      {profileData.displayName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">{profileData.displayName}</h2>
                    <p className="text-muted-foreground">{profileData.headline}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Subjects & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {subject.name} • {subject.expertise}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Teaching Style</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.teachingStyles.map((style) => (
                        <Badge key={style} variant="outline">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Education</h3>
                    <div className="space-y-3">
                      {profileData.education.map((edu) => (
                        <div key={edu.id} className="border-l-2 border-primary pl-4">
                          <p className="font-semibold">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution} • {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${profileData.hourlyRate}
                      <span className="text-sm text-muted-foreground font-normal">/hour</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Edit Mode */
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Profile Photo */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>
                    Upload a professional photo (recommended size: 400x400px)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar} alt={profileData.displayName} />
                      <AvatarFallback className="text-2xl">
                        {profileData.displayName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, displayName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={profileData.headline}
                      onChange={(e) =>
                        setProfileData({ ...profileData, headline: e.target.value })
                      }
                      placeholder="e.g., Experienced Math Tutor | PhD in Mathematics"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={8}
                      placeholder="Tell students about your teaching experience, approach, and what makes you unique..."
                    />
                    <p className="text-xs text-muted-foreground">
                      {profileData.bio.length} characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) =>
                          setProfileData({ ...profileData, hourlyRate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={profileData.currency} onValueChange={(value) =>
                        setProfileData({ ...profileData, currency: value })
                      }>
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teaching Style */}
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Style</CardTitle>
                  <CardDescription>
                    Select tags that describe your teaching approach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {teachingStyleOptions.map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox
                          id={`style-${style}`}
                          checked={profileData.teachingStyles.includes(style)}
                          onCheckedChange={() => toggleTeachingStyle(style)}
                        />
                        <label htmlFor={`style-${style}`} className="text-sm cursor-pointer">
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subjects You Teach</CardTitle>
                  <CardDescription>
                    Add subjects and specify your expertise level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Subjects */}
                  <div className="space-y-3">
                    {profileData.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {subject.expertise}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubject(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Subject */}
                  <div className="border-t pt-4">
                    <p className="font-medium mb-3">Add Subject</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Subject name"
                        value={newSubject.name}
                        onChange={(e) =>
                          setNewSubject({ ...newSubject, name: e.target.value })
                        }
                      />
                      <Select
                        value={newSubject.expertise}
                        onValueChange={(value: any) =>
                          setNewSubject({ ...newSubject, expertise: value })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={addSubject}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Education & Certifications</CardTitle>
                  <CardDescription>
                    Add your educational background and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Education */}
                  <div className="space-y-3">
                    {profileData.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-muted-foreground">{edu.year}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Education */}
                  <div className="border-t pt-4">
                    <p className="font-medium mb-3">Add Education</p>
                    <div className="space-y-3">
                      <Input
                        placeholder="Degree/Certification"
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, degree: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Institution"
                        value={newEducation.institution}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, institution: e.target.value })
                        }
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Year"
                          value={newEducation.year}
                          onChange={(e) =>
                            setNewEducation({ ...newEducation, year: e.target.value })
                          }
                          className="flex-1"
                        />
                        <Button onClick={addEducation}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Introduction</CardTitle>
                  <CardDescription>
                    Add a video URL (YouTube or Vimeo) to introduce yourself to students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://youtube.com/watch?v=..."
                      value={profileData.videoUrl}
                      onChange={(e) =>
                        setProfileData({ ...profileData, videoUrl: e.target.value })
                      }
                    />
                  </div>

                  {profileData.videoUrl ? (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FileVideo className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Video Preview</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FileVideo className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No video added yet</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
