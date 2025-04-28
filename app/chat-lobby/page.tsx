"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Users, School, BookOpen, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { UserButton, useUser } from "@clerk/nextjs"
import { supabaseClient } from "@/lib/supabase"

// Create a separate component for any part that might use useSearchParams
function ChatLobbyContent() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(true)
  const [matchType, setMatchType] = useState<"random" | "college" | "branch" | "interest">("random")
  const [formData, setFormData] = useState({
    college: "",
    branch: "",
    year: "",
  })

  useEffect(() => {
    // Check if the user has completed their profile
    const checkProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabaseClient
          .from("user_profiles")
          .select("college, branch, year")
          .eq("user_id", user.id)
          .single()

        if (error) throw error

        // If any of these fields are empty, the profile is incomplete
        if (!data.college || !data.branch || !data.year) {
          setIsProfileComplete(false)
          setFormData({
            college: data.college || "",
            branch: data.branch || "",
            year: data.year || "",
          })
        }
      } catch (error) {
        console.error("Error checking profile:", error)
      }
    }

    checkProfile()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const completeProfile = async () => {
    if (!user) return

    // Validate all fields are filled
    if (!formData.college || !formData.branch || !formData.year) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabaseClient
        .from("user_profiles")
        .update({
          college: formData.college,
          branch: formData.branch,
          year: formData.year,
        })
        .eq("user_id", user.id)

      if (error) throw error

      setIsProfileComplete(true)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  // If profile is incomplete, show the profile completion form
  if (!isProfileComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Please provide your academic information to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="college" className="text-sm font-medium">
              College/University
            </label>
            <input
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Enter your college name"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={(e) => handleSelectChange("branch", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select your branch
              </option>
              <option value="cse">Computer Science</option>
              <option value="it">Information Technology</option>
              <option value="ece">Electronics & Communication</option>
              <option value="ee">Electrical Engineering</option>
              <option value="me">Mechanical Engineering</option>
              <option value="ce">Civil Engineering</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-medium">
              Year of Study
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={(e) => handleSelectChange("year", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select your year
              </option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <Button
            onClick={completeProfile}
            className="w-full"
            disabled={isLoading || !formData.college || !formData.branch || !formData.year}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Chat"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // If profile is complete, show the match finder
  return (
    <Card className="max-w-3xl mx-auto">
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
              <p className="text-muted-foreground mb-6">Connect with any BTech student from across India</p>
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
              <p className="text-muted-foreground mb-6">Connect with BTech students from your college</p>
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
              <p className="text-muted-foreground mb-6">Connect with BTech students studying the same branch</p>
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

// This component doesn't use useSearchParams, so it's safe to use at the top level
function ChatLobbyHeader() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">BTech Connect</h1>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}

export default function ChatLobbyPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ChatLobbyHeader />
      <main className="container mx-auto py-8 px-4">
        <Suspense fallback={<div className="text-center py-12">Loading chat lobby...</div>}>
          <ChatLobbyContent />
        </Suspense>
      </main>
    </div>
  )
}
