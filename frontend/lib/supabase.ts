import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export interface TeamRegistration {
  id?: string
  team_name: string
  college_name: string
  leader_name: string
  leader_email: string
  leader_phone: string
  leader_roll_no: string
  total_members: number
  total_fee: number
  upi_transaction_id?: string
  payment_status?: 'pending' | 'verified' | 'rejected'
  is_present?: boolean
  created_at?: string
  team_members?: TeamMember[]
}

export interface TeamMember {
  name: string
  email: string
  roll_no: string
}
