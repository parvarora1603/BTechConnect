"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface VideoChatProps {
  matchId: string
}

export function VideoChat({ matchId }: VideoChatProps) {
  const router = useRouter()
  const { user } = useUser()
  const [token, setToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchToken = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: `match-${matchId}`,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to get token")
        }

        const data = await response.json()
        setToken(data.token)
      } catch (err) {
        console.error("Error fetching token:", err)
        setError(err instanceof Error ? err.message : "Failed to join video chat")
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [user, matchId])

  const handleDisconnect = () => {
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Connecting to video chat...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    )
  }

  if (!token) {
    return null
  }

  return (
    <div className="h-full">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        onDisconnected={handleDisconnect}
        className="h-full"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  )
}
