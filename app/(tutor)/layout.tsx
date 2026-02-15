import { TutorLayout } from '@/components/protected-layout'

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TutorLayout>{children}</TutorLayout>
}
