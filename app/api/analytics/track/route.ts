import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { trackEvent } from "@/lib/analytics"

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the event data from the request body
    const { eventType, eventData } = await req.json()

    if (!eventType) {
      return NextResponse.json({ error: "Event type is required" }, { status: 400 })
    }

    // Track the event
    await trackEvent(user.id, eventType, eventData || {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking event:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
