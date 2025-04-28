import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Video, Shield, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">BTech Connect</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect with BTech Students Across India</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A safe, verified platform exclusively for BTech students to meet, chat, and build connections with peers
              from different colleges.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sign Up with College Email</h3>
                <p className="text-muted-foreground">Register with your college email for instant verification.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Find Your Peers</h3>
                <p className="text-muted-foreground">
                  Get matched with other BTech students based on interests, branch, or random connections.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <Video className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect & Chat</h3>
                <p className="text-muted-foreground">
                  Start video chats, exchange messages, and build your professional network.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Connect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of BTech students already on the platform.
            </p>
            <Link href="/sign-up">
              <Button size="lg">Create Your Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} BTech Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
