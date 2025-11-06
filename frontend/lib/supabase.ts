import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export interface TeamRegistration {
  id?: string
  team_name: string
  institution: string
  leader_name: string
  leader_email: string
  leader_phone: string
  total_members: number
  total_fee: number
  payment_id?: string
  order_id?: string
  payment_status?: string
  is_present?: boolean
  created_at?: string
}

export interface TeamMember {
  id?: string
  team_id: string
  name: string
  email: string
  created_at?: string
}
