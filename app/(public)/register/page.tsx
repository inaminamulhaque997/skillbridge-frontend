'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Loader2, GraduationCap, BookOpen } from 'lucide-react'

type UserRole = 'student' | 'tutor'

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  educationLevel?: string
  expertise?: string
  experience?: string
  hourlyRate?: string
  general?: string
}

export default function RegisterPage() {
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('student')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student fields
    educationLevel: '',
    learningGoals: '',
    // Tutor fields
    expertise: '',
    experience: '',
    hourlyRate: '',
    bio: '',
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Common validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Role-specific validations
    if (role === 'student') {
      if (!formData.educationLevel) {
        newErrors.educationLevel = 'Education level is required'
      }
    } else {
      if (!formData.expertise.trim()) {
        newErrors.expertise = 'At least one subject is required'
      }
      if (!formData.experience) {
        newErrors.experience = 'Experience is required'
      }
      if (!formData.hourlyRate) {
        newErrors.hourlyRate = 'Hourly rate is required'
      } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
        newErrors.hourlyRate = 'Please enter a valid hourly rate'
      }
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      // Use the mock registration service
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role,
        educationLevel: formData.educationLevel,
        learningGoals: formData.learningGoals,
        expertise: formData.expertise,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        bio: formData.bio,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.'
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
            <CardDescription className="text-base">
              Choose your role and get started with SkillBridge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              {/* Role Selection Tabs */}
              <Tabs value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <TabsList className="grid w-full grid-cols-2 h-auto">
                  <TabsTrigger 
                    value="student" 
                    className="flex items-center gap-2 py-3"
                    disabled={isLoading}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tutor" 
                    className="flex items-center gap-2 py-3"
                    disabled={isLoading}
                  >
                    <BookOpen className="h-4 w-4" />
                    Tutor
                  </TabsTrigger>
                </TabsList>

                {/* Common Fields */}
                <div className="space-y-4 mt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={errors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                        aria-invalid={!!errors.fullName}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Password <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                        aria-invalid={!!errors.password}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm Password <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                        aria-invalid={!!errors.confirmPassword}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student-Specific Fields */}
                <TabsContent value="student" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">
                      Education Level <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="educationLevel"
                      value={formData.educationLevel}
                      onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.educationLevel ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
                      }`}
                      disabled={isLoading}
                      aria-invalid={!!errors.educationLevel}
                    >
                      <option value="">Select your education level</option>
                      <option value="high-school">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="professional">Professional</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.educationLevel && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.educationLevel}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningGoals">Learning Goals (Optional)</Label>
                    <textarea
                      id="learningGoals"
                      placeholder="What do you want to learn or achieve?"
                      value={formData.learningGoals}
                      onChange={(e) => handleInputChange('learningGoals', e.target.value)}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    />
                  </div>
                </TabsContent>

                {/* Tutor-Specific Fields */}
                <TabsContent value="tutor" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="expertise">
                      Expertise/Subjects <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="expertise"
                      type="text"
                      placeholder="e.g., Mathematics, Programming, English"
                      value={formData.expertise}
                      onChange={(e) => handleInputChange('expertise', e.target.value)}
                      className={errors.expertise ? 'border-destructive focus-visible:ring-destructive' : ''}
                      disabled={isLoading}
                      aria-invalid={!!errors.expertise}
                    />
                    <p className="text-xs text-muted-foreground">Separate multiple subjects with commas</p>
                    {errors.expertise && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.expertise}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">
                        Years of Experience <span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.experience ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
                        }`}
                        disabled={isLoading}
                        aria-invalid={!!errors.experience}
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                      {errors.experience && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">
                        Hourly Rate (USD) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g., 45"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        className={errors.hourlyRate ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                        aria-invalid={!!errors.hourlyRate}
                      />
                      {errors.hourlyRate && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.hourlyRate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <textarea
                      id="bio"
                      placeholder="Tell students about yourself, your teaching style, and qualifications..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  `Create ${role === 'student' ? 'Student' : 'Tutor'} Account`
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                >
                  Google
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                >
                  GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:underline font-medium"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Sign in
                </Link>
              </p>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link 
                  href="/terms" 
                  className="text-primary hover:underline"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Terms of Service
                </Link>
                {' and '}
                <Link 
                  href="/privacy" 
                  className="text-primary hover:underline"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Privacy Policy
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
