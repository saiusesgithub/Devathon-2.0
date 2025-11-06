# Database Schema Setup

Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

## 1. Create Teams Table

```sql
-- Create teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL UNIQUE,
  leader_phone TEXT NOT NULL,
  total_members INTEGER NOT NULL,
  total_fee INTEGER NOT NULL,
  is_present BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (public registration)
CREATE POLICY "Enable insert for all users" ON teams
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for all users
CREATE POLICY "Enable read access for all users" ON teams
  FOR SELECT USING (true);
```

## 2. Create Team Members Table

```sql
-- Create team_members table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone
CREATE POLICY "Enable insert for all users" ON team_members
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for all users
CREATE POLICY "Enable read access for all users" ON team_members
  FOR SELECT USING (true);

-- Add index for faster lookups
CREATE INDEX team_members_team_id_idx ON team_members(team_id);
```

## 3. Add Attendance Column (Run if table already exists)

If you already created the `teams` table without the `is_present` column, run this:

```sql
-- Add is_present column to existing teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS is_present BOOLEAN DEFAULT false;

-- Update policy to allow updates for attendance (admin use)
CREATE POLICY "Enable update for all users" ON teams
  FOR UPDATE USING (true);
```

## 4. Verify Tables

Run this to check if tables were created successfully:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('teams', 'team_members');
```

You should see both `teams` and `team_members` in the results.

## Getting Your API Keys

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **API**
3. Copy the following values:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Testing the Connection

After setting up, restart your Next.js dev server:

```bash
npm run dev
```

The registration form will now save data to Supabase when submitted!
