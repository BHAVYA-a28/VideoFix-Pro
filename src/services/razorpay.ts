// Razorpay Payment Integration Service

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: {
    address?: string;
    [key: string]: string | undefined;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId: string;
}

// Razorpay configuration
const RAZORPAY_CONFIG = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY', // Replace with your test key
  currency: 'INR',
  name: 'VideoFix Pro',
  theme: {
    color: '#3B82F6'
  }
};

// Initialize Razorpay
export const loadRazorpay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
};

// Create payment order
export const createPaymentOrder = async (paymentDetails: PaymentDetails): Promise<string> => {
  try {
    // In a real application, you would make an API call to your backend
    // to create the order on your server
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        receipt: paymentDetails.orderId,
        notes: {
          description: paymentDetails.description,
          customer_name: paymentDetails.customerName,
          customer_email: paymentDetails.customerEmail,
          customer_phone: paymentDetails.customerPhone
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data.order_id;
  } catch (error) {
    console.error('Error creating order:', error);
    // For demo purposes, return a mock order ID
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Initialize Razorpay payment
export const initializePayment = async (
  paymentDetails: PaymentDetails,
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: (error: any) => void,
  onClose: () => void
): Promise<void> => {
  try {
    // Load Razorpay script
    await loadRazorpay();

    // Create order
    const orderId = await createPaymentOrder(paymentDetails);

    // Configure Razorpay options
    const options: RazorpayOptions = {
      key: RAZORPAY_CONFIG.key,
      amount: paymentDetails.amount * 100, // Razorpay expects amount in paise
      currency: paymentDetails.currency,
      name: RAZORPAY_CONFIG.name,
      description: paymentDetails.description,
      order_id: orderId,
      prefill: {
        name: paymentDetails.customerName,
        email: paymentDetails.customerEmail,
        contact: paymentDetails.customerPhone
      },
      notes: {
        address: 'VideoFix Pro Services',
        order_id: orderId
      },
      theme: RAZORPAY_CONFIG.theme,
      handler: (response: RazorpayResponse) => {
        console.log('Payment successful:', response);
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed');
          onClose();
        }
      }
    };

    // Initialize Razorpay
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Error initializing payment:', error);
    onFailure(error);
  }
};

// Verify payment signature (should be done on backend)
export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        signature: signature
      })
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data.verified;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

// Generate unique order ID
export const generateOrderId = (): string => {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Format amount for display
export const formatAmount = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Get payment status
export const getPaymentStatus = (paymentId: string): Promise<any> => {
  return fetch(`/api/payment-status/${paymentId}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching payment status:', error);
      return null;
    });
}; 