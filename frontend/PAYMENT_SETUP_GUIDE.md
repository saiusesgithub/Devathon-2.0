# Payment Integration Database Migration

## Quick Setup

### Step 1: Run SQL Migration in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `SUPABASE_PAYMENT_MIGRATION.sql`
4. Click **Run** to execute

### Step 2: Verify Migration

Run this query to check if columns were added:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'teams'
ORDER BY ordinal_position;
```

You should see:
- `payment_id` (text)
- `order_id` (text)
- `payment_status` (text, default: 'pending')

### Step 3: Test the Integration

1. **Start Backend Server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Registration:**
   - Go to http://localhost:3000/register
   - Fill in team details (minimum 2 members)
   - Click "Pay ₹X"
   - Use test card: **4111 1111 1111 1111**
   - CVV: 123, Expiry: Any future date
   - Complete payment

4. **Verify Success:**
   - Check for success toast with payment details
   - Verify button returns to normal state
   - Check Supabase `teams` table for payment_id, order_id, and payment_status

## What's Fixed

### ✅ Button Stuck Issue
- Added `finally` block to always reset `isSubmitting` state
- Button will no longer stay stuck on "Processing..."
- Works even if payment handler throws errors

### ✅ Payment Details in Database
- **payment_id**: Razorpay payment ID (e.g., pay_xxx)
- **order_id**: Razorpay order ID (e.g., order_xxx)
- **payment_status**: 'pending', 'completed', or 'failed'

### ✅ Enhanced Success Message
- Shows payment ID (first 15 characters)
- Shows amount paid
- Shows team name
- Displays for 6 seconds

### ✅ Admin Dashboard Updates
- Payment details section for each team
- Shows payment ID and order ID
- Displays payment status badge
- Shows amount paid

## Database Schema

```sql
teams table:
├── id (uuid, primary key)
├── team_name (text)
├── institution (text)
├── leader_name (text)
├── leader_email (text, unique)
├── leader_phone (text)
├── total_members (integer)
├── total_fee (integer)
├── payment_id (text) ← NEW
├── order_id (text) ← NEW
├── payment_status (text, default: 'pending') ← NEW
├── is_present (boolean, default: false)
└── created_at (timestamp)
```

## Payment Flow

```
User fills form
    ↓
Frontend validates (min 2 members)
    ↓
Backend creates Razorpay order
    ↓
Razorpay checkout modal opens
    ↓
User completes payment
    ↓
Backend verifies payment signature
    ↓
Frontend saves to Supabase with payment details
    ↓
Success toast shows payment info
    ↓
Button resets to normal state
```

## Error Handling

All errors now properly reset the button:
- Payment cancelled → Button resets
- Verification fails → Button resets
- Database error → Button resets
- Network error → Button resets

## Admin Dashboard Features

View payment details for each team:
- ✅ Payment ID (full Razorpay ID)
- ✅ Order ID (full Razorpay order ID)
- ✅ Payment Status (color-coded badge)
- ✅ Amount Paid (highlighted in green)

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database migration executed
- [ ] Test payment with card 4111 1111 1111 1111
- [ ] Success toast appears with payment details
- [ ] Button returns to "Pay ₹X" state after success/failure
- [ ] Data appears in Supabase with payment_id and order_id
- [ ] Admin page shows payment details
- [ ] Payment status shows as "COMPLETED"

## Troubleshooting

### Button Still Stuck?
- Clear browser cache
- Check browser console for errors
- Ensure backend is running
- Verify Razorpay script loaded

### Payment Details Not Saving?
- Check Supabase columns exist
- Verify RLS policies allow INSERT
- Check browser console for errors
- Ensure payment verification succeeded

### Success Toast Not Showing?
- Check if Sonner is installed
- Verify toast.success is called
- Check browser console for errors
