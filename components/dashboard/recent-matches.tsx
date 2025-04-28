"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Video } from "lucide-react"

interface RecentMatchesProps {
  matches: any[]
  currentUserId: string
}

export function RecentMatches({ matches, currentUserId }: RecentMatchesProps) {
  if (!matches || matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Connections</CardTitle>
          <CardDescription>Your recent chat connections will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>You haven't connected with anyone yet.</p>
            <p>Use the match finder to start chatting!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Connections</CardTitle>
        <CardDescription>Your recent chat connections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => {
            // Determine which user is the other user
            const otherUser = match.user1.user_id === currentUserId ? match.user2 : match.user1

            return (
              <div key={match.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{otherUser.full_name.charAt(0)}</AvatarFallback>
                    {otherUser.avatar_url && <AvatarImage src={otherUser.avatar_url} />}
                  </Avatar>
                  <div>
                    <p className="font-medium">{otherUser.full_name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{otherUser.college}</span>
                      <span>•</span>
                      <span>{otherUser.branch}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {match.match_type === "random"
                          ? "Random"
                          : match.match_type === "college"
                            ? "College"
                            : match.match_type === "branch"
                              ? "Branch"
                              : "Interest"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(match.created_at).to}</span>
                    </div>
                  </div>
                </div>

                {match.status === "active" ? (
                  <Link href={`/chat/${match.id}`}>
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-1" /> Resume
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    <MessageSquare className="h-4 w-4 mr-1" /> Ended
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
