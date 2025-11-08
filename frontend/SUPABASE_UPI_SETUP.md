# Supabase Setup for UPI Payment System

## Quick Start

### 1. Run the UPI Migration

Go to your **Supabase Dashboard** → **SQL Editor** → **New Query**

Copy and paste the contents of `SUPABASE_UPI_MIGRATION.sql` and run it.

This will:
- ✅ Add `transaction_id` column to store UPI transaction IDs
- ✅ Update payment status logic for manual verification
- ✅ Add indexes for faster queries

---

## Database Schema

### Teams Table

```sql
teams (
  id UUID PRIMARY KEY,
  team_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL UNIQUE,
  leader_phone TEXT NOT NULL,
  total_members INTEGER NOT NULL,
  total_fee INTEGER NOT NULL,
  transaction_id TEXT,              -- UPI Transaction ID
  payment_status TEXT DEFAULT 'pending',  -- pending/verified/rejected
  is_present BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Team Members Table

```sql
team_members (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

---

## Payment Verification Workflow

1. **User Registers**: 
   - Pays via UPI
   - Enters transaction ID
   - Status: `pending`

2. **Admin Verifies**:
   - Check transaction ID in UPI app
   - Update status to `verified` or `rejected`

3. **Send Ticket**:
   - Email ticket to `leader_email`
   - Mark team as verified

---

## Admin Queries

### View Pending Payments

```sql
SELECT 
  team_name,
  leader_name,
  leader_email,
  leader_phone,
  total_fee,
  transaction_id,
  created_at
FROM teams
WHERE payment_status = 'pending'
ORDER BY created_at DESC;
```

### Verify Payment

```sql
UPDATE teams
SET payment_status = 'verified'
WHERE transaction_id = 'ENTER_TRANSACTION_ID_HERE';
```

### Reject Payment

```sql
UPDATE teams
SET payment_status = 'rejected'
WHERE transaction_id = 'ENTER_TRANSACTION_ID_HERE';
```

### Get Team Members

```sql
SELECT 
  t.team_name,
  t.leader_email,
  tm.name as member_name,
  tm.email as member_email
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
WHERE t.transaction_id = 'ENTER_TRANSACTION_ID_HERE';
```

---

## Environment Variables

Already configured in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eallcavtbkaalrvmubdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Row Level Security (RLS)

Already enabled with policies:
- ✅ Anyone can INSERT (register)
- ✅ Anyone can SELECT (read)
- ✅ Anyone can UPDATE (for payment verification)

---

## Testing

1. Register a test team
2. Enter a fake transaction ID
3. Check Supabase dashboard to see the data
4. Test verification by updating payment_status

---

## Backup Old Data (Optional)

If you have old Razorpay data and want to clean up:

```sql
-- Backup old payment columns
CREATE TABLE teams_backup AS
SELECT * FROM teams WHERE payment_id IS NOT NULL;

-- Then drop old columns
ALTER TABLE teams DROP COLUMN IF EXISTS payment_id;
ALTER TABLE teams DROP COLUMN IF EXISTS order_id;
```

