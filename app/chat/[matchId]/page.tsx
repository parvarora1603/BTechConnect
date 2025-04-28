import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"
import { VideoChat } from "@/components/video-chat/video-chat"
import { ChatHeader } from "@/components/chat/chat-header"

interface ChatPageProps {
  params: {
    matchId: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { matchId } = params
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Check if the user has a profile
  const { data: profile } = await supabaseAdmin.from("user_profiles").select("*").eq("user_id", user.id).single()

  if (!profile) {
    redirect("/chat-lobby")
  }

  // Check if the match exists and the user is part of it
  const { data: match } = await supabaseAdmin
    .from("chat_matches")
    .select("*")
    .eq("id", matchId)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .single()

  if (!match) {
    redirect("/chat-lobby")
  }

  // Get the other user's profile
  const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id
  const { data: otherProfile } = await supabaseAdmin
    .from("user_profiles")
    .select("*")
    .eq("user_id", otherUserId)
    .single()

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader matchId={matchId} otherUser={otherProfile} />
      <main className="flex-1 overflow-hidden">
        <VideoChat matchId={matchId} />
      </main>
    </div>
  )
}
