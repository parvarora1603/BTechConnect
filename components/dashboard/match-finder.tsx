"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Users, School, BookOpen, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface MatchFinderProps {
  profile: any
  preferences: any
}

export function MatchFinder({ profile, preferences }: MatchFinderProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [matchType, setMatchType] = useState<"random" | "college" | "branch" | "interest">("random")

  const findMatch = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matchType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to find a match")
      }

      const data = await response.json()

      // Redirect to the chat page with the match ID
      router.push(`/chat/${data.match.id}`)
    } catch (error) {
      console.error("Error finding match:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to find a match",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find a BTech Peer</CardTitle>
        <CardDescription>Connect with other BTech students for a video or text chat</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="random" onValueChange={(value) => setMatchType(value as any)}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="random">
              <Sparkles className="h-4 w-4 mr-2" /> Random
            </TabsTrigger>
            <TabsTrigger value="college">
              <School className="h-4 w-4 mr-2" /> College
            </TabsTrigger>
            <TabsTrigger value="branch">
              <BookOpen className="h-4 w-4 mr-2" /> Branch
            </TabsTrigger>
            <TabsTrigger value="interest">
              <Users className="h-4 w-4 mr-2" /> Interests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="random">
            <div className="text-center py-6">
              <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Random Match</h3>
              <p className="text-muted-foreground mb-6">Connect with any verified BTech student from across India</p>
              <Button onClick={findMatch} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding a peer...
                  </>
                ) : (
                  "Find a Random Peer"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="college">
            <div className="text-center py-6">
              <School className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">College Match</h3>
              <p className="text-muted-foreground mb-6">Connect with BTech students from {profile.college}</p>
              <Button onClick={findMatch} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding a peer...
                  </>
                ) : (
                  "Find a College Peer"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="branch">
            <div className="text-center py-6">
              <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Branch Match</h3>
              <p className="text-muted-foreground mb-6">Connect with BTech students studying {profile.branch}</p>
              <Button onClick={findMatch} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding a peer...
                  </>
                ) : (
                  "Find a Branch Peer"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="interest">
            <div className="text-center py-6">
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Interest Match</h3>
              <p className="text-muted-foreground mb-6">Connect with BTech students who share your interests</p>
              <Button onClick={findMatch} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding a peer...
                  </>
                ) : (
                  "Find a Peer with Similar Interests"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
