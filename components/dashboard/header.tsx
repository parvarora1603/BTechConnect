"use client"
import { Suspense } from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { BookOpen, Bell, Shield } from "lucide-react"

interface DashboardHeaderProps {
  user: any
  profile: any
}

function HeaderContent({ user, profile }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">BTech Connect</h1>
        </div>

        <div className="flex items-center gap-4">
          {profile.is_admin && (
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-1" /> Admin
              </Button>
            </Link>
          )}
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  return (
    <Suspense
      fallback={
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">BTech Connect</h1>
            </div>
            <div className="h-8 w-8 rounded-full bg-muted"></div>
          </div>
        </header>
      }
    >
      <HeaderContent user={user} profile={profile} />
    </Suspense>
  )
}
