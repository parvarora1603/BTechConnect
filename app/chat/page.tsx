"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Loader2, Video, VideoOff, Mic, MicOff, MessageSquare, Users, X } from "lucide-react"

export default function ChatPage() {
  const [isMatching, setIsMatching] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [matchTimer, setMatchTimer] = useState(0)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  // Simulate matching process
  const startMatching = () => {
    setIsMatching(true)
    setMatchTimer(0)

    // Simulate finding a match after random time (3-8 seconds)
    const matchTime = Math.floor(Math.random() * 5000) + 3000
    setTimeout(() => {
      setIsMatching(false)
      setIsConnected(true)
    }, matchTime)
  }

  // Update timer while matching
  useEffect(() => {
    let interval
    if (isMatching) {
      interval = setInterval(() => {
        setMatchTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isMatching])

  const endChat = () => {
    setIsConnected(false)
    setMessages([])
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setMessages((prev) => [...prev, { sender: "you", text: message }])
    setMessage("")

    // Simulate receiving a response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "peer",
          text: "That's interesting! I'm also studying BTech. What projects are you working on?",
        },
      ])
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">BTech Connect</h1>
          </div>
          <Button variant="outline" onClick={endChat}>
            Exit
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="video">
              <Video className="h-4 w-4 mr-2" /> Video Chat
            </TabsTrigger>
            <TabsTrigger value="text">
              <MessageSquare className="h-4 w-4 mr-2" /> Text Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="aspect-video overflow-hidden relative">
                <CardContent className="p-0 h-full bg-muted flex items-center justify-center">
                  {/* This would be your video stream in a real implementation */}
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <p className="text-muted-foreground">Your camera</p>
                  </div>

                  {/* Video controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      size="icon"
                      variant={videoEnabled ? "default" : "destructive"}
                      onClick={() => setVideoEnabled(!videoEnabled)}
                    >
                      {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant={audioEnabled ? "default" : "destructive"}
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="aspect-video overflow-hidden relative">
                <CardContent className="p-0 h-full bg-muted flex items-center justify-center">
                  {!isConnected && !isMatching && (
                    <div className="text-center">
                      <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-4">Ready to Connect?</h3>
                      <Button onClick={startMatching}>Find a BTech Peer</Button>
                    </div>
                  )}

                  {isMatching && (
                    <div className="text-center">
                      <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                      <h3 className="text-xl font-medium mb-2">Finding a peer...</h3>
                      <p className="text-muted-foreground">Searching for {matchTimer}s</p>
                    </div>
                  )}

                  {isConnected && (
                    <>
                      {/* This would be the peer's video stream in a real implementation */}
                      <div className="text-center">
                        <Avatar className="h-24 w-24 mx-auto mb-4">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" />
                          <AvatarFallback>Peer</AvatarFallback>
                        </Avatar>
                        <p className="text-muted-foreground">Rahul from IIT Delhi</p>
                      </div>

                      {/* End chat button */}
                      <Button size="icon" variant="destructive" className="absolute top-4 right-4" onClick={endChat}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-6">
            <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="p-4">
                {!isConnected && !isMatching && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-medium mb-4">Ready to Chat?</h3>
                    <Button onClick={startMatching}>Find a BTech Peer</Button>
                  </div>
                )}

                {isMatching && (
                  <div className="text-center py-12">
                    <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                    <h3 className="text-xl font-medium mb-2">Finding a peer...</h3>
                    <p className="text-muted-foreground">Searching for {matchTimer}s</p>
                  </div>
                )}

                {isConnected && (
                  <div className="flex flex-col h-[60vh]">
                    <div className="flex items-center gap-2 pb-4 border-b">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>R</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Rahul</p>
                        <p className="text-xs text-muted-foreground">IIT Delhi • Computer Science</p>
                      </div>
                      <Button size="sm" variant="destructive" className="ml-auto" onClick={endChat}>
                        End Chat
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <p>Say hello to start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                msg.sender === "you" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={sendMessage} className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button type="submit">Send</Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
