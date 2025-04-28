"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Settings, Edit } from "lucide-react"
import { supabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface UserProfileProps {
  profile: any
  preferences: any
}

export function UserProfile({ profile, preferences }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    match_same_college: preferences.match_same_college || false,
    match_same_branch: preferences.match_same_branch || false,
    match_same_year: preferences.match_same_year || false,
  })

  const updatePreferences = async () => {
    try {
      setIsLoading(true)

      const { error } = await supabaseClient.from("user_preferences").upsert({
        user_id: profile.user_id,
        ...userPreferences,
      })

      if (error) throw error

      toast({
        title: "Preferences updated",
        description: "Your matching preferences have been updated",
      })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchChange = (field: string) => {
    setUserPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your profile and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
          </Avatar>
          <h3 className="text-xl font-medium">{profile.full_name}</h3>
          <p className="text-muted-foreground">{profile.email}</p>

          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Badge variant="outline">{profile.college}</Badge>
            <Badge variant="outline">{profile.branch}</Badge>
            <Badge variant="outline">{profile.year}st Year</Badge>
          </div>

          <Button variant="outline" size="sm" className="mt-4">
            <Edit className="h-4 w-4 mr-1" /> Edit Profile
          </Button>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-4 flex items-center">
            <Settings className="h-4 w-4 mr-1" /> Matching Preferences
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="match-college" className="flex-1">
                Match with same college
              </Label>
              <Switch
                id="match-college"
                checked={userPreferences.match_same_college}
                onCheckedChange={() => handleSwitchChange("match_same_college")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="match-branch" className="flex-1">
                Match with same branch
              </Label>
              <Switch
                id="match-branch"
                checked={userPreferences.match_same_branch}
                onCheckedChange={() => handleSwitchChange("match_same_branch")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="match-year" className="flex-1">
                Match with same year
              </Label>
              <Switch
                id="match-year"
                checked={userPreferences.match_same_year}
                onCheckedChange={() => handleSwitchChange("match_same_year")}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={updatePreferences} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
