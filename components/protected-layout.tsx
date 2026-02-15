'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import type { UserRole } from '@/types/auth'
import { Loader2 } from 'lucide-react'

interface ProtectedLayoutProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  redirectTo?: string
}

export function ProtectedLayout({ children, allowedRoles, redirectTo = '/login' }: ProtectedLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not authenticated, redirect to login
        router.push(redirectTo)
      } else if (!allowedRoles.includes(user.role)) {
        // Wrong role, redirect to appropriate dashboard
        if (user.role === 'admin') {
          router.push('/admin')
        } else if (user.role === 'tutor') {
          router.push('/tutor/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    }
  }, [user, isLoading, allowedRoles, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

// Specific layout components for each role
export function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={['student']}>
      {children}
    </ProtectedLayout>
  )
}

export function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={['tutor']}>
      {children}
    </ProtectedLayout>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={['admin']}>
      {children}
    </ProtectedLayout>
  )
}
