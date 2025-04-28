import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the match preferences from the request body
    const { matchType = "random" } = await req.json()

    // Get the user profile
    const { data: profile } = await supabaseAdmin.from("user_profiles").select("*").eq("user_id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Get the user preferences
    const { data: preferences } = await supabaseAdmin
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()

    // Find a match based on the match type and preferences
    let matchQuery = supabaseAdmin.from("user_profiles").select("*").neq("user_id", user.id)

    // Apply filters based on match type
    if (matchType === "college" && profile.college) {
      matchQuery = matchQuery.eq("college", profile.college)
    } else if (matchType === "branch" && profile.branch) {
      matchQuery = matchQuery.eq("branch", profile.branch)
    } else if (
      matchType === "interest" &&
      preferences?.preferred_interests &&
      preferences.preferred_interests.length > 0
    ) {
      // This is a simplified approach - in a real app, you'd use a more sophisticated algorithm
      // to match based on overlapping interests
      matchQuery = matchQuery.contains("interests", preferences.preferred_interests)
    }

    // Get potential matches
    const { data: potentialMatches } = await matchQuery.limit(10)

    if (!potentialMatches || potentialMatches.length === 0) {
      return NextResponse.json(
        { error: "No matches found. Try a different match type or try again later." },
        { status: 404 },
      )
    }

    // Select a random match from the potential matches
    const randomMatch = potentialMatches[Math.floor(Math.random() * potentialMatches.length)]

    // Check if there's an existing active match between these users
    const { data: existingMatch } = await supabaseAdmin
      .from("chat_matches")
      .select("*")
      .or(
        `and(user1_id.eq.${user.id},user2_id.eq.${randomMatch.user_id}),and(user1_id.eq.${randomMatch.user_id},user2_id.eq.${user.id})`,
      )
      .eq("status", "active")
      .maybeSingle()

    if (existingMatch) {
      // Return the existing match
      return NextResponse.json({ match: existingMatch })
    }

    // Create a new match
    const { data: newMatch, error } = await supabaseAdmin
      .from("chat_matches")
      .insert({
        user1_id: user.id,
        user2_id: randomMatch.user_id,
        match_type: matchType,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log the match event for analytics
    await supabaseAdmin.from("analytics_events").insert({
      user_id: user.id,
      event_type: "match_created",
      event_data: {
        match_id: newMatch.id,
        match_type: matchType,
        other_user_id: randomMatch.user_id,
      },
    })

    return NextResponse.json({ match: newMatch })
  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 })
  }
}
