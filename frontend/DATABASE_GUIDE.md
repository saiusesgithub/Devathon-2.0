# 🗃️ Devathon Database Setup Guide

## ⚠️ IMPORTANT: Database Reset

This will **DELETE ALL EXISTING DATA** and create a fresh database structure.

---

## 📋 New Database Structure

### Single `teams` Table

All team information is stored in ONE table:

```sql
teams (
  id UUID PRIMARY KEY,
  
  -- Team Info
  team_name TEXT,
  college_name TEXT,
  
  -- Leader Info
  leader_name TEXT,
  leader_email TEXT UNIQUE,
  leader_phone TEXT,
  leader_roll_no TEXT,
  
  -- Team Members (JSON array)
  team_members JSONB,  -- [{ name, email, roll_no }, ...]
  
  -- Payment Info
  total_members INTEGER,
  total_fee INTEGER,
  upi_transaction_id TEXT,
  payment_status TEXT,  -- pending/verified/rejected
  
  -- Attendance
  is_present BOOLEAN,
  
  -- Timestamps
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Example Data

```json
{
  "team_name": "Code Warriors",
  "college_name": "VJIT",
  "leader_name": "John Doe",
  "leader_email": "john@example.com",
  "leader_phone": "+91 9876543210",
  "leader_roll_no": "21R11A0501",
  "team_members": [
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "roll_no": "21R11A0502"
    },
    {
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "roll_no": "21R11A0503"
    }
  ],
  "total_members": 3,
  "total_fee": 225,
  "upi_transaction_id": "123456789012",
  "payment_status": "pending",
  "is_present": false
}
```

---

## 🚀 Setup Instructions

### Step 1: Reset Database

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `DATABASE_RESET.sql`
4. Click **"Run"**
5. ✅ Your database is now reset!

### Step 2: Verify Setup

Run this query to check:

```sql
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'teams'
ORDER BY ordinal_position;
```

You should see all columns listed above.

---

## 📊 Admin Queries

### View All Registrations

```sql
SELECT 
  team_name,
  college_name,
  leader_name,
  leader_email,
  leader_phone,
  leader_roll_no,
  total_members,
  total_fee,
  upi_transaction_id,
  payment_status,
  is_present,
  created_at
FROM teams
ORDER BY created_at DESC;
```

### View Pending Payments

```sql
SELECT 
  team_name,
  leader_name,
  leader_email,
  leader_phone,
  total_fee,
  upi_transaction_id,
  created_at
FROM teams
WHERE payment_status = 'pending'
ORDER BY created_at DESC;
```

### View Team Members (Expanded)

```sql
SELECT 
  team_name,
  college_name,
  leader_name,
  leader_roll_no AS leader_roll,
  jsonb_array_elements(team_members) AS member_details
FROM teams
WHERE team_name = 'YOUR_TEAM_NAME';
```

### Get All Members of a Team

```sql
SELECT 
  team_name,
  leader_name,
  leader_email,
  leader_roll_no,
  (jsonb_array_elements(team_members)->>'name') AS member_name,
  (jsonb_array_elements(team_members)->>'email') AS member_email,
  (jsonb_array_elements(team_members)->>'roll_no') AS member_roll_no
FROM teams
WHERE upi_transaction_id = 'TRANSACTION_ID_HERE';
```

---

## ✅ Payment Verification

### Verify Payment

```sql
UPDATE teams
SET payment_status = 'verified'
WHERE upi_transaction_id = 'TRANSACTION_ID_HERE';
```

### Reject Payment

```sql
UPDATE teams
SET payment_status = 'rejected'
WHERE upi_transaction_id = 'TRANSACTION_ID_HERE';
```

### Bulk Verify Multiple Payments

```sql
UPDATE teams
SET payment_status = 'verified'
WHERE upi_transaction_id IN ('ID1', 'ID2', 'ID3');
```

---

## 📋 Attendance Management

### Mark Team as Present

```sql
UPDATE teams
SET is_present = true
WHERE team_name = 'TEAM_NAME_HERE';
```

### Mark Team as Present by Transaction ID

```sql
UPDATE teams
SET is_present = true
WHERE upi_transaction_id = 'TRANSACTION_ID_HERE';
```

### Get Present Teams

```sql
SELECT 
  team_name,
  college_name,
  leader_name,
  total_members
FROM teams
WHERE is_present = true;
```

---

## 📈 Statistics Queries

### Total Registrations

```sql
SELECT COUNT(*) as total_teams FROM teams;
```

### Total Revenue

```sql
SELECT SUM(total_fee) as total_revenue FROM teams;
```

### Verified Payments

```sql
SELECT COUNT(*) as verified_teams 
FROM teams 
WHERE payment_status = 'verified';
```

### College-wise Count

```sql
SELECT 
  college_name,
  COUNT(*) as team_count,
  SUM(total_members) as total_participants
FROM teams
GROUP BY college_name
ORDER BY team_count DESC;
```

### Payment Status Summary

```sql
SELECT 
  payment_status,
  COUNT(*) as count,
  SUM(total_fee) as total_amount
FROM teams
GROUP BY payment_status;
```

---

## 🔍 Search Queries

### Search by Email

```sql
SELECT * FROM teams
WHERE leader_email ILIKE '%example%';
```

### Search by Phone

```sql
SELECT * FROM teams
WHERE leader_phone LIKE '%987654%';
```

### Search by Team Name

```sql
SELECT * FROM teams
WHERE team_name ILIKE '%warriors%';
```

---

## 📧 Export for Email Campaign

### Get All Verified Team Leaders

```sql
SELECT 
  leader_name,
  leader_email,
  team_name,
  upi_transaction_id
FROM teams
WHERE payment_status = 'verified'
ORDER BY created_at;
```

### Export as CSV

In Supabase SQL Editor, after running a query, click **"Download CSV"** button.

---

## 🛠️ Maintenance

### Delete a Specific Team

```sql
DELETE FROM teams
WHERE id = 'UUID_HERE';
```

### Update Team Details

```sql
UPDATE teams
SET 
  leader_phone = 'NEW_PHONE',
  college_name = 'NEW_COLLEGE'
WHERE leader_email = 'email@example.com';
```

---

## 🔐 Environment Variables

Make sure these are in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eallcavtbkaalrvmubdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## ✅ Testing

1. Register a test team via the website
2. Check Supabase dashboard to see the data
3. Test updating payment_status
4. Test marking attendance

---

**Database is ready! 🚀**
