import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'pending' | 'processing';
  paymentId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  onClose: () => void;
  onRetry?: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  paymentId,
  orderId,
  amount,
  currency = 'INR',
  onClose,
  onRetry
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: 'Payment Pending',
          description: 'Your payment is being processed. Please wait.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'processing':
        return {
          icon: <AlertCircle className="w-16 h-16 text-blue-500" />,
          title: 'Processing Payment',
          description: 'Please wait while we process your payment.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-gray-500" />,
          title: 'Payment Status Unknown',
          description: 'Unable to determine payment status.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl max-w-md w-full p-8 border-2 ${config.borderColor}`}>
        <div className="text-center">
          {config.icon}
          
          <h3 className={`text-2xl font-bold mt-4 ${config.color}`}>
            {config.title}
          </h3>
          
          <p className="text-gray-600 mt-2 mb-6">
            {config.description}
          </p>

          {/* Payment Details */}
          {(paymentId || orderId || amount) && (
            <div className={`${config.bgColor} rounded-lg p-4 mb-6`}>
              <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
              <div className="space-y-2 text-sm">
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-gray-900">{paymentId}</span>
                  </div>
                )}
                {orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-gray-900">{orderId}</span>
                  </div>
                )}
                {amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {status === 'failed' && onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
            
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                status === 'failed' && onRetry
                  ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {status === 'success' ? 'Continue' : 'Close'}
            </button>
          </div>

          {/* Additional Info */}
          {status === 'success' && (
            <p className="text-xs text-gray-500 mt-4">
              You will receive a confirmation email shortly.
            </p>
          )}
          
          {status === 'failed' && (
            <p className="text-xs text-gray-500 mt-4">
              If the amount was deducted, it will be refunded within 5-7 business days.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus; 