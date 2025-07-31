// Mock Backend Service for Razorpay Testing
// In production, this would be replaced with actual backend API calls

export interface MockOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
}

export interface MockPaymentResponse {
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed';
  method: string;
  description: string;
}

// Mock order creation
export const createMockOrder = async (orderData: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: any;
}): Promise<MockOrderResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: orderData.amount,
    currency: orderData.currency,
    receipt: orderData.receipt,
    status: 'created'
  };
};

// Mock payment verification
export const verifyMockPayment = async (paymentData: {
  order_id: string;
  payment_id: string;
  signature: string;
}): Promise<{ verified: boolean; payment?: MockPaymentResponse }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock verification logic
  const isValidSignature = paymentData.signature.length > 0;
  
  if (isValidSignature) {
    return {
      verified: true,
      payment: {
        payment_id: paymentData.payment_id,
        order_id: paymentData.order_id,
        amount: 1000, // Mock amount
        currency: 'INR',
        status: 'captured',
        method: 'card',
        description: 'Payment for VideoFix Pro services'
      }
    };
  }
  
  return {
    verified: false
  };
};

// Mock payment status check
export const getMockPaymentStatus = async (paymentId: string): Promise<MockPaymentResponse | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock payment status
  const statuses = ['created', 'authorized', 'captured', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as any;
  
  return {
    payment_id: paymentId,
    order_id: `order_${Date.now()}`,
    amount: 1000,
    currency: 'INR',
    status: randomStatus,
    method: 'card',
    description: 'Payment for VideoFix Pro services'
  };
};

// Mock webhook handler
export const handleMockWebhook = async (webhookData: any): Promise<{ success: boolean; message: string }> => {
  // Simulate webhook processing
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    success: true,
    message: 'Webhook processed successfully'
  };
};

// Mock error responses for testing
export const simulatePaymentError = async (errorType: 'network' | 'invalid_key' | 'order_failed'): Promise<never> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const errors = {
    network: new Error('Network error: Unable to connect to payment gateway'),
    invalid_key: new Error('Invalid API key: Please check your Razorpay configuration'),
    order_failed: new Error('Order creation failed: Please try again')
  };
  
  throw errors[errorType];
}; 