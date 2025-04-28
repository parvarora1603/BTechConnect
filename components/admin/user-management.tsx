"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Search } from "lucide-react"
import { supabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

type UserItem = {
  id: number
  user_id: string
  full_name: string
  email: string
  college: string
  branch: string
  year: string
  verification_status: "pending" | "approved" | "rejected"
  created_at: string
}

export function UserManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<UserItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setIsLoading(true)

    try {
      const { data, error } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerificationUpdate(userId: string, status: "approved" | "rejected") {
    setIsProcessing(true)

    try {
      // First get the user details
      const { data: user, error: userError } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (userError) throw userError

      // Update the user status
      const { error } = await supabaseClient
        .from("user_profiles")
        .update({ verification_status: status })
        .eq("user_id", userId)

      if (error) throw error

      // Send email notification
      await fetch("/api/email/send-verification-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email: user.email,
          name: user.full_name,
          status,
        }),
      })

      // Update the user in the list
      setUsers((prev) =>
        prev.map((user) => (user.user_id === userId ? { ...user, verification_status: status } : user)),
      )

      toast({
        title: status === "approved" ? "User Approved" : "User Rejected",
        description: `User has been ${status} successfully`,
        variant: status === "approved" ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error updating verification:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.college.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">User</th>
              <th className="text-left py-3 px-4 font-medium">College</th>
              <th className="text-left py-3 px-4 font-medium">Branch</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Joined</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{user.college}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline">{user.branch}</Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      user.verification_status === "approved"
                        ? "success"
                        : user.verification_status === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {user.verification_status}
                  </Badge>
                </td>
                <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    {user.verification_status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleVerificationUpdate(user.user_id, "approved")}
                        disabled={isProcessing}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    {user.verification_status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleVerificationUpdate(user.user_id, "rejected")}
                        disabled={isProcessing}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
