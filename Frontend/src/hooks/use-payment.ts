import { useState } from 'react';
import { useRazorpay } from 'react-razorpay';
import { useToast } from '@/hooks/use-toast';
import { 
  createRazorpayOptions, 
  validatePaymentResponse, 
  formatAmount,
  type RazorpayResponse 
} from '@/lib/razorpay';

export interface PaymentData {
  type: 'individual' | 'group';
  orderId: string;
  total: number;
  description: string;
  supplier?: any;
  product?: string;
  group?: any;
  quantity: number;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { error, isLoading, Razorpay } = useRazorpay();

  const processRazorpayPayment = async (
    paymentData: PaymentData,
    userDetails: UserDetails,
    onSuccess?: (response: RazorpayResponse) => void,
    onError?: (error: Error) => void
  ) => {
    if (!Razorpay) {
      const errorMsg = "Payment service is not available. Please try again.";
      toast({
        title: "Payment Error",
        description: errorMsg,
        variant: "destructive"
      });
      if (onError) onError(new Error(errorMsg));
      return;
    }

    setIsProcessing(true);

    try {
      const options = createRazorpayOptions(
        paymentData.total,
        paymentData.orderId,
        paymentData.description,
        userDetails,
        (response: RazorpayResponse) => {
          if (validatePaymentResponse(response)) {
            const successMessage = paymentData.type === 'individual' 
              ? `Order placed for ${paymentData.product} - ${formatAmount(paymentData.total)}`
              : `Joined ${paymentData.group.product} group - ${formatAmount(paymentData.total)}`;

            toast({
              title: "Payment Successful! 🎉",
              description: successMessage,
            });

            if (onSuccess) onSuccess(response);
          } else {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive"
            });
            if (onError) onError(new Error("Payment verification failed"));
          }
          setIsProcessing(false);
        },
        () => {
          toast({
            title: "Payment Cancelled",
            description: "You can try again when ready.",
            variant: "destructive"
          });
          setIsProcessing(false);
        }
      );

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method.",
        variant: "destructive"
      });
      setIsProcessing(false);
      if (onError) onError(error as Error);
    }
  };

  const processCODPayment = async (
    paymentData: PaymentData,
    onSuccess?: () => void
  ) => {
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const successMessage = paymentData.type === 'individual' 
        ? `COD order for ${paymentData.product} - ${formatAmount(paymentData.total)}. Pay when delivered.`
        : `Joined ${paymentData.group.product} group - ${formatAmount(paymentData.total)}. Pay when delivered.`;

      toast({
        title: "Order Placed Successfully! 🎉",
        description: successMessage,
      });

      if (onSuccess) onSuccess();
      
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processRazorpayPayment,
    processCODPayment,
    isProcessing,
    isLoading,
    error
  };
};
