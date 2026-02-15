import { AdminLayout } from '@/components/protected-layout'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
