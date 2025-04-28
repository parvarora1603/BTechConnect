import { Loader2 } from "lucide-react"

export default function ChatLobbyLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary/20 rounded-md animate-pulse"></div>
            <div className="h-6 w-32 bg-muted animate-pulse rounded-md"></div>
          </div>
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading chat lobby...</p>
        </div>
      </main>
    </div>
  )
}
