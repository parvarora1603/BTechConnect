import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"
import { DashboardHeader } from "@/components/dashboard/header"
import { MatchFinder } from "@/components/dashboard/match-finder"
import { UserProfile } from "@/components/dashboard/user-profile"
import { RecentMatches } from "@/components/dashboard/recent-matches"

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Get the user profile
  const { data: profile } = await supabaseAdmin.from("user_profiles").select("*").eq("user_id", user.id).single()

  // If the user doesn't have a profile, redirect to onboarding
  if (!profile) {
    redirect("/onboarding")
  }

  // If the user is not verified, redirect to verification pending
  if (profile.verification_status === "pending") {
    redirect("/verification-pending")
  }

  // If the user is rejected, redirect to a rejection page
  if (profile.verification_status === "rejected") {
    redirect("/verification-rejected")
  }

  // Get the user preferences
  const { data: preferences } = await supabaseAdmin.from("user_preferences").select("*").eq("user_id", user.id).single()

  // If the user doesn't have preferences, create default preferences
  if (!preferences) {
    await supabaseAdmin.from("user_preferences").insert({
      user_id: user.id,
      match_same_college: false,
      match_same_branch: false,
      match_same_year: false,
    })
  }

  // Get recent matches
  const { data: recentMatches } = await supabaseAdmin
    .from("chat_matches")
    .select(`
      *,
      user1:user1_id(user_id, full_name, college, branch, avatar_url),
      user2:user2_id(user_id, full_name, college, branch, avatar_url)
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <MatchFinder profile={profile} preferences={preferences || {}} />
            <RecentMatches matches={recentMatches || []} currentUserId={user.id} />
          </div>

          <div>
            <UserProfile profile={profile} preferences={preferences || {}} />
          </div>
        </div>
      </main>
    </div>
  )
}
