import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail } from "lucide-react"

export default function NonAcademicEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Mail className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Non-Academic Email Detected</CardTitle>
          <CardDescription>This platform is exclusively for BTech students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We've detected that you're not using an academic email address. BTech Connect is exclusively for BTech
            students in India.
          </p>
          <p className="text-muted-foreground text-sm">
            Please sign up with your college email address to access the platform. If you believe this is an error,
            please contact support.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
