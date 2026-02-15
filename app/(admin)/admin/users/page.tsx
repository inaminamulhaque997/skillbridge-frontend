'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/admin/status-badge'
import { ConfirmModal } from '@/components/admin/confirm-modal'
import { getAllUsers, banUser, unbanUser, deleteUser, updateUserRole } from '@/services/admin'
import { PlatformUser } from '@/types/admin'
import { Search, Download, Ban, CheckCircle, Trash2, Edit, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const [users] = useState<PlatformUser[]>(getAllUsers())
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [viewUserModal, setViewUserModal] = useState<PlatformUser | null>(null)
  const [editUserModal, setEditUserModal] = useState<PlatformUser | null>(null)
  const [banModal, setBanModal] = useState<PlatformUser | null>(null)
  const [banReason, setBanReason] = useState('')
  const [deleteModal, setDeleteModal] = useState<PlatformUser | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleBanUser = () => {
    if (banModal && banReason.trim()) {
      banUser(banModal.id, banReason)
      toast.success(`User ${banModal.name} has been banned`)
      setBanModal(null)
      setBanReason('')
    }
  }

  const handleUnbanUser = (user: PlatformUser) => {
    unbanUser(user.id)
    toast.success(`User ${user.name} has been unbanned`)
  }

  const handleDeleteUser = () => {
    if (deleteModal) {
      deleteUser(deleteModal.id)
      toast.success(`User ${deleteModal.name} has been deleted`)
      setDeleteModal(null)
    }
  }

  const handleBulkBan = () => {
    selectedUsers.forEach((userId) => banUser(userId, 'Bulk action'))
    toast.success(`${selectedUsers.length} users have been banned`)
    setSelectedUsers([])
  }

  const handleBulkUnban = () => {
    selectedUsers.forEach((userId) => unbanUser(userId))
    toast.success(`${selectedUsers.length} users have been unbanned`)
    setSelectedUsers([])
  }

  const handleExport = () => {
    toast.success('Exporting user list...')
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-lg text-muted-foreground">
            Manage all platform users
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>{filteredUsers.length} users found</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedUsers.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleBulkBan}>
                      <Ban className="mr-2 h-4 w-4" />
                      Ban Selected ({selectedUsers.length})
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBulkUnban}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Unban Selected
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.split(' ').map((n) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.role as any} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">{user.sessionsCount || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewUserModal(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditUserModal(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status === 'active' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setBanModal(user)}
                              >
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUnbanUser(user)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteModal(user)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No users found matching your filters
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

        {/* View User Modal */}
        <Dialog open={!!viewUserModal} onOpenChange={() => setViewUserModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {viewUserModal && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={viewUserModal.avatar} alt={viewUserModal.name} />
                    <AvatarFallback>
                      {viewUserModal.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{viewUserModal.name}</p>
                    <p className="text-sm text-muted-foreground">{viewUserModal.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-xs text-muted-foreground">Role</Label>
                    <p className="font-medium capitalize">{viewUserModal.role}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <p className="font-medium capitalize">{viewUserModal.status}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Joined</Label>
                    <p className="font-medium">
                      {new Date(viewUserModal.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Sessions</Label>
                    <p className="font-medium">{viewUserModal.sessionsCount || 0}</p>
                  </div>
                  {viewUserModal.totalSpent && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Total Spent</Label>
                      <p className="font-medium">${viewUserModal.totalSpent}</p>
                    </div>
                  )}
                  {viewUserModal.lastActive && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Active</Label>
                      <p className="font-medium">
                        {new Date(viewUserModal.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={!!editUserModal} onOpenChange={() => setEditUserModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user role or status</DialogDescription>
            </DialogHeader>
            {editUserModal && (
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={editUserModal.name} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={editUserModal.email} disabled />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select defaultValue={editUserModal.role}>
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditUserModal(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success('User updated successfully')
                  setEditUserModal(null)
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ban User Modal */}
        <Dialog open={!!banModal} onOpenChange={() => setBanModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription>
                Please provide a reason for banning {banModal?.name}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="ban-reason">Reason</Label>
              <Textarea
                id="ban-reason"
                placeholder="Enter reason for ban..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBanModal(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBanUser} disabled={!banReason.trim()}>
                Ban User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <ConfirmModal
          open={!!deleteModal}
          onOpenChange={() => setDeleteModal(null)}
          title="Delete User"
          description={`Are you sure you want to delete ${deleteModal?.name}? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDeleteUser}
          variant="destructive"
        />
      </div>
    </div>
  )
}
