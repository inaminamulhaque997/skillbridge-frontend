'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/admin/status-badge'
import { ConfirmModal } from '@/components/admin/confirm-modal'
import { getAllCategories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } from '@/services/admin'
import { SubjectCategory } from '@/types/admin'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const ICON_OPTIONS = ['🔢', '🔬', '💻', '🗣️', '💼', '🎨', '🎵', '📚', '⚽', '🧪', '📊', '🌍']

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<SubjectCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories()
        setCategories(data)
      } catch (error) {
        console.error('[SkillBridge] Error fetching categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<SubjectCategory | null>(null)
  const [deleteModal, setDeleteModal] = useState<SubjectCategory | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    icon: '🔢',
    description: '',
  })

  const resetForm = () => {
    setFormData({ name: '', icon: '🔢', description: '' })
  }

  const handleAdd = async () => {
    if (formData.name.trim() && formData.description.trim()) {
      try {
        const newCategory = await addCategory({
          ...formData,
          tutorCount: 0,
          status: 'active',
          order: categories.length + 1,
        })
        setCategories([...categories, newCategory])
        toast.success('Category added successfully')
        setAddModal(false)
        resetForm()
      } catch (error) {
        toast.error('Failed to add category')
      }
    }
  }

  const handleEdit = async () => {
    if (editModal && formData.name.trim() && formData.description.trim()) {
      try {
        await updateCategory(editModal.id, formData)
        setCategories(
          categories.map((cat) =>
            cat.id === editModal.id ? { ...cat, ...formData } : cat
          )
        )
        toast.success('Category updated successfully')
        setEditModal(null)
        resetForm()
      } catch (error) {
        toast.error('Failed to update category')
      }
    }
  }

  const handleDelete = async () => {
    if (deleteModal) {
      if (deleteModal.tutorCount > 0) {
        toast.error('Cannot delete category with assigned tutors')
        setDeleteModal(null)
        return
      }
      try {
        await deleteCategory(deleteModal.id)
        setCategories(categories.filter((cat) => cat.id !== deleteModal.id))
        toast.success('Category deleted successfully')
        setDeleteModal(null)
      } catch (error) {
        toast.error('Failed to delete category')
      }
    }
  }

  const handleToggleStatus = async (category: SubjectCategory) => {
    try {
      await toggleCategoryStatus(category.id)
      setCategories(
        categories.map((cat) =>
          cat.id === category.id
            ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
            : cat
        )
      )
      toast.success(`Category ${category.status === 'active' ? 'deactivated' : 'activated'}`)
    } catch (error) {
      toast.error('Failed to toggle category status')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/30 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Categories Management</h1>
          <p className="text-lg text-muted-foreground">
            Manage subject categories and their settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subject Categories</CardTitle>
                <CardDescription>{categories.length} categories configured</CardDescription>
              </div>
              <Button onClick={() => setAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tutors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <span className="text-2xl">{category.icon}</span>
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {category.description}
                      </TableCell>
                      <TableCell>{category.tutorCount}</TableCell>
                      <TableCell>
                        <StatusBadge status={category.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditModal(category)
                              setFormData({
                                name: category.name,
                                icon: category.icon,
                                description: category.description,
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(category)}
                          >
                            {category.status === 'active' ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteModal(category)}
                            disabled={category.tutorCount > 0}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Category Modal */}
        <Dialog open={addModal} onOpenChange={setAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new subject category</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="add-name">Name</Label>
                <Input
                  id="add-name"
                  placeholder="e.g., Mathematics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="add-icon">Icon</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-12 h-12 text-2xl border-2 rounded-md hover:border-primary transition-colors ${
                        formData.icon === icon ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  placeholder="Brief description of the category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setAddModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!formData.name.trim() || !formData.description.trim()}
              >
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Modal */}
        <Dialog open={!!editModal} onOpenChange={() => { setEditModal(null); resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-12 h-12 text-2xl border-2 rounded-md hover:border-primary transition-colors ${
                        formData.icon === icon ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditModal(null); resetForm(); }}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!formData.name.trim() || !formData.description.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <ConfirmModal
          open={!!deleteModal}
          onOpenChange={() => setDeleteModal(null)}
          title="Delete Category"
          description={
            deleteModal?.tutorCount
              ? `Cannot delete "${deleteModal.name}" because ${deleteModal.tutorCount} tutors are assigned to it.`
              : `Are you sure you want to delete "${deleteModal?.name}"? This action cannot be undone.`
          }
          confirmText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
    </div>
  )
}
