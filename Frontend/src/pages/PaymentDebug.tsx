import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/hooks/use-payment';
import { formatAmount, validateRazorpayKey } from '@/lib/razorpay';
import { PaymentSuccess } from '@/components/PaymentSuccess';

const PaymentDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const { processRazorpayPayment, processCODPayment, isProcessing, isLoading, error } = usePayment();

  useEffect(() => {
    // Collect debug information
    const debug = {
      environment: import.meta.env.MODE,
      razorpayKey: import.meta.env.VITE_RAZORPAY_KEY_ID,
      keyValid: validateRazorpayKey(import.meta.env.VITE_RAZORPAY_KEY_ID || ''),
      keyLength: import.meta.env.VITE_RAZORPAY_KEY_ID?.length,
      windowRazorpay: !!(window as any).Razorpay,
      isLoading,
      isProcessing,
      error: error ? (typeof error === 'string' ? error : JSON.stringify(error)) : null
    };
    setDebugInfo(debug);
  }, [isLoading, isProcessing, error]);

  const testPaymentData = {
    type: 'individual' as const,
    orderId: `DEBUG-${Date.now()}`,
    total: 171,
    description: 'Debug Payment - Rice from Quality Foods',
    product: 'Rice - Grains',
    quantity: 1
  };

  const testUserDetails = {
    name: 'Debug User',
    email: 'debug@example.com',
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
      address: 'Debug Location, Test City'
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

  const handleDebugPayment = async () => {
    setIsTestingPayment(true);
    console.clear();
    console.log('🔧 STARTING DEBUG PAYMENT FLOW');
    console.log('='.repeat(50));
    
    try {
      await processRazorpayPayment(
        testPaymentData,
        testUserDetails,
        (response) => {
          console.log('✅ SUCCESS CALLBACK TRIGGERED');
          console.log('📝 Full Response:', response);
          setLastResponse(response);
          
          const successData = createSuccessData(response.razorpay_payment_id);
          setPaymentSuccessData(successData);
          setShowPaymentSuccess(true);
        },
        (error) => {
          console.error('❌ ERROR CALLBACK TRIGGERED');
          console.error('📝 Error Details:', error);
          setLastResponse({ error: error.message });
          alert(`❌ Payment Failed: ${error.message}`);
        }
      );
    } catch (error) {
      console.error('💥 EXCEPTION CAUGHT:', error);
      setLastResponse({ exception: error.toString() });
      alert(`💥 Exception: ${error}`);
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🔧 Payment Debug Console</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Debug Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📊 System Status</h2>
            <div className="space-y-2 text-sm">
              {Object.entries(debugInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span className={`font-mono ${
                    value === true ? 'text-green-600' : 
                    value === false ? 'text-red-600' : 
                    'text-gray-800'
                  }`}>
                    {typeof value === 'boolean' ? (value ? '✅' : '❌') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Test Order */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📦 Test Order</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Product:</strong> {testPaymentData.product}</div>
              <div><strong>Amount:</strong> {formatAmount(testPaymentData.total)}</div>
              <div><strong>Order ID:</strong> {testPaymentData.orderId}</div>
              <div><strong>Type:</strong> {testPaymentData.type}</div>
            </div>

            <div className="mt-4">
              <Button
                onClick={handleDebugPayment}
                disabled={isTestingPayment || isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isTestingPayment ? '🔄 Processing...' : '🚀 Start Debug Payment'}
              </Button>
            </div>
          </div>

          {/* Last Response */}
          {lastResponse && (
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📝 Last Payment Response</h2>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="lg:col-span-2 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">📋 Debug Instructions</h2>
            <div className="space-y-2 text-blue-800">
              <p>1. <strong>Open Browser Console</strong> (F12) to see detailed logs</p>
              <p>2. <strong>Click "Start Debug Payment"</strong> to trigger Razorpay</p>
              <p>3. <strong>Complete payment</strong> using test credentials:</p>
              <ul className="ml-6 list-disc">
                <li><strong>Card:</strong> 4111 1111 1111 1111</li>
                <li><strong>CVV:</strong> 123</li>
                <li><strong>Expiry:</strong> Any future date</li>
                <li><strong>UPI:</strong> success@razorpay</li>
              </ul>
              <p>4. <strong>Check console logs</strong> for validation details</p>
              <p>5. <strong>Review response</strong> in the "Last Payment Response" section</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDebug;
