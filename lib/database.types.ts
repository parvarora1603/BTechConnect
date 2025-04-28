export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: number
          user_id: string
          email: string
          full_name: string
          college: string
          branch: string
          year: string
          bio: string | null
          avatar_url: string | null
          student_id_url: string | null
          verification_status: "pending" | "approved" | "rejected"
          interests: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          email: string
          full_name: string
          college: string
          branch: string
          year: string
          bio?: string | null
          avatar_url?: string | null
          student_id_url?: string | null
          verification_status?: "pending" | "approved" | "rejected"
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          email?: string
          full_name?: string
          college?: string
          branch?: string
          year?: string
          bio?: string | null
          avatar_url?: string | null
          student_id_url?: string | null
          verification_status?: "pending" | "approved" | "rejected"
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_matches: {
        Row: {
          id: number
          user1_id: string
          user2_id: string
          match_type: "random" | "interest" | "college"
          status: "active" | "ended"
          created_at: string
          ended_at: string | null
        }
        Insert: {
          id?: number
          user1_id: string
          user2_id: string
          match_type?: "random" | "interest" | "college"
          status?: "active" | "ended"
          created_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: number
          user1_id?: string
          user2_id?: string
          match_type?: "random" | "interest" | "college"
          status?: "active" | "ended"
          created_at?: string
          ended_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: number
          match_id: number
          sender_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: number
          match_id: number
          sender_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: number
          match_id?: number
          sender_id?: string
          message?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: number
          user_id: string
          match_same_college: boolean
          match_same_branch: boolean
          match_same_year: boolean
          preferred_interests: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          match_same_college?: boolean
          match_same_branch?: boolean
          match_same_year?: boolean
          preferred_interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          match_same_college?: boolean
          match_same_branch?: boolean
          match_same_year?: boolean
          preferred_interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: number
          user_id: string
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          event_type: string
          event_data: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
    }
  }
}
