import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/hooks/use-payment';
import { formatAmount } from '@/lib/razorpay';
import { PaymentSuccess } from '@/components/PaymentSuccess';

const PaymentTest = () => {
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const { processRazorpayPayment, processCODPayment, isProcessing, isLoading, error } = usePayment();

  const testPaymentData = {
    type: 'individual' as const,
    orderId: `TEST-${Date.now()}`,
    total: 171,
    description: 'Test Payment - Rice from Quality Foods',
    product: 'Rice - Grains',
    quantity: 1
  };

  const testUserDetails = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+919876543210'
  };

  const createSuccessData = (paymentId: string) => ({
    paymentId,
    orderId: testPaymentData.orderId,
    amount: testPaymentData.total,
    orderType: testPaymentData.type,
    productName: testPaymentData.product,
    supplierName: 'Quality Foods Pvt Ltd',
    quantity: 1,
    pricePerKg: 52,
    subtotal: 52,
    tax: 9,
    deliveryCharge: 110,
    groupDiscount: 0,
    customerDetails: {
      name: testUserDetails.name,
      email: testUserDetails.email,
      phone: testUserDetails.phone,
      address: 'Kalyan-Dombivli, Maharashtra, India'
    },
    businessDetails: {
      name: 'Kumar Enterprises',
      businessType: 'Retail & Wholesale',
      gstNumber: '07AABCU9603R1ZM',
      address: '123, Commercial Street, Sector 15, Mumbai, Maharashtra 400001',
      email: 'rajesh@kumarenterprises.com',
      phone: '+91 98765 43210'
    }
  });

  const handleTestRazorpayPayment = async () => {
    setIsTestingPayment(true);
    
    try {
      await processRazorpayPayment(
        testPaymentData,
        testUserDetails,
        (response) => {
          console.log('✅ Test Payment Successful:', response);
          const successData = createSuccessData(response.razorpay_payment_id);
          setPaymentSuccessData(successData);
          setShowPaymentSuccess(true);
        },
        (error) => {
          console.error('❌ Test Payment Failed:', error);
          alert(`Payment Failed: ${error.message}`);
        }
      );
    } catch (error) {
      console.error('❌ Test Payment Error:', error);
      alert(`Payment Error: ${error}`);
    } finally {
      setIsTestingPayment(false);
    }
  };

  const handleTestCODPayment = async () => {
    setIsTestingPayment(true);
    
    try {
      await processCODPayment(testPaymentData, () => {
        console.log('✅ COD Order Placed');
        const successData = createSuccessData(`COD_${Date.now()}`);
        setPaymentSuccessData(successData);
        setShowPaymentSuccess(true);
      });
    } catch (error) {
      console.error('❌ COD Order Failed:', error);
      alert(`COD Order Failed: ${error}`);
    } finally {
      setIsTestingPayment(false);
    }
  };

  if (showPaymentSuccess && paymentSuccessData) {
    return (
      <PaymentSuccess
        {...paymentSuccessData}
        onContinueShopping={() => {
          setShowPaymentSuccess(false);
          setPaymentSuccessData(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">🛒 MarketConnect Payment Test</h1>
        
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📦 Test Order Details</h3>
            <div className="text-sm space-y-1">
              <div><strong>Product:</strong> {testPaymentData.product}</div>
              <div><strong>Amount:</strong> {formatAmount(testPaymentData.total)}</div>
              <div><strong>Order ID:</strong> {testPaymentData.orderId}</div>
              <div><strong>Supplier:</strong> Quality Foods Pvt Ltd</div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm text-red-800">
                <strong>❌ Error:</strong> {typeof error === 'string' ? error : 'Payment service error'}
              </div>
            </div>
          )}
          
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-green-800 mb-2">🔧 System Status</h4>
            <div className="text-xs text-green-700 space-y-1">
              <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
              <div><strong>Razorpay Key:</strong> {import.meta.env.VITE_RAZORPAY_KEY_ID}</div>
              <div><strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</div>
              <div><strong>Processing:</strong> {isProcessing ? '⏳ Yes' : '✅ No'}</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">🧪 What This Test Demonstrates</h4>
            <div className="text-xs text-purple-700 space-y-1">
              <div>✅ Razorpay payment gateway integration</div>
              <div>✅ Payment success handling</div>
              <div>✅ Automatic receipt generation with watermark</div>
              <div>✅ PDF download and preview functionality</div>
              <div>✅ COD (Cash on Delivery) option</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={handleTestRazorpayPayment}
            disabled={isTestingPayment || isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isTestingPayment ? '⏳ Testing Razorpay...' : `💳 Test Razorpay Payment - ${formatAmount(testPaymentData.total)}`}
          </Button>
          
          <Button
            onClick={handleTestCODPayment}
            disabled={isTestingPayment || isProcessing}
            variant="outline"
            className="w-full"
          >
            {isTestingPayment ? '⏳ Testing COD...' : `🚚 Test COD Payment - ${formatAmount(testPaymentData.total)}`}
          </Button>

          <div className="text-center text-xs text-gray-500 mt-4">
            <p>🔒 <strong>Test Mode:</strong> No real money will be charged</p>
            <p>Use card: 4111 1111 1111 1111, CVV: 123, Expiry: any future date</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={() => window.location.href = '/vendor/dashboard'}
            className="text-sm"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
