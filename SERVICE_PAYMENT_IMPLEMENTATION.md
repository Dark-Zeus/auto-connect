# Service Payment Feature Implementation

## Overview
This document describes the implementation of the **Service Payment Feature** for the AutoConnect platform. This feature allows vehicle owners to pay for completed services using Stripe payment gateway.

---

## Architecture

### **Technology Stack**
- **Backend**: Node.js + Express + MongoDB + Stripe
- **Frontend**: React + Material-UI + Axios
- **Payment Gateway**: Stripe Checkout

### **Components Created**

#### **Backend**
1. **Model**: `ServicePayment.model.js` - MongoDB schema for payment records
2. **Controller**: `servicePayment.controller.js` - Business logic for payments
3. **Routes**: `servicePayment.route.js` - API endpoints

#### **Frontend**
1. **API Service**: `servicePaymentApi.js` - API client for payment operations
2. **Page**: `ServicePaymentSuccess.jsx` - Payment confirmation page
3. **Updated Component**: `MyBookingServices.jsx` - Added payment button

---

## Database Schema

### ServicePayment Model
```javascript
{
  paymentId: String,              // Unique payment ID (e.g., "PAY-LXQR3K2F-8H3ZP")
  booking: ObjectId,              // Reference to Booking
  serviceReport: ObjectId,        // Reference to ServiceReport
  customer: ObjectId,             // Reference to User (vehicle_owner)
  serviceCenter: ObjectId,        // Reference to User (service_center)
  amount: Number,                 // Payment amount in LKR
  currency: String,               // Default: "LKR"
  paymentStatus: String,          // PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
  paymentMethod: String,          // STRIPE, CASH, BANK_TRANSFER, OTHER
  stripeDetails: {
    sessionId: String,            // Stripe session ID
    paymentIntentId: String,      // Stripe payment intent ID
    chargeId: String             // Stripe charge ID
  },
  paymentInitiatedAt: Date,
  paymentCompletedAt: Date,
  transactionReference: String,
  metadata: {
    bookingId: String,
    serviceReportId: String,
    vehicleRegistration: String,
    serviceCenterName: String
  },
  isActive: Boolean
}
```

---

## API Endpoints

### Base URL: `/api/v1/service-payments`

#### 1. **Create Payment Session**
```
POST /create-session
```
**Authentication**: Required (Vehicle Owner only)

**Request Body**:
```json
{
  "bookingId": "6789abcdef123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment session created successfully",
  "data": {
    "sessionId": "cs_test_...",
    "sessionUrl": "https://checkout.stripe.com/...",
    "payment": {
      "paymentId": "PAY-LXQR3K2F-8H3ZP",
      "amount": 15000,
      "currency": "LKR",
      "status": "PROCESSING"
    }
  }
}
```

#### 2. **Verify Payment**
```
GET /verify?sessionId={stripe_session_id}
```
**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Payment verification successful",
  "data": {
    "payment": {
      "paymentId": "PAY-LXQR3K2F-8H3ZP",
      "amount": 15000,
      "currency": "LKR",
      "status": "COMPLETED",
      "paymentCompletedAt": "2025-01-20T10:30:00.000Z"
    },
    "stripeStatus": "paid"
  }
}
```

#### 3. **Get Payment by Booking**
```
GET /booking/:bookingId
```
**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Payment details retrieved successfully",
  "data": {
    "payment": {
      "paymentId": "PAY-LXQR3K2F-8H3ZP",
      "amount": 15000,
      "paymentStatus": "COMPLETED",
      "booking": { ... },
      "serviceReport": { ... }
    }
  }
}
```

#### 4. **Get User Payments**
```
GET /?page=1&limit=10&status=COMPLETED
```
**Authentication**: Required

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (PENDING, COMPLETED, etc.)

#### 5. **Get Payment Statistics**
```
GET /stats
```
**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Payment statistics retrieved successfully",
  "data": {
    "totalPayments": 25,
    "completedPayments": 20,
    "pendingPayments": 3,
    "processingPayments": 1,
    "failedPayments": 1,
    "totalAmount": 375000,
    "averageAmount": 15000
  }
}
```

#### 6. **Stripe Webhook Handler**
```
POST /webhook
```
**Authentication**: Stripe signature verification

**Purpose**: Handle Stripe events (payment completed, failed, etc.)

---

## Payment Flow

### Step-by-Step Process

1. **Service Completion**
   - Service provider completes work
   - Creates service report with cost breakdown
   - Booking status → `COMPLETED`

2. **View Completed Services**
   - Vehicle owner navigates to "My Bookings" → "Completed Services" tab
   - System fetches payment status for each completed booking
   - Display "Pay Now" button or "Paid" status

3. **Initiate Payment**
   - User clicks "Pay Now" button
   - Frontend calls `POST /api/v1/service-payments/create-session`
   - Backend:
     - Validates booking status
     - Checks if payment already exists
     - Gets amount from service report
     - Creates Stripe checkout session
     - Saves payment record with status `PROCESSING`
   - Frontend redirects to Stripe checkout page

4. **Payment on Stripe**
   - User enters card details on Stripe's secure page
   - Stripe processes payment
   - On success: Redirects to success URL
   - On cancel: Redirects to cancel URL

5. **Payment Verification**
   - User redirected to `/services/payment-success?session_id=xxx&booking_id=xxx`
   - Frontend calls `GET /api/v1/service-payments/verify`
   - Backend:
     - Retrieves Stripe session
     - Updates payment status to `COMPLETED`
     - Records transaction details
   - Display success message with payment details

6. **Webhook Processing** (Asynchronous)
   - Stripe sends webhook events to `/api/v1/service-payments/webhook`
   - Backend processes events:
     - `checkout.session.completed` → Mark payment as COMPLETED
     - `checkout.session.expired` → Mark payment as FAILED
   - Ensures payment status is updated even if user doesn't complete redirect

---

## Frontend Implementation

### MyBookingServices.jsx Updates

#### 1. **State Management**
```javascript
const [bookingPayments, setBookingPayments] = useState({});
const [loadingPayments, setLoadingPayments] = useState({});
```

#### 2. **Fetch Payment Status**
```javascript
const fetchPaymentStatus = async (bookingId) => {
  const response = await servicePaymentApi.getPaymentByBooking(bookingId);
  if (response.success && response.data.payment) {
    setBookingPayments(prev => ({
      ...prev,
      [bookingId]: response.data.payment
    }));
  }
};
```

#### 3. **Handle Payment**
```javascript
const handlePayment = async (booking) => {
  const bookingId = booking._id;
  const payment = bookingPayments[bookingId];

  // Check if already paid
  if (payment && payment.paymentStatus === "COMPLETED") {
    toast.info("This service has already been paid for!");
    return;
  }

  // Create payment session
  const response = await servicePaymentApi.createPaymentSession(bookingId);

  if (response.success && response.data.sessionUrl) {
    // Redirect to Stripe
    window.location.href = response.data.sessionUrl;
  }
};
```

#### 4. **Payment Button UI**
```javascript
{booking.status === "COMPLETED" && (
  <>
    {/* Payment Button or Status */}
    {(() => {
      const payment = bookingPayments[booking._id];
      const isLoading = loadingPayments[booking._id];
      const isPaid = payment?.paymentStatus === "COMPLETED";

      if (isPaid) {
        return <Chip label="Paid" color="success" />;
      }

      return (
        <Button
          variant="contained"
          startIcon={<PaymentIcon />}
          onClick={() => handlePayment(booking)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      );
    })()}

    {/* Rating Button */}
    {/* ... */}
  </>
)}
```

---

## Environment Variables

### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_BACKEND_URL=http://localhost:3000
VITE_REACT_APP_BACKEND_API_URL=http://localhost:3000/api/v1
```

---

## Security Measures

1. **Authentication**: Only vehicle owners can initiate payments
2. **Authorization**: Users can only pay for their own bookings
3. **Validation**:
   - Booking must be COMPLETED
   - Service report must exist
   - Amount must be valid
   - No duplicate payments
4. **Stripe Signature Verification**: Webhooks are verified
5. **HTTPS**: All payment data transmitted securely
6. **Payment Intent**: Stripe's payment intent ensures idempotency

---

## Testing

### Test Credit Cards (Stripe Test Mode)
```
Success: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155

Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Testing Steps

1. **Complete a Service**
   ```bash
   # Create a booking
   # Service provider completes it with service report
   # Booking status becomes COMPLETED
   ```

2. **Test Payment Flow**
   ```bash
   # Navigate to My Bookings → Completed Services
   # Click "Pay Now" on a completed service
   # Enter test card: 4242 4242 4242 4242
   # Complete payment
   # Verify redirect to success page
   # Check payment status shows "Paid"
   ```

3. **Test Webhook**
   ```bash
   # Use Stripe CLI to test webhooks
   stripe listen --forward-to localhost:3000/api/v1/service-payments/webhook

   # Trigger test event
   stripe trigger checkout.session.completed
   ```

---

## Error Handling

### Common Errors

1. **"Only vehicle owners can initiate payments"** (403)
   - User is not logged in as vehicle_owner
   - Solution: Login with vehicle owner account

2. **"Completed booking not found"** (404)
   - Booking doesn't exist or isn't completed
   - Solution: Complete the service first

3. **"Service report not found"** (404)
   - Service provider hasn't created report
   - Solution: Service provider must submit service report

4. **"Payment has already been completed"** (400)
   - Payment already exists with status COMPLETED
   - Solution: No action needed, already paid

5. **"Invalid payment amount"** (400)
   - Amount is zero or negative
   - Solution: Service report must have valid cost breakdown

---

## Monitoring & Logging

### Backend Logs
```javascript
// Payment session created
LOG.info({
  message: "Service payment session created",
  paymentId: payment.paymentId,
  bookingId: booking.bookingId,
  amount: amount,
  customerId: req.user._id
});

// Payment completed
LOG.info({
  message: "Service payment completed",
  paymentId: payment.paymentId,
  bookingId: payment.metadata.bookingId,
  amount: payment.amount
});
```

### Frontend Logs
```javascript
console.log("📤 Creating service payment session for booking:", bookingId);
console.log("✅ Payment session created successfully:", response.data);
console.log("🔍 Verifying payment with session ID:", sessionId);
```

---

## Future Enhancements

1. **Multiple Payment Methods**
   - Cash payment tracking
   - Bank transfer
   - Mobile payment (e.g., ePay, iPay)

2. **Partial Payments**
   - Allow paying in installments
   - Track payment history per booking

3. **Refunds**
   - Implement refund workflow
   - Track refund reasons and history

4. **Payment Reminders**
   - Email reminders for unpaid services
   - SMS notifications

5. **Receipts**
   - Generate PDF receipts
   - Email receipts automatically

6. **Payment Analytics**
   - Service center revenue dashboard
   - Payment trend analysis
   - Most common payment amounts

---

## Troubleshooting

### Issue: Payment button not showing
**Solution**:
- Ensure booking has `serviceReport` populated
- Check booking status is "COMPLETED"
- Verify user is logged in as vehicle_owner

### Issue: Stripe checkout not loading
**Solution**:
- Check `STRIPE_SECRET_KEY` in backend .env
- Verify Stripe account is in test mode
- Check browser console for CORS errors

### Issue: Payment stuck in PROCESSING
**Solution**:
- Check Stripe webhook configuration
- Manually verify payment in Stripe Dashboard
- Call verify endpoint: `GET /api/v1/service-payments/verify?sessionId=xxx`

### Issue: Webhook not working
**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` is configured
- Check webhook endpoint is publicly accessible
- Use Stripe CLI for local testing

---

## Contact & Support

For issues or questions:
- Backend issues: Check `d:/UCSC/3ys1/auto-connect/auto-connect-backend/controllers/servicePayment.controller.js`
- Frontend issues: Check `d:/UCSC/3ys1/auto-connect/auto-connect-frontend/src/services/servicePaymentApi.js`
- Model issues: Check `d:/UCSC/3ys1/auto-connect/auto-connect-backend/models/ServicePayment.model.js`

---

## Changelog

### Version 1.0.0 (2025-01-20)
- Initial implementation
- Stripe integration
- Payment tracking
- Success/failure handling
- Webhook support
