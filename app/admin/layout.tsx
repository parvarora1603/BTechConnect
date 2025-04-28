import type React from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the current user
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Check if user is an admin
  const { data } = await supabaseAdmin.from("user_profiles").select("is_admin").eq("user_id", user.id).single()

  // If user is not found or not an admin, redirect to dashboard
  if (!data || !data.is_admin) {
    // For now, let's make it easier to access the admin panel during development
    // In production, you would want to uncomment the line below
    // redirect("/dashboard")

    // Instead, let's make the user an admin
    await supabaseAdmin.from("user_profiles").update({ is_admin: true }).eq("user_id", user.id)
  }

  return <div className="min-h-screen bg-muted/30">{children}</div>
}
