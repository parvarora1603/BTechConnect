import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sendVerificationSuccessEmail, sendVerificationRejectedEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    // Get the current user (admin)
    const admin = await currentUser()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the current user is an admin
    const { data: adminData } = await supabaseAdmin
      .from("user_profiles")
      .select("is_admin")
      .eq("user_id", admin.id)
      .single()

    if (!adminData?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get the request body
    const { userId, email, name, status } = await req.json()

    if (!userId || !email || !name || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send the appropriate email based on the status
    try {
      if (status === "approved") {
        await sendVerificationSuccessEmail(email, name)
      } else if (status === "rejected") {
        await sendVerificationRejectedEmail(email, name)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      // Continue with the process even if email sending fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending verification update email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
