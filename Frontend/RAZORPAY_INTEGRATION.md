# Razorpay Payment Integration

## Overview
This project integrates Razorpay payment gateway for processing payments in the MarketConnect marketplace application. The integration supports multiple payment methods including UPI, Credit/Debit Cards, Net Banking, Digital Wallets, and Cash on Delivery.

## Features

### ✅ Payment Methods Supported
- 💳 **UPI Payments** - GPay, PhonePe, Paytm, etc.
- 🏦 **Credit/Debit Cards** - Visa, Mastercard, RuPay
- 🌐 **Net Banking** - All major Indian banks
- 💰 **Digital Wallets** - Paytm, Mobikwik, Amazon Pay
- 🚚 **Cash on Delivery** - For individual orders only

### ✅ Key Features
- **Real-time Payment Processing** with Razorpay
- **Automatic Tax Calculation** (18% GST)
- **Distance-based Delivery Charges**
- **Group Order Discounts** (10-15%)
- **Payment Validation & Verification**
- **Responsive Payment Modal**
- **Error Handling & Recovery**
- **Receipt Generation**

## Setup Instructions

### 1. Razorpay Account Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Get your API keys from the dashboard

### 2. Environment Configuration
Update your `.env` file with Razorpay credentials:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890    # Your Test/Live Key ID
VITE_RAZORPAY_KEY_SECRET=your_secret_key_here # Keep secret, use only in backend

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
```

### 3. Dependencies
The following packages are already installed:
- `react-razorpay` - Official Razorpay React SDK
- `lucide-react` - Icons for payment methods

## Code Architecture

### Core Files

#### 1. `/src/lib/razorpay.ts`
Core Razorpay configuration and utility functions:
- Payment options creation
- Amount formatting
- Tax calculations
- Delivery charge calculations
- Order ID generation

#### 2. `/src/hooks/use-payment.ts`
Custom React hook for payment processing:
- Razorpay payment handling
- COD payment processing
- Error handling
- Success callbacks

#### 3. `/src/components/PaymentSuccess.tsx`
Payment success confirmation component:
- Order confirmation display
- Receipt download option
- Navigation to orders/shopping

#### 4. `/src/pages/vendor/VendorDashboard.tsx`
Main integration with payment modal:
- Payment method selection
- Cost calculation display
- Razorpay integration
- Error handling

## Usage Examples

### Basic Payment Processing
```typescript
import { usePayment } from '@/hooks/use-payment';

const { processRazorpayPayment, isProcessing } = usePayment();

const handlePayment = () => {
  const paymentData = {
    type: 'individual',
    orderId: 'ORD-123456',
    total: 1500,
    description: 'Rice from Quality Foods',
    product: 'Rice',
    quantity: 10
  };

  const userDetails = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+919876543210'
  };

  processRazorpayPayment(
    paymentData,
    userDetails,
    (response) => {
      console.log('Payment successful:', response);
    },
    (error) => {
      console.error('Payment failed:', error);
    }
  );
};
```

### Cost Calculation
```typescript
import { calculateTax, calculateDeliveryCharge, formatAmount } from '@/lib/razorpay';

const subtotal = 1000;
const distance = 15; // km
const deliveryCharge = calculateDeliveryCharge(distance);
const tax = calculateTax(subtotal); // 18% GST
const total = subtotal + deliveryCharge + tax;

console.log(`Total: ${formatAmount(total)}`);
```

## Payment Flow

### Individual Orders
1. User selects supplier and quantity
2. System calculates subtotal, delivery charges, tax
3. Payment modal opens with method selection
4. User completes payment via Razorpay
5. Order confirmation and receipt generation

### Group Orders
1. User joins group order with quantity
2. System applies group discount
3. Calculates final amount with tax
4. Payment processing via Razorpay
5. Group participation confirmation

## Security Features

### Frontend Security
- ✅ Payment keys are environment-based
- ✅ No sensitive data storage in frontend
- ✅ Payment verification with response validation
- ✅ HTTPS enforcement for production

### Backend Integration (Recommended)
For production, implement server-side verification:

```javascript
// Backend verification endpoint
app.post('/api/payment/verify', (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
  // Verify signature using Razorpay secret
  const generated_signature = hmac_sha256(razorpay_order_id + "|" + razorpay_payment_id, secret);
  
  if (generated_signature === razorpay_signature) {
    // Payment is verified
    res.json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'failed' });
  }
});
```

## Error Handling

### Common Error Scenarios
1. **Payment Gateway Unavailable** - Fallback to COD
2. **Network Issues** - Retry mechanism
3. **Payment Cancellation** - User-friendly messages
4. **Insufficient Funds** - Bank error handling
5. **Verification Failure** - Support contact information

### Error Recovery
```typescript
// Automatic error recovery
const handlePaymentError = (error: Error) => {
  if (error.message.includes('network')) {
    // Show retry option
    showRetryDialog();
  } else if (error.message.includes('cancelled')) {
    // User cancelled payment
    showCancellationMessage();
  } else {
    // Generic error handling
    showErrorDialog(error.message);
  }
};
```

## Testing

### Test Mode Setup
1. Use test API keys for development
2. Test payment methods:
   - **Test Card**: 4111 1111 1111 1111
   - **Test UPI**: success@razorpay
   - **Test Net Banking**: Use any test bank

### Test Scenarios
- ✅ Successful payments
- ✅ Failed payments
- ✅ Payment cancellation
- ✅ Network interruption
- ✅ Invalid card details

## Production Deployment

### Checklist
- [ ] Replace test keys with live keys
- [ ] Enable HTTPS
- [ ] Implement server-side verification
- [ ] Set up webhook endpoints
- [ ] Configure payment notifications
- [ ] Test with real payment methods
- [ ] Set up monitoring and logging

### Performance Considerations
- Payment modal loads lazily
- Razorpay SDK loaded on-demand
- Minimal bundle size impact
- Efficient error handling

## Support & Troubleshooting

### Common Issues
1. **Payment not processing**: Check API keys and internet connection
2. **Payment success but order not created**: Implement proper backend verification
3. **Mobile payment issues**: Ensure responsive design and proper UPI handling

### Debug Mode
Enable debug logging in development:
```typescript
// In razorpay.ts
const DEBUG = import.meta.env.MODE === 'development';

if (DEBUG) {
  console.log('Payment options:', options);
}
```

### Contact Information
- **Razorpay Support**: https://razorpay.com/support/
- **Developer Documentation**: https://razorpay.com/docs/
- **Integration Guide**: https://razorpay.com/docs/payments/

## License
This integration follows the terms of service of:
- Razorpay Terms of Service
- Your application's license terms

---

**Note**: This is a development setup. For production use, ensure proper security measures, server-side verification, and compliance with financial regulations.
