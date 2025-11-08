-- Migration for UPI Payment System
-- Run this in Supabase SQL Editor to update your database for UPI payments

-- Remove Razorpay-specific columns (optional - only if you want to clean up)
-- Skip this if you want to keep old data
-- ALTER TABLE teams DROP COLUMN IF EXISTS payment_id;
-- ALTER TABLE teams DROP COLUMN IF EXISTS order_id;

-- Add transaction_id column for UPI payments
ALTER TABLE teams
ADD COLUMN IF NOT EXISTS transaction_id TEXT;

-- Update payment_status column comment
COMMENT ON COLUMN teams.payment_status IS 'Payment status: pending (awaiting verification), verified, rejected';

-- Add index for faster transaction ID lookups
CREATE INDEX IF NOT EXISTS idx_teams_transaction_id ON teams(transaction_id);

-- Update policy to allow updates for payment verification (admin use)
DROP POLICY IF EXISTS "Enable update for all users" ON teams;
CREATE POLICY "Enable update for all users" ON teams
  FOR UPDATE USING (true);

-- Optional: Update existing records
-- If you have old Razorpay data, you can set their status to 'verified'
-- UPDATE teams SET payment_status = 'verified' WHERE payment_id IS NOT NULL;

