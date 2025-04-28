import { authMiddleware, clerkClient } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/api/webhooks/clerk", "/api/webhooks/livekit", "/non-academic-email"],

  async afterAuth(auth, req) {
    // If the user is authenticated and trying to access a protected route
    if (auth.userId && !auth.isPublicRoute) {
      try {
        // Get the user from Clerk
        const user = await clerkClient.users.getUser(auth.userId)

        // Check if the user has an academic email
        const isAcademicEmail = user.publicMetadata.is_academic_email

        // If the user doesn't have an academic email, redirect them to the non-academic-email page
        if (isAcademicEmail === false && req.nextUrl.pathname !== "/non-academic-email") {
          const nonAcademicEmailUrl = new URL("/non-academic-email", req.url)
          return NextResponse.redirect(nonAcademicEmailUrl)
        }
      } catch (error) {
        console.error("Error in middleware:", error)
      }
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
