"use client"

import { useUser } from "@clerk/nextjs"

export function useAnalytics() {
  const { user } = useUser()

  const trackEvent = async (eventType: string, eventData: any = {}) => {
    if (!user) return

    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType,
          eventData,
        }),
      })
    } catch (error) {
      console.error("Error tracking event:", error)
    }
  }

  return { trackEvent }
}
