"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, X } from "lucide-react"
import { supabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface ChatHeaderProps {
  matchId: string
  otherUser: any
}

export function ChatHeader({ matchId, otherUser }: ChatHeaderProps) {
  const router = useRouter()

  const endChat = async () => {
    try {
      // Update the match status to ended
      const { error } = await supabaseClient
        .from("chat_matches")
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", matchId)

      if (error) throw error

      toast({
        title: "Chat ended",
        description: "The chat has been ended successfully",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error ending chat:", error)
      toast({
        title: "Error",
        description: "Failed to end the chat",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">BTech Connect</h1>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{otherUser?.full_name?.charAt(0) || "U"}</AvatarFallback>
            {otherUser?.avatar_url && <AvatarImage src={otherUser.avatar_url} />}
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{otherUser?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {otherUser?.college} • {otherUser?.branch}
            </p>
          </div>
        </div>

        <Button variant="destructive" size="sm" onClick={endChat}>
          <X className="h-4 w-4 mr-1" /> End Chat
        </Button>
      </div>
    </header>
  )
}
