import React from 'react';
import { CheckCircle2, Download, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAmount } from '@/lib/razorpay';

interface PaymentSuccessProps {
  paymentId: string;
  orderId: string;
  amount: number;
  orderType: 'individual' | 'group';
  productName: string;
  supplierName?: string;
  onContinueShopping: () => void;
  onDownloadReceipt?: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  paymentId,
  orderId,
  amount,
  orderType,
  productName,
  supplierName,
  onContinueShopping,
  onDownloadReceipt
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">
            Your {orderType === 'individual' ? 'order' : 'group participation'} has been confirmed
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-mono text-xs">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-semibold">{productName}</span>
            </div>
            {supplierName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier:</span>
                <span>{supplierName}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-bold text-green-600">{formatAmount(amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onContinueShopping}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onDownloadReceipt}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Receipt
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {/* Navigate to orders */}}
              className="flex-1"
            >
              <Package className="w-4 h-4 mr-2" />
              My Orders
            </Button>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="mt-1">For support, contact us at support@marketconnect.com</p>
        </div>
      </div>
    </div>
  );
};
