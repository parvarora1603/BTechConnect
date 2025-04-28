import { AccessToken } from "livekit-server-sdk"

// Create a LiveKit token for a user
export function createLivekitToken(userId: string, name: string, room: string) {
  // Check if the required environment variables are set
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    throw new Error("LiveKit API key and secret are required")
  }

  // Create a new token
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: userId,
    name: name,
  })

  // Grant permissions to the room
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true })

  // Generate the token
  return at.toJwt()
}
