'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/admin/status-badge'
import { ConfirmModal } from '@/components/admin/confirm-modal'
import { getBookings, formatDate, formatTime } from '@/services/booking'
import { Booking } from '@/types/booking'
import { Search, Eye, X, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminBookingsPage() {
  const [bookings] = useState<Booking[]>(getBookings())
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewBookingModal, setViewBookingModal] = useState<Booking | null>(null)
  const [cancelModal, setCancelModal] = useState<Booking | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof Booking>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]

      if (sortColumn === 'date') {
        aVal = new Date(`${a.date}T${a.startTime}`).getTime()
        bVal = new Date(`${b.date}T${b.startTime}`).getTime()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [bookings, searchQuery, statusFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column: keyof Booking) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const handleCancelBooking = () => {
    if (cancelModal) {
      toast.success(`Booking ${cancelModal.id} has been cancelled`)
      setCancelModal(null)
    }
  }

  const handleRefund = (booking: Booking) => {
    toast.success(`Refund of $${booking.totalPrice} initiated for booking ${booking.id}`)
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Bookings Management</h1>
          <p className="text-lg text-muted-foreground">
            View and manage all platform bookings
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>{filteredBookings.length} bookings found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by ID, student, tutor, or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      Booking ID {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('subject')}
                    >
                      Subject {sortColumn === 'subject' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      Date & Time {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('totalPrice')}
                    >
                      Amount {sortColumn === 'totalPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBookings.length > 0 ? (
                    paginatedBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                        <TableCell>{booking.studentId}</TableCell>
                        <TableCell>{booking.tutorName}</TableCell>
                        <TableCell>{booking.subject}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(booking.date)}</p>
                            <p className="text-muted-foreground">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">${booking.totalPrice}</TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewBookingModal(booking)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {booking.status === 'upcoming' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCancelModal(booking)}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                            {booking.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRefund(booking)}
                              >
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No bookings found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="perPage" className="text-sm">Show:</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger id="perPage" className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Booking Modal */}
        <Dialog open={!!viewBookingModal} onOpenChange={() => setViewBookingModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Booking ID: {viewBookingModal?.id}</DialogDescription>
            </DialogHeader>
            {viewBookingModal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Student</Label>
                    <p className="font-medium">{viewBookingModal.studentId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tutor</Label>
                    <p className="font-medium">{viewBookingModal.tutorName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Subject</Label>
                    <p className="font-medium">{viewBookingModal.subject}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Duration</Label>
                    <p className="font-medium">{viewBookingModal.duration} minutes</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <p className="font-medium">{formatDate(viewBookingModal.date)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Time</Label>
                    <p className="font-medium">
                      {formatTime(viewBookingModal.startTime)} - {formatTime(viewBookingModal.endTime)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <StatusBadge status={viewBookingModal.status} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Total Amount</Label>
                    <p className="font-bold text-lg">${viewBookingModal.totalPrice}</p>
                  </div>
                </div>
                {viewBookingModal.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Notes</Label>
                    <p className="mt-1 text-sm p-3 bg-muted rounded-md">{viewBookingModal.notes}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewBookingModal(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirmation */}
        <ConfirmModal
          open={!!cancelModal}
          onOpenChange={() => setCancelModal(null)}
          title="Cancel Booking"
          description={`Are you sure you want to cancel this booking? The student will be notified.`}
          confirmText="Cancel Booking"
          onConfirm={handleCancelBooking}
          variant="destructive"
        />
      </div>
    </div>
  )
}
