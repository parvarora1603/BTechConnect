# BTech Connect Architecture

## Authentication System: Clerk

Clerk is used as the primary authentication provider for BTech Connect. It handles:

1. **User Registration and Login**: Clerk manages the entire authentication flow, including sign-up, sign-in, and session management.

2. **Social Logins**: Clerk supports various social login providers like Google, GitHub, etc.

3. **User Management**: Clerk provides a dashboard for managing users, including features like blocking users, resetting passwords, etc.

4. **Security**: Clerk handles security best practices like password hashing, session management, and protection against common attacks.

5. **Webhooks**: Clerk sends webhook events when users are created, updated, or deleted, which we use to sync user data with Supabase.

## Database and Backend: Supabase

Su  or deleted, which we use to sync user data with Supabase.

## Database and Backend: Supabase

Supabase serves as the database and backend for BTech Connect. It handles:

1. **Data Storage**: Supabase provides a PostgreSQL database to store all application data, including user profiles, matches, messages, and analytics.

2. **User Profiles**: While Clerk handles authentication, Supabase stores additional user data like college, branch, year, and verification status.

3. **Real-time Features**: Supabase offers real-time subscriptions that can be used for features like chat messages and notifications.

4. **Storage**: Supabase provides storage for user avatars and other media.

5. **Row-Level Security**: Supabase implements row-level security policies to ensure users can only access data they're authorized to see.

6. **Serverless Functions**: Supabase Edge Functions can be used for custom backend logic.

## Integration Between Clerk and Supabase

The integration between Clerk and Supabase works as follows:

1. **User Registration**: When a user registers with Clerk, a webhook is triggered that creates a corresponding user profile in Supabase.

2. **Email Verification**: We use the swot-node library to verify if the user's email belongs to an academic institution. If it does, the user is automatically verified.

3. **User Session**: When a user logs in with Clerk, we use their user ID to fetch their profile data from Supabase.

4. **Authorization**: We use Clerk's session data to implement authorization in our Supabase queries, ensuring users can only access their own data.

## Video Chat: LiveKit

LiveKit provides the real-time video and audio communication features:

1. **WebRTC**: LiveKit handles the complexities of WebRTC for peer-to-peer communication.

2. **Room Management**: LiveKit manages video chat rooms for matched users.

3. **Scalability**: LiveKit's architecture ensures the video chat can scale to many concurrent users.

4. **Quality**: LiveKit optimizes video and audio quality based on network conditions.

## Deployment: Vercel

Vercel is used for deploying the Next.js application:

1. **Serverless Functions**: Vercel automatically converts API routes to serverless functions.

2. **Edge Network**: Vercel's global edge network ensures low latency for users across India.

3. **CI/CD**: Vercel integrates with GitHub for continuous deployment.

4. **Environment Variables**: Vercel securely manages environment variables for different environments.

## Automatic Email Verification Flow

Instead of manual verification of student ID cards, we've implemented automatic email verification:

1. When a user signs up, we check if their email domain belongs to an academic institution using the swot-node library and our custom list of Indian academic domains.

2. If the email is from a recognized academic domain, the user is automatically verified and can start using the platform immediately.

3. If the email is not recognized, the user's status remains "pending" and they can be manually verified by an admin if needed.

This approach simplifies the verification process while still ensuring that only BTech students can use the platform.
