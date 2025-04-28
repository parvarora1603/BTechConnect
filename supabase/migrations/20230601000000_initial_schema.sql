-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  college TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  student_id_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_matches table
CREATE TABLE IF NOT EXISTS chat_matches (
  id BIGSERIAL PRIMARY KEY,
  user1_id TEXT NOT NULL,
  user2_id TEXT NOT NULL,
  match_type TEXT NOT NULL DEFAULT 'random' CHECK (match_type IN ('random', 'interest', 'college')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL REFERENCES chat_matches(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  match_same_college BOOLEAN NOT NULL DEFAULT false,
  match_same_branch BOOLEAN NOT NULL DEFAULT false,
  match_same_year BOOLEAN NOT NULL DEFAULT false,
  preferred_interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_verification_status ON user_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_chat_matches_user1_id ON chat_matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_chat_matches_user2_id ON chat_matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_chat_matches_status ON chat_matches(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_match_id ON chat_messages(match_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);

-- Create storage buckets
-- Note: This is a placeholder. In Supabase, you would create these buckets through the UI or API
-- INSERT INTO storage.buckets (id, name) VALUES ('avatars', 'User avatars');
-- INSERT INTO storage.buckets (id, name) VALUES ('student-ids', 'Student ID documents');
