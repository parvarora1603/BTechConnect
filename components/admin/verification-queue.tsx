"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { supabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

type VerificationItem = {
  id: number
  user_id: string
  full_name: string
  email: string
  college: string
  branch: string
  year: string
  student_id_url: string | null
  created_at: string
}

export function VerificationQueue() {
  const [isLoading, setIsLoading] = useState(true)
  const [pendingVerifications, setPendingVerifications] = useState<VerificationItem[]>([])
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchPendingVerifications()
  }, [])

  async function fetchPendingVerifications() {
    setIsLoading(true)

    try {
      const { data, error } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("verification_status", "pending")
        .order("created_at", { ascending: false })

      if (error) throw error

      setPendingVerifications(data || [])
    } catch (error) {
      console.error("Error fetching verifications:", error)
      toast({
        title: "Error",
        description: "Failed to load verification queue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerification(userId: string, status: "approved" | "rejected") {
    setIsProcessing(true)

    try {
      const { error } = await supabaseClient
        .from("user_profiles")
        .update({ verification_status: status })
        .eq("user_id", userId)

      if (error) throw error

      // Remove the item from the list
      setPendingVerifications((prev) => prev.filter((item) => item.user_id !== userId))
      setIsDialogOpen(false)

      toast({
        title: status === "approved" ? "User Approved" : "User Rejected",
        description: `User has been ${status} successfully`,
        variant: status === "approved" ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error updating verification:", error)
      toast({
        title: "Error",
        description: "Failed to process verification",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  function viewStudentId(item: VerificationItem) {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (pendingVerifications.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-xl font-medium mb-2">All caught up!</h3>
        <p className="text-muted-foreground">There are no pending verifications at the moment.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Student</th>
              <th className="text-left py-3 px-4 font-medium">College</th>
              <th className="text-left py-3 px-4 font-medium">Branch</th>
              <th className="text-left py-3 px-4 font-medium">Year</th>
              <th className="text-left py-3 px-4 font-medium">Submitted</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingVerifications.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{item.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.full_name}</p>
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{item.college}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline">{item.branch}</Badge>
                </td>
                <td className="py-3 px-4">{item.year}st Year</td>
                <td className="py-3 px-4">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => viewStudentId(item)}>
                      <Eye className="h-4 w-4 mr-1" /> View ID
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student ID Verification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Verify Student ID</DialogTitle>
            <DialogDescription>Review the student ID and approve or reject the verification request.</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Student Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{selectedItem.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedItem.full_name}</p>
                        <p className="text-sm text-muted-foreground">{selectedItem.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">College</p>
                        <p>{selectedItem.college}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Branch</p>
                        <p>{selectedItem.branch}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p>{selectedItem.year}st Year</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p>{new Date(selectedItem.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Student ID</h3>
                  {selectedItem.student_id_url ? (
                    <div className="border rounded-md overflow-hidden">
                      <Image
                        src={selectedItem.student_id_url || "/placeholder.svg"}
                        alt="Student ID"
                        width={400}
                        height={300}
                        className="w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 text-center text-muted-foreground">
                      No student ID uploaded
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleVerification(selectedItem.user_id, "rejected")}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
                <Button onClick={() => handleVerification(selectedItem.user_id, "approved")} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
