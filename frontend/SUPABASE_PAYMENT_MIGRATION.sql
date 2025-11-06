-- Add payment columns to teams table
ALTER TABLE teams
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add index for faster payment lookups
CREATE INDEX IF NOT EXISTS idx_teams_payment_id ON teams(payment_id);
CREATE INDEX IF NOT EXISTS idx_teams_order_id ON teams(order_id);
CREATE INDEX IF NOT EXISTS idx_teams_payment_status ON teams(payment_status);

-- Update existing records to have 'completed' status if they have a total_fee
UPDATE teams
SET payment_status = 'completed'
WHERE payment_status = 'pending' AND total_fee > 0;

-- Add comment to columns
COMMENT ON COLUMN teams.payment_id IS 'Razorpay payment ID';
COMMENT ON COLUMN teams.order_id IS 'Razorpay order ID';
COMMENT ON COLUMN teams.payment_status IS 'Payment status: pending, completed, failed';
