"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAnalytics } from "@/hooks/use-analytics"

export function DashboardAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // Track page view with path and query parameters
    const query = searchParams ? Object.fromEntries(searchParams.entries()) : {}
    trackEvent("page_view", { path: pathname, query })
  }, [pathname, searchParams, trackEvent])

  return null
}
