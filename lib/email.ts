import { Resend } from "resend"

// Initialize Resend with your API key, with a fallback for build time
const resendApiKey = process.env.RESEND_API_KEY || "dummy_key_for_build"
const resend = new Resend(resendApiKey)

// Helper function to check if we can send emails
function canSendEmails() {
  return process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "dummy_key_for_build"
}

// Email templates
export async function sendVerificationSuccessEmail(email: string, name: string) {
  if (!canSendEmails()) {
    console.log("Skipping email send: No API key available")
    return
  }

  try {
    await resend.emails.send({
      from: "BTech Connect <noreply@btechconnect.com>",
      to: email,
      subject: "Your BTech Connect Account is Verified",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">BTech Connect</h1>
          <p>Hello ${name},</p>
          <p>Great news! Your BTech Connect account has been verified. You can now start connecting with other BTech students across India.</p>
          <p>Here's what you can do now:</p>
          <ul>
            <li>Find peers from your college</li>
            <li>Connect with students in your branch</li>
            <li>Discover BTech students with similar interests</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://btechconnect.vercel.app"}/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Go to Dashboard</a>
          <p style="margin-top: 20px;">Happy connecting!</p>
          <p>The BTech Connect Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending verification success email:", error)
  }
}

export async function sendVerificationPendingEmail(email: string, name: string) {
  if (!canSendEmails()) {
    console.log("Skipping email send: No API key available")
    return
  }

  try {
    await resend.emails.send({
      from: "BTech Connect <noreply@btechconnect.com>",
      to: email,
      subject: "BTech Connect Account Verification Pending",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">BTech Connect</h1>
          <p>Hello ${name},</p>
          <p>Thank you for signing up for BTech Connect! We're currently verifying your account.</p>
          <p>Our system automatically verifies academic email addresses. Since your email wasn't automatically verified, an administrator will review your account manually.</p>
          <p>You'll receive another email once your account is verified.</p>
          <p style="margin-top: 20px;">Thank you for your patience!</p>
          <p>The BTech Connect Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending verification pending email:", error)
  }
}

export async function sendVerificationRejectedEmail(email: string, name: string) {
  if (!canSendEmails()) {
    console.log("Skipping email send: No API key available")
    return
  }

  try {
    await resend.emails.send({
      from: "BTech Connect <noreply@btechconnect.com>",
      to: email,
      subject: "BTech Connect Account Verification Status",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">BTech Connect</h1>
          <p>Hello ${name},</p>
          <p>We've reviewed your BTech Connect account application, and we're unable to verify your account at this time.</p>
          <p>BTech Connect is exclusively for BTech students in India. If you believe this is an error, please reply to this email with proof of your BTech student status.</p>
          <p style="margin-top: 20px;">Thank you for your understanding.</p>
          <p>The BTech Connect Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending verification rejected email:", error)
  }
}
