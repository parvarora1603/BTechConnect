import type React from "react"
import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"
import { MatchAnalytics } from "@/components/analytics/match-analytics"

interface ChatLayoutProps {
  children: React.ReactNode
  params: {
    matchId: string
  }
}

export default async function ChatLayout({ children, params }: ChatLayoutProps) {
  const { matchId } = params
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Get the match
  const { data: match } = await supabaseAdmin
    .from("chat_matches")
    .select("*")
    .eq("id", matchId)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .single()

  if (!match) {
    redirect("/chat-lobby")
  }

  // Determine the other user ID
  const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id

  return (
    <>
      <Suspense fallback={null}>
        <MatchAnalytics matchId={matchId} matchType={match.match_type} otherUserId={otherUserId} />
      </Suspense>
      {children}
    </>
  )
}
