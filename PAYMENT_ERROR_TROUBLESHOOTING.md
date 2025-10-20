# Payment Feature - Error Troubleshooting Guide

## Error: 500 Internal Server Error when clicking "Pay Now"

### Symptom
```
POST http://localhost:3000/api/v1/service-payments/create-session 500 (Internal Server Error)
Error: Service report has not been created yet by the service center.
```

### Root Cause
The booking with ID `68f32ae9a8fb063dea7d7dd3` is marked as **COMPLETED** but doesn't have an associated **Service Report** yet.

### Why This Happens
The payment system requires:
1. Booking status must be `COMPLETED` ✅
2. Service Report must exist ❌ (Missing)
3. Service Report must have `totalCostBreakdown.finalTotal` ❌ (Missing)

### Solution

#### For Service Providers:
Before a vehicle owner can pay, the service provider must:

1. **Complete the Service** - Mark booking as COMPLETED
2. **Create Service Report** - Fill out the service completion form with:
   - Services completed
   - Parts used (with prices)
   - Labor hours and rates
   - Additional work (if any)
   - **Cost breakdown** (most important!)

The Service Report model requires:
```javascript
{
  booking: ObjectId,          // Reference to booking
  completedServices: [...],   // Array of services done
  totalCostBreakdown: {
    partsTotal: Number,       // Total cost of parts
    laborTotal: Number,       // Total cost of labor
    servicesTotal: Number,    // Total cost of services
    additionalWorkTotal: Number,
    taxes: Number,
    discount: Number,
    finalTotal: Number        // THIS IS REQUIRED FOR PAYMENT!
  }
}
```

#### For Vehicle Owners:
If you see this error when trying to pay:
1. Contact the service center
2. Ask them to complete the service report with cost breakdown
3. Once they create the report, you'll be able to pay

### Updated User Experience

After the fix, when clicking "Pay Now":

**Scenario 1: No Service Report**
- ⚠️ Warning toast appears:
  > "Service report has not been created yet by the service center. Please contact them to complete the service report before making payment."

**Scenario 2: Service Report Exists**
- ✅ Redirects to Stripe checkout page
- User can enter payment details
- After payment, redirects to success page

### Testing the Payment Feature

To test the complete payment flow:

1. **Create a booking** as vehicle owner
2. **Complete the booking** as service provider
3. **Create service report** with cost breakdown:
   ```bash
   POST /api/v1/service-reports
   {
     "booking": "68f32ae9a8fb063dea7d7dd3",
     "completedServices": [...],
     "totalCostBreakdown": {
       "partsTotal": 5000,
       "laborTotal": 8000,
       "servicesTotal": 2000,
       "additionalWorkTotal": 0,
       "taxes": 0,
       "discount": 0,
       "finalTotal": 15000  // LKR 15,000
     },
     ...
   }
   ```
4. **View completed services** as vehicle owner
5. **Click "Pay Now"** button
6. **Enter test card**: `4242 4242 4242 4242`
7. **Complete payment**
8. **Verify** payment status shows "Paid"

### Backend Validation

The backend now provides clear error messages:

```javascript
// Check if service report exists
if (!booking.serviceReport) {
  return next(new AppError(
    "Service report has not been created yet by the service center. " +
    "Please contact the service center to complete the service report before making payment.",
    400
  ));
}

// Check if service report has valid amount
if (!serviceReport.totalCostBreakdown || !serviceReport.totalCostBreakdown.finalTotal) {
  return next(new AppError(
    "Service report does not have a final cost. " +
    "Please contact the service center to update the service report.",
    400
  ));
}
```

### Frontend Validation

The frontend now checks before making API call:

```javascript
// Check if service report exists
if (!booking.serviceReport) {
  toast.warning(
    "Service report has not been created yet by the service center. " +
    "Please contact them to complete the service report before making payment.",
    { autoClose: 7000 }
  );
  return;
}
```

### Quick Fix for Your Current Error

To fix the specific booking causing the error:

1. **Option A: Create Service Report via API**
   ```bash
   POST http://localhost:3000/api/v1/service-reports
   {
     "booking": "68f32ae9a8fb063dea7d7dd3",
     "reportId": "SR-TEST-001",
     "serviceCenter": "<service_center_id>",
     "vehicle": {
       "registrationNumber": "ABC-1234",
       "make": "Toyota",
       "model": "Camry",
       "year": 2020
     },
     "completedServices": [{
       "serviceName": "Oil Change",
       "description": "Complete oil change",
       "partsUsed": [],
       "laborDetails": {
         "hoursWorked": 1,
         "laborRate": 2000,
         "laborCost": 2000
       },
       "serviceCost": 3000
     }],
     "totalCostBreakdown": {
       "partsTotal": 0,
       "laborTotal": 2000,
       "servicesTotal": 3000,
       "finalTotal": 5000
     },
     "workStartTime": "2025-01-20T10:00:00Z",
     "workEndTime": "2025-01-20T11:00:00Z",
     "technician": {
       "name": "John Smith"
     },
     "reportGeneratedBy": "<service_provider_user_id>"
   }
   ```

2. **Option B: Use Service Provider UI**
   - Login as service provider
   - Navigate to completed bookings
   - Click "Create Service Report"
   - Fill in all details including cost breakdown
   - Submit report

3. **Option C: Update Booking in MongoDB**
   ```javascript
   // Connect to MongoDB and update
   db.service_reports.insertOne({
     booking: ObjectId("68f32ae9a8fb063dea7d7dd3"),
     reportId: "SR-TEST-001",
     // ... other fields
     totalCostBreakdown: {
       finalTotal: 5000
     }
   });

   // Then update the booking to reference it
   db.bookings.updateOne(
     { _id: ObjectId("68f32ae9a8fb063dea7d7dd3") },
     { $set: { serviceReport: <service_report_id> } }
   );
   ```

### Prevention

To prevent this error in the future:

1. **Enforce Service Report Creation**
   - Don't allow marking booking as COMPLETED without service report
   - OR: Allow COMPLETED status but show "Pending Report" state

2. **Add Validation**
   - Backend: Validate service report has cost before allowing COMPLETED status
   - Frontend: Show warning if trying to complete without report

3. **Improve UI/UX**
   - Show "Create Report" button next to "Mark Complete" button
   - Guide service providers through report creation workflow
   - Show payment status (Awaiting Report → Ready to Pay → Paid)

### Related Files

- **Backend Controller**: [servicePayment.controller.js:43-57](d:/UCSC/3ys1/auto-connect/auto-connect-backend/controllers/servicePayment.controller.js#L43-L57)
- **Frontend Payment Handler**: [MyBookingServices.jsx:326-373](d:/UCSC/3ys1/auto-connect/auto-connect-frontend/src/pages/VehicleOwner/MyBookingServices.jsx#L326-L373)
- **Service Report Model**: [ServiceReport.model.js:146-180](d:/UCSC/3ys1/auto-connect/auto-connect-backend/models/ServiceReport.model.js#L146-L180)
- **Booking Model**: [Booking.model.js:165-168](d:/UCSC/3ys1/auto-connect/auto-connect-backend/models/Booking.model.js#L165-L168)

---

## Summary

✅ **Payment feature is working correctly**
❌ **Current error is expected behavior** - cannot pay without service report
✅ **Error handling improved** - now shows user-friendly messages
✅ **Solution**: Service provider must create service report with cost breakdown

The payment system is functioning as designed - it's protecting against payments being initiated before the service center has documented the work and provided a final bill.
