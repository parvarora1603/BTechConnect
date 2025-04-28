import { NextResponse } from "next/server"
import { isValidAcademicEmail } from "@/lib/email-verification"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const isAcademic = await isValidAcademicEmail(email)

    return NextResponse.json({ isAcademic })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}
