'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getTutorBookings } from '@/services/booking'
import { Booking } from '@/types/booking'
import { 
  DollarSign,
  TrendingUp,
  Clock,
  Download,
  Calendar,
  CreditCard,
  ArrowUpRight,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'

interface Transaction {
  id: string
  date: string
  studentName: string
  subject: string
  duration: number
  amount: number
  status: 'paid' | 'pending' | 'processing'
  bookingId: string
}

export default function TutorEarningsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })

  useEffect(() => {
    if (user) {
      const tutorBookings = getTutorBookings(user.id)
      setBookings(tutorBookings)

      // Convert bookings to transactions
      const txns: Transaction[] = tutorBookings
        .filter(b => b.status === 'completed' || b.status === 'upcoming')
        .map(b => ({
          id: b.id,
          date: b.date,
          studentName: b.studentId,
          subject: b.subject,
          duration: b.duration,
          amount: b.totalPrice,
          status: b.status === 'completed' ? 'paid' : 'pending',
          bookingId: b.id
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setTransactions(txns)
    }
  }, [user])

  // Calculate earnings
  const completedBookings = bookings.filter(b => b.status === 'completed')
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  
  const thisMonth = new Date()
  const monthlyEarnings = completedBookings.filter(b => {
    const bookingDate = new Date(b.date)
    return bookingDate.getMonth() === thisMonth.getMonth() &&
           bookingDate.getFullYear() === thisMonth.getFullYear()
  }).reduce((sum, b) => sum + b.totalPrice, 0)

  const pendingEarnings = bookings
    .filter(b => b.status === 'upcoming')
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const withdrawableEarnings = totalEarnings * 0.85 // Mock: 85% after platform fee

  // Filter transactions by date
  const filteredTransactions = transactions.filter(txn => {
    if (!dateFilter.from && !dateFilter.to) return true
    const txnDate = new Date(txn.date)
    const from = dateFilter.from ? new Date(dateFilter.from) : null
    const to = dateFilter.to ? new Date(dateFilter.to) : null
    
    if (from && to) {
      return txnDate >= from && txnDate <= to
    } else if (from) {
      return txnDate >= from
    } else if (to) {
      return txnDate <= to
    }
    return true
  })

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Student', 'Subject', 'Duration (min)', 'Amount', 'Status'],
      ...filteredTransactions.map(txn => [
        txn.date,
        txn.studentName,
        txn.subject,
        txn.duration.toString(),
        txn.amount.toFixed(2),
        txn.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    
    toast.success('Earnings report downloaded')
  }

  const getStatusColor = (status: 'paid' | 'pending' | 'processing') => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'processing':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Earnings</h1>
          <p className="text-lg text-muted-foreground">
            Track your income and transaction history
          </p>
        </div>

        {/* Earnings Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {completedBookings.length} completed sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${monthlyEarnings.toFixed(2)}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">
                  +12% from last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${pendingEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From upcoming sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Withdrawable</CardTitle>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${withdrawableEarnings.toFixed(2)}</div>
              <Button size="sm" className="mt-2 w-full">
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View all your earnings and payments
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="from" className="text-xs">From</Label>
                    <Input
                      id="from"
                      type="date"
                      value={dateFilter.from}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                      className="w-36"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="to" className="text-xs">To</Label>
                    <Input
                      id="to"
                      type="date"
                      value={dateFilter.to}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                      className="w-36"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="gap-2 self-end"
                  onClick={handleExportCSV}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-muted/50 rounded-t-lg font-medium text-sm">
              <div>Date</div>
              <div>Student</div>
              <div>Subject</div>
              <div className="text-right">Duration</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Status</div>
            </div>

            {/* Transaction Rows */}
            <div className="divide-y">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="grid md:grid-cols-6 gap-4 p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground md:hidden" />
                      <div>
                        <p className="font-medium md:font-normal">
                          {new Date(txn.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm md:text-base">{txn.studentName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground md:text-foreground">
                        {txn.subject}
                      </p>
                    </div>
                    
                    <div className="md:text-right">
                      <p className="text-sm text-muted-foreground md:text-foreground">
                        {txn.duration} min
                      </p>
                    </div>
                    
                    <div className="md:text-right">
                      <p className="font-semibold text-lg md:text-base">
                        ${txn.amount.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="md:text-right">
                      <Badge variant={getStatusColor(txn.status)} className="capitalize">
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                  <p className="text-muted-foreground">
                    {dateFilter.from || dateFilter.to
                      ? 'Try adjusting your date range'
                      : 'Complete sessions to see your earnings here'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payout Method Placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payout Method</CardTitle>
            <CardDescription>
              Manage your payment settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Payment integration coming soon. You'll be able to add bank accounts and cards.
              </p>
              <Button disabled>Add Payout Method</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tax Summary Placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tax Summary</CardTitle>
            <CardDescription>
              Annual tax information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Year to Date Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Platform Fees (15%)</p>
                <p className="text-2xl font-bold">${(totalEarnings * 0.15).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Net Earnings</p>
                <p className="text-2xl font-bold">${(totalEarnings * 0.85).toFixed(2)}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-6 gap-2">
              <Download className="h-4 w-4" />
              Download Tax Forms
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
