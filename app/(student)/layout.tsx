import { StudentLayout } from '@/components/protected-layout'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StudentLayout>{children}</StudentLayout>
}
