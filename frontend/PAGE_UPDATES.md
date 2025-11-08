# Page Updates for New Database Structure

## Updated Files

### 1. `/lib/supabase.ts` - Type Definitions
**Changes:**
- Updated `TeamRegistration` interface:
  - Changed `institution` → `college_name`
  - Added `leader_roll_no: string`
  - Changed `payment_id` → `upi_transaction_id`
  - Changed `order_id` removed (not needed)
  - Updated `payment_status` to: `'pending' | 'verified' | 'rejected'`
  - Added `team_members?: TeamMember[]` (JSONB array)

- Updated `TeamMember` interface:
  - Removed `id` field (no longer a separate table)
  - Removed `team_id` field (stored in parent team)
  - Added `roll_no: string`
  - Now represents JSONB structure: `{name, email, roll_no}`

### 2. `/app/register/success/page.tsx` - Payment Success Page
**Changes:**
- Updated `PaymentSuccessData` interface:
  - Removed `paymentId` and `orderId`
  - Added `transactionId` (UPI Transaction ID)

- Updated PDF Receipt Generation:
  - Changed "Payment ID" and "Order ID" to single "UPI Transaction ID"
  - Updated status badge from "COMPLETED" (green) to "PENDING VERIFICATION" (yellow)
  - Modified payment notes to reflect verification process

- Updated UI Display:
  - Changed heading from "Payment Successful!" to "Registration Submitted!"
  - Updated description to mention payment verification
  - Replaced dual payment ID cards with single UPI Transaction ID card
  - Changed status badge from "PAID" to "VERIFYING"
  - Updated "What's Next?" steps to reflect verification workflow:
    1. Team will verify UPI payment
    2. Ticket sent after verification
    3. Keep payment screenshot safe
    4. Check email for updates

### 3. `/app/9999/page.tsx` - Admin Dashboard
**Changes:**
- Updated Supabase Query:
  - Removed `.select('*, team_members (*)')` join
  - Now uses `.select('*')` (single table, JSONB members)

- Updated Statistics:
  - Replaced `completedPayments` with `verifiedPayments`
  - Added `rejectedPayments` count
  - Updated stats cards to show three payment states

- Updated Team Display:
  - Changed `team.institution` → `team.college_name`
  - Added leader roll number display: `team.leader_roll_no`
  - Updated member cards to show roll numbers: `member.roll_no`
  - Changed `key={member.id}` to `key={idx}` (no IDs in JSONB)

- Updated Payment Details Section:
  - Changed condition from `team.payment_id` to `team.upi_transaction_id`
  - Removed "Payment ID" and "Order ID" fields
  - Added "UPI Transaction ID" field
  - Updated status badges with three states:
    - **Verified** - Green
    - **Rejected** - Red
    - **Pending** - Yellow
  - Dynamic background colors based on payment status

## Database Structure Reference

### Old Structure (Two Tables)
```sql
-- teams table
teams (
  id, team_name, institution, leader_name, leader_email, 
  leader_phone, total_members, total_fee, payment_id, 
  order_id, payment_status, is_present
)

-- team_members table (separate)
team_members (
  id, team_id, name, email
)
```

### New Structure (Single Table with JSONB)
```sql
-- teams table (only)
teams (
  id, team_name, college_name, leader_name, leader_email, 
  leader_phone, leader_roll_no, total_members, total_fee, 
  upi_transaction_id, payment_status, is_present, created_at,
  team_members JSONB DEFAULT '[]'::jsonb
)

-- team_members JSONB structure
[
  {"name": "...", "email": "...", "roll_no": "..."},
  {"name": "...", "email": "...", "roll_no": "..."}
]
```

## Payment Flow Changes

### Before (Razorpay)
1. User fills form → Razorpay checkout
2. Payment completed → `payment_id` and `order_id` generated
3. Instant confirmation with "Payment Successful"
4. Download receipt with payment IDs

### After (UPI Direct)
1. User fills form → UPI payment modal (QR code or UPI link)
2. User manually enters UPI Transaction ID
3. Submission with "Registration Submitted" (pending verification)
4. Admin verifies payment manually
5. Email sent after verification

## Admin Actions Needed

To verify payments:
```sql
-- Verify a payment
UPDATE teams 
SET payment_status = 'verified' 
WHERE upi_transaction_id = 'TXNID12345';

-- Reject a payment
UPDATE teams 
SET payment_status = 'rejected' 
WHERE upi_transaction_id = 'TXNID12345';

-- View pending payments
SELECT team_name, college_name, leader_email, upi_transaction_id, total_fee
FROM teams 
WHERE payment_status = 'pending'
ORDER BY created_at DESC;
```

## Testing Checklist

- [ ] Success page displays UPI Transaction ID correctly
- [ ] PDF receipt shows "PENDING VERIFICATION" status
- [ ] Admin dashboard shows all three payment statuses
- [ ] Admin dashboard displays roll numbers for leader and members
- [ ] Team members list renders from JSONB array (not separate table)
- [ ] Payment details section shows correct color based on status
- [ ] College name displays instead of institution

## Notes
- All references to `institution` changed to `college_name`
- All references to `payment_id`/`order_id` changed to `upi_transaction_id`
- Team members no longer have individual IDs (array index used as key)
- Payment status now has 3 states instead of 2 (pending/verified/rejected)
