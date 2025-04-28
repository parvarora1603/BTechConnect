import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <SignUp
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
