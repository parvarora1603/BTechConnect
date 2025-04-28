import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { isValidAcademicEmail } from "@/lib/email-verification"

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing svix headers", {
        status: 400,
      })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

    let evt: WebhookEvent

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent
    } catch (err) {
      console.error("Error verifying webhook:", err)
      return new Response("Error verifying webhook", {
        status: 400,
      })
    }

    // Handle the webhook event
    const eventType = evt.type

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data

      // Get the primary email
      const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id)

      if (!primaryEmail) {
        return NextResponse.json({ success: false, error: "No primary email found" }, { status: 400 })
      }

      const email = primaryEmail.email_address
      const fullName = `${first_name || ""} ${last_name || ""}`.trim()

      // Check if the email is from an academic institution
      const isAcademic = await isValidAcademicEmail(email)

      if (!isAcademic) {
        // If not an academic email, update the user's metadata to indicate they're not verified
        try {
          // This is a server-side API call to Clerk
          const clerkApiKey = process.env.CLERK_SECRET_KEY
          const clerkApiUrl = `https://api.clerk.dev/v1/users/${id}/metadata`

          await fetch(clerkApiUrl, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${clerkApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              public_metadata: {
                is_academic_email: false,
              },
            }),
          })
        } catch (error) {
          console.error("Error updating Clerk metadata:", error)
        }

        // Return an error response
        return NextResponse.json(
          {
            success: false,
            error: "Email domain not recognized as an academic institution",
          },
          { status: 403 },
        )
      }

      try {
        // Create a user profile in Supabase - all users are automatically approved
        const { error } = await supabaseAdmin.from("user_profiles").insert({
          user_id: id,
          email: email,
          full_name: fullName,
          college: "", // Will be filled during onboarding
          branch: "", // Will be filled during onboarding
          year: "", // Will be filled during onboarding
          verification_status: "approved", // Auto-approve all users with academic emails
        })

        if (error) {
          console.error("Error creating user profile:", error)
          return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        // Update the user's metadata to indicate they're verified
        try {
          // This is a server-side API call to Clerk
          const clerkApiKey = process.env.CLERK_SECRET_KEY
          const clerkApiUrl = `https://api.clerk.dev/v1/users/${id}/metadata`

          await fetch(clerkApiUrl, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${clerkApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              public_metadata: {
                is_academic_email: true,
              },
            }),
          })
        } catch (error) {
          console.error("Error updating Clerk metadata:", error)
        }
      } catch (error) {
        console.error("Error in webhook processing:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unhandled error in webhook:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
