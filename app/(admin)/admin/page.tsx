'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/admin/stat-card'
import { StatusBadge } from '@/components/admin/status-badge'
import { getPlatformStats, getAllUsers } from '@/services/admin'
import { getBookings } from '@/services/booking'
import { PlatformStats } from '@/types/admin'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  UserPlus,
  Settings,
  BarChart3,
  ArrowRight
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    const platformStats = getPlatformStats()
    const users = getAllUsers()
    const bookings = getBookings()

    setStats(platformStats)
    setRecentUsers(users.slice(0, 5))
    setRecentBookings(bookings.slice(0, 5))
  }, [])

  if (!stats) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // Mock chart data
  const userGrowthData = [
    { month: 'Sep', users: 1200 },
    { month: 'Oct', users: 1450 },
    { month: 'Nov', users: 1680 },
    { month: 'Dec', users: 2020 },
    { month: 'Jan', users: 2450 },
    { month: 'Feb', users: 2847 },
  ]

  const topSubjects = [
    { name: 'Programming', value: 35 },
    { name: 'Mathematics', value: 25 },
    { name: 'Science', value: 20 },
    { name: 'Languages', value: 12 },
    { name: 'Business', value: 8 },
  ]

  const maxUsers = Math.max(...userGrowthData.map(d => d.users))

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Platform overview and management
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            description={`${stats.totalStudents} Students | ${stats.totalTutors} Tutors`}
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Active Bookings"
            value={stats.todayBookings}
            description={`${stats.weekBookings} this week | ${stats.monthBookings} this month`}
            icon={BookOpen}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthRevenue.toLocaleString()}`}
            description={`$${stats.totalRevenue.toLocaleString()} total`}
            icon={DollarSign}
            trend={{ value: 20.1, isPositive: true }}
          />
          <StatCard
            title="Platform Rating"
            value={stats.platformRating}
            description={`${stats.completionRate}% completion rate`}
            icon={TrendingUp}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGrowthData.map((data) => (
                    <div key={data.month} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-muted-foreground">
                        {data.month}
                      </div>
                      <div className="flex-1">
                        <div className="h-10 bg-secondary rounded-md overflow-hidden relative">
                          <div
                            className="h-full bg-primary flex items-center justify-end pr-3 text-sm font-medium text-primary-foreground transition-all"
                            style={{ width: `${(data.users / maxUsers) * 100}%` }}
                          >
                            {data.users}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Top Subjects</CardTitle>
                <CardDescription>By tutor count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSubjects.map((subject, index) => (
                    <div key={subject.name} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{subject.name}</span>
                          <span className="text-sm text-muted-foreground">{subject.value}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${subject.value}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Signups */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Signups</CardTitle>
                  <CardDescription>New users this week</CardDescription>
                </div>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={user.status} />
                        <StatusBadge status={user.role as any} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                  <p className="text-sm font-medium">Pending Reviews</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    8 tutor applications need review
                  </p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <p className="text-sm font-medium">New Reports</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 new user reports to review
                  </p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50 rounded">
                  <p className="text-sm font-medium">System Healthy</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All services running normally
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="font-bold">{stats.todayBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Tutors</span>
                  <span className="font-bold">{stats.activeTutors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Students</span>
                  <span className="font-bold">{stats.activeStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Support Tickets</span>
                  <span className="font-bold">12</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/users">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/bookings">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Bookings
                  </Button>
                </Link>
                <Link href="/admin/categories">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Manage Categories
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
