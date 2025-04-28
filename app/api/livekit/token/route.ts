import { type NextRequest, NextResponse } from "next/server"
import { createLivekitToken } from "@/lib/livekit"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the room from the request body
    const { room } = await req.json()
    if (!room) {
      return NextResponse.json({ error: "Room is required" }, { status: 400 })
    }

    // Get the user profile from Supabase
    const { data: profile } = await supabaseAdmin.from("user_profiles").select("*").eq("user_id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Create a LiveKit token
    const token = createLivekitToken(user.id, profile.full_name, room)

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error creating LiveKit token:", error)
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 })
  }
}
