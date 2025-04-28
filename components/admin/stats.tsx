"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type StatsData = {
  totalUsers: number
  verifiedUsers: number
  pendingUsers: number
  rejectedUsers: number
  totalMatches: number
  activeMatches: number
  totalMessages: number
  usersByCollege: { name: string; value: number }[]
  usersByBranch: { name: string; value: number }[]
  matchesByDay: { date: string; matches: number }[]
}

export function AdminStats() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setIsLoading(true)

    try {
      // In a real implementation, you would fetch this data from your API
      // For now, we'll use mock data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockStats: StatsData = {
        totalUsers: 192,
        verifiedUsers: 156,
        pendingUsers: 24,
        rejectedUsers: 12,
        totalMatches: 278,
        activeMatches: 38,
        totalMessages: 4256,
        usersByCollege: [
          { name: "IIT Delhi", value: 42 },
          { name: "IIT Bombay", value: 38 },
          { name: "NIT Trichy", value: 27 },
          { name: "BITS Pilani", value: 24 },
          { name: "VIT Vellore", value: 18 },
          { name: "Others", value: 43 },
        ],
        usersByBranch: [
          { name: "Computer Science", value: 68 },
          { name: "Electronics", value: 42 },
          { name: "Mechanical", value: 28 },
          { name: "Electrical", value: 24 },
          { name: "Civil", value: 18 },
          { name: "Others", value: 12 },
        ],
        matchesByDay: [
          { date: "May 1", matches: 12 },
          { date: "May 2", matches: 18 },
          { date: "May 3", matches: 15 },
          { date: "May 4", matches: 22 },
          { date: "May 5", matches: 28 },
          { date: "May 6", matches: 32 },
          { date: "May 7", matches: 24 },
        ],
      }

      setStats(mockStats)
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast({
        title: "Error",
        description: "Failed to load platform statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Matches</p>
            <p className="text-3xl font-bold">{stats.totalMatches}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Active Matches</p>
            <p className="text-3xl font-bold">{stats.activeMatches}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
            <p className="text-3xl font-bold">{stats.totalMessages}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matches">
        <TabsList>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Matches by Day</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.matchesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="matches" fill="#3b82f6" name="Matches" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Users by College</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.usersByCollege} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Users by Branch</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.usersByBranch} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name="Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
