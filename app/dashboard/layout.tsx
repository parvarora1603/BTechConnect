import type React from "react"
import { Suspense } from "react"
import { DashboardAnalytics } from "@/components/analytics/dashboard-analytics"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardAnalytics />
      </Suspense>
      {children}
    </>
  )
}
