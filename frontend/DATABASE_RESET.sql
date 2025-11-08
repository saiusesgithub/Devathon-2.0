-- ⚠️ COMPLETE DATABASE RESET - This will DELETE all existing data!
-- Run this in Supabase SQL Editor

-- 1. Drop existing tables
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- 2. Create new single teams table with all information
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Team Info
  team_name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  
  -- Leader Info
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL UNIQUE,
  leader_phone TEXT NOT NULL,
  leader_roll_no TEXT NOT NULL,
  
  -- Team Members (stored as JSON array)
  -- Each member: { name, email, roll_no }
  team_members JSONB DEFAULT '[]'::jsonb,
  
  -- Fee & Payment
  total_members INTEGER NOT NULL,
  total_fee INTEGER NOT NULL,
  upi_transaction_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  
  -- Attendance
  is_present BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Create indexes for better performance
CREATE INDEX idx_teams_leader_email ON teams(leader_email);
CREATE INDEX idx_teams_upi_transaction_id ON teams(upi_transaction_id);
CREATE INDEX idx_teams_payment_status ON teams(payment_status);
CREATE INDEX idx_teams_created_at ON teams(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public access
CREATE POLICY "Enable insert for all users" ON teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON teams
  FOR UPDATE USING (true);

-- 6. Add helpful comments
COMMENT ON TABLE teams IS 'Single table storing all team registration data';
COMMENT ON COLUMN teams.team_members IS 'JSON array of team members with name, email, roll_no';
COMMENT ON COLUMN teams.payment_status IS 'pending (awaiting verification), verified (payment confirmed), rejected (invalid payment)';
COMMENT ON COLUMN teams.upi_transaction_id IS 'UPI Transaction ID from Google Pay, PhonePe, etc.';

-- 7. Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Done! Your database is now reset with the new structure.
