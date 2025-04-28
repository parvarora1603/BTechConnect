"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAnalytics } from "@/hooks/use-analytics"

interface MatchAnalyticsProps {
  matchId: string
  matchType: string
  otherUserId: string
}

export function MatchAnalytics({ matchId, matchType, otherUserId }: MatchAnalyticsProps) {
  const { trackEvent } = useAnalytics()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track match join event with any query parameters
    const query = searchParams ? Object.fromEntries(searchParams.entries()) : {}

    trackEvent("match_joined", {
      match_id: matchId,
      match_type: matchType,
      other_user_id: otherUserId,
      query,
    })

    // Track match duration
    const startTime = Date.now()

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000) // Duration in seconds

      trackEvent("match_ended", {
        match_id: matchId,
        match_type: matchType,
        other_user_id: otherUserId,
        duration,
      })
    }
  }, [matchId, matchType, otherUserId, trackEvent, searchParams])

  return null
}
