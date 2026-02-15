export interface PlatformUser {
  id: string
  name: string
  email: string
  role: 'student' | 'tutor' | 'admin'
  status: 'active' | 'banned' | 'pending'
  avatar?: string
  joinedDate: string
  lastActive?: string
  sessionsCount?: number
  totalSpent?: number
}

export interface SubjectCategory {
  id: string
  name: string
  icon: string
  description: string
  tutorCount: number
  status: 'active' | 'inactive'
  order: number
}

export interface PlatformStats {
  totalUsers: number
  activeUsers: number
  totalTutors: number
  activeTutors: number
  totalStudents: number
  activeStudents: number
  totalBookings: number
  todayBookings: number
  weekBookings: number
  monthBookings: number
  totalRevenue: number
  monthRevenue: number
  platformRating: number
  completionRate: number
}
