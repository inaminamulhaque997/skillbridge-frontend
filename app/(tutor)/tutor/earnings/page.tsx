'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { getTutorBookings, formatDate } from '@/services/booking'
import { Booking } from '@/types/booking'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, ArrowUpRight, Wallet, LineChart } from 'lucide-react'

export default function TutorEarningsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return
      
      try {
        const data = await getTutorBookings(user.id)
        setBookings(data)
      } catch (error) {
        console.error('[SkillBridge] Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

  const completedBookings = bookings.filter(b => b.status === 'completed')
  
  // Calculate earnings
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  
  const now = new Date()
  const thisMonthBookings = completedBookings.filter(b => {
    const bookingDate = new Date(b.date)
    return bookingDate.getMonth() === now.getMonth() && 
           bookingDate.getFullYear() === now.getFullYear()
  })
  const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  
  const lastMonthBookings = completedBookings.filter(b => {
    const bookingDate = new Date(b.date)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
    return bookingDate.getMonth() === lastMonth.getMonth() && 
           bookingDate.getFullYear() === lastMonth.getFullYear()
  })
  const lastMonthEarnings = lastMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0)

  const earningsChange = lastMonthEarnings > 0 
    ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1)
    : 0

  // Weekly earnings for chart
  const weeklyEarnings = [
    { week: 'Week 1', amount: 320 },
    { week: 'Week 2', amount: 450 },
    { week: 'Week 3', amount: 380 },
    { week: 'Week 4', amount: 520 },
  ]
  const maxEarnings = Math.max(...weeklyEarnings.map(w => w.amount))

  // Recent transactions
  const recentTransactions = completedBookings.slice(0, 10).map(b => ({
    id: b.id,
    student: b.studentId,
    subject: b.subject,
    amount: b.totalPrice,
    date: b.date,
    status: 'completed'
  }))

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading earnings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Earnings</h1>
          <p className="text-lg text-muted-foreground">
            Track your tutoring income and payouts
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${thisMonthEarnings.toFixed(2)}</div>
              <div className="flex items-center gap-1 mt-1">
                {Number(earningsChange) >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${Number(earningsChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {earningsChange}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedBookings.length}</div>
              <p className="text-xs text-muted-foreground">Total sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. per Session</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${completedBookings.length > 0 ? (totalEarnings / completedBookings.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Average earning</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Earnings</CardTitle>
                <CardDescription>Your earnings breakdown this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyEarnings.map((week) => (
                    <div key={week.week} className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium text-muted-foreground">
                        {week.week}
                      </div>
                      <div className="flex-1">
                        <div className="h-10 bg-secondary rounded-md overflow-hidden">
                          <div
                            className="h-full bg-primary flex items-center justify-end pr-3 text-sm font-medium text-primary-foreground transition-all"
                            style={{ width: `${(week.amount / maxEarnings) * 100}%` }}
                          >
                            ${week.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest payments</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.student} • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+${transaction.amount.toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs">Completed</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payout Info */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-2xl font-bold">${thisMonthEarnings.toFixed(2)}</p>
                </div>
                <Button className="w-full">
                  Request Payout
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Payouts are processed within 3-5 business days
                </p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">VISA</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">•••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-bold">$180.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Week</span>
                  <span className="font-bold">$220.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-bold">${thisMonthEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Month</span>
                  <span className="font-bold">${lastMonthEarnings.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}