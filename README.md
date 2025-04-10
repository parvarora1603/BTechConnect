# BTech Connect

BTech Connect is a platform that allows BTech students in India to connect with each other through video and text chat. The platform includes student ID verification to ensure a safe and trusted environment.

## Features

- **User Authentication**: Secure authentication using Clerk
- **Student Verification**: Admin panel to verify student IDs
- **Video Chat**: Real-time video chat using LiveKit
- **Text Chat**: Text messaging between matched students
- **Matching Algorithm**: Connect students based on college, branch, or interests
- **Analytics**: Track platform usage and user engagement

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS, shadcn/ui
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Video Chat**: LiveKit
- **Deployment**: Vercel

## Project Structure

```
btech-connect/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel
│   ├── api/                # API routes
│   ├── chat/               # Chat pages
│   ├── dashboard/          # User dashboard
│   ├── onboarding/         # User onboarding
│   ├── sign-in/            # Authentication pages
│   ├── sign-up/            # Authentication pages
│   └── verification-pending/ # Verification status page
├── components/             # React components
│   ├── admin/              # Admin components
│   ├── analytics/          # Analytics components
│   ├── chat/               # Chat components
│   ├── dashboard/          # Dashboard components
│   ├── ui/                 # UI components (shadcn/ui)
│   └── video-chat/         # Video chat components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
│   ├── analytics.ts        # Analytics utilities
│   ├── database.types.ts   # Supabase database types
│   ├── livekit.ts          # LiveKit utilities
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # General utilities
├── public/                 # Static assets
└── supabase/               # Supabase migrations and functions
    ├── functions/          # Database functions
    └── migrations/         # Database migrations
```
## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Clerk account
- LiveKit account
- Vercel account (for deployment)

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# LiveKit
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
\`\`\`

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/btech-connect.git
   cd btech-connect
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/`
3. Create storage buckets for `avatars` and `student-ids`
4. Set up the appropriate storage policies

### Deployment

1. Push your code to GitHub
2. Create a new Vercel project
3. Connect your GitHub repository
4. Add the environment variables
5. Deploy!

## Admin Setup

To create an admin user:

1. Register a new user through the application
2. Complete the onboarding process
3. In the Supabase dashboard, update the user's record in the `user_profiles` table:
   \`\`\`sql
   UPDATE user_profiles
   SET is_admin = true, verification_status = 'approved'
   WHERE user_id = 'your_user_id';
   \`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
