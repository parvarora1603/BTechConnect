import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, UserX, Users, BarChart } from "lucide-react"
import { AdminHeader } from "@/components/admin/header"
import { AdminStats } from "@/components/admin/stats"
import { UserManagement } from "@/components/admin/user-management"

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">180</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Users</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Users</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <UserX className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Chats</p>
                  <p className="text-2xl font-bold">38</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="stats">
          <TabsList className="mb-4">
            <TabsTrigger value="stats">Platform Stats</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>Overview of platform usage and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminStats />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
