import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "shadow-md rounded-lg",
          },
        }}
        redirectUrl="/chat-lobby"
      />
    </div>
  )
}
