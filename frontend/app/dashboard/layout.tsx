// Restore the original dashboard layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Common dashboard elements can go here if needed */}
      {children}
    </div>
  )
}