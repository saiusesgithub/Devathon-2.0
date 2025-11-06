# Backend Integration Guide

## Overview
The backend Express server has been integrated with the Next.js frontend to handle Razorpay payment processing.

## Setup Instructions

### 1. Backend Setup
Navigate to the backend folder and start the server:

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:5000`

### 2. Frontend Setup
The frontend is already configured. Just ensure your `.env.local` file has:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Rc6729blYXJNt1
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 3. Run Both Servers
You need to run both servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Payment Flow

1. **User fills registration form** → Validates minimum 2 members
2. **Clicks "Pay ₹X"** → Frontend calls backend `/api/payments/create-order`
3. **Backend creates Razorpay order** → Returns order details
4. **Razorpay checkout opens** → User completes payment
5. **Payment success** → Frontend calls `/api/payments/verify-payment`
6. **Backend verifies signature** → Confirms payment authenticity
7. **Frontend saves to Supabase** → Team and members data stored
8. **Success notification** → User sees confirmation

## API Endpoints

### POST /api/payments/create-order
Creates a new Razorpay order

**Request:**
```json
{
  "amount": 196
}
```

**Response:**
```json
{
  "id": "order_xyz",
  "amount": 19600,
  "currency": "INR",
  "receipt": "rcpt_xxx"
}
```

### POST /api/payments/verify-payment
Verifies payment signature

**Request:**
```json
{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "status": "ok"
}
```

## Environment Variables

### Backend (.env)
```
PORT=5000
RAZORPAY_KEY_ID=rzp_test_Rc6729blYXJNt1
RAZORPAY_KEY_SECRET=NG9SkZaL6Jfac9x9nz43LZJE
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://eallcavtbkaalrvmubdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Rc6729blYXJNt1
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Testing

### Test Cards
**Success:** 4111 1111 1111 1111
**CVV:** Any 3 digits
**Expiry:** Any future date

**Failure:** 4000 0000 0000 0002

## Security Notes

1. ✅ Payment verification done on backend
2. ✅ Signature validation using HMAC-SHA256
3. ✅ Data saved to Supabase only after successful payment
4. ⚠️ Currently using test mode keys
5. ⚠️ Remember to switch to live keys before production

## Deployment

For production:
1. Update `NEXT_PUBLIC_BACKEND_URL` to your deployed backend URL
2. Update `FRONTEND_URL` in backend .env to your deployed frontend URL
3. Switch to Razorpay live mode keys
4. Enable HTTPS on both servers

## Troubleshooting

**Payment modal doesn't open:**
- Ensure Razorpay script is loaded in layout.tsx
- Check browser console for errors
- Verify backend server is running

**Payment verification fails:**
- Check Razorpay secret key matches in backend .env
- Ensure CORS is configured correctly
- Verify signature generation logic

**Data not saving to Supabase:**
- Check Supabase connection in .env.local
- Verify RLS policies allow insert operations
- Check browser console for errors
