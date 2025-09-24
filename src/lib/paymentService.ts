/**
 * @fileoverview Payment service for handling multiple payment methods
 * @author NoteMart Team
 * @created 2024
 */

/**
 * Supported payment methods
 */
export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  RAZORPAY = 'razorpay',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay'
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Payment request interface
 */
export interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  customerInfo: {
    email: string;
    name: string;
  };
}

/**
 * Payment response interface
 */
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status: PaymentStatus;
  message: string;
  redirectUrl?: string;
  error?: string;
}

/**
 * Simulate payment processing with realistic delays and responses
 */
export const processPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  // Simulate different success rates for different payment methods
  const successRates = {
    [PaymentMethod.STRIPE]: 0.95,
    [PaymentMethod.PAYPAL]: 0.92,
    [PaymentMethod.RAZORPAY]: 0.90,
    [PaymentMethod.APPLE_PAY]: 0.97,
    [PaymentMethod.GOOGLE_PAY]: 0.96
  };

  const successRate = successRates[paymentRequest.method];
  const isSuccess = Math.random() < successRate;

  if (isSuccess) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: PaymentStatus.COMPLETED,
      message: `Payment of ${paymentRequest.currency} ${paymentRequest.amount.toFixed(2)} processed successfully via ${paymentRequest.method.toUpperCase()}`
    };
  } else {
    // Simulate different failure reasons
    const failures = [
      'Insufficient funds',
      'Payment method declined',
      'Network timeout',
      'Invalid payment details'
    ];
    
    return {
      success: false,
      status: PaymentStatus.FAILED,
      message: 'Payment failed',
      error: failures[Math.floor(Math.random() * failures.length)]
    };
  }
};

/**
 * Get payment method display information
 */
export const getPaymentMethodInfo = (method: PaymentMethod) => {
  const methodInfo = {
    [PaymentMethod.STRIPE]: {
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay securely with your credit or debit card',
      processingTime: '2-3 minutes'
    },
    [PaymentMethod.PAYPAL]: {
      name: 'PayPal',
      icon: '🅿️',
      description: 'Pay with your PayPal account',
      processingTime: '1-2 minutes'
    },
    [PaymentMethod.RAZORPAY]: {
      name: 'Razorpay',
      icon: '💰',
      description: 'UPI, Cards, Net Banking & Wallets',
      processingTime: '1-3 minutes'
    },
    [PaymentMethod.APPLE_PAY]: {
      name: 'Apple Pay',
      icon: '🍎',
      description: 'Pay securely with Touch ID or Face ID',
      processingTime: '30 seconds'
    },
    [PaymentMethod.GOOGLE_PAY]: {
      name: 'Google Pay',
      icon: '🔵',
      description: 'Pay quickly with Google Pay',
      processingTime: '30 seconds'
    }
  };

  return methodInfo[method];
};

/**
 * Validate payment request
 */
export const validatePaymentRequest = (request: PaymentRequest): string[] => {
  const errors: string[] = [];

  if (!request.amount || request.amount <= 0) {
    errors.push('Invalid payment amount');
  }

  if (!request.currency) {
    errors.push('Currency is required');
  }

  if (!request.method) {
    errors.push('Payment method is required');
  }

  if (!request.items || request.items.length === 0) {
    errors.push('No items to purchase');
  }

  if (!request.customerInfo.email) {
    errors.push('Customer email is required');
  }

  if (!request.customerInfo.name) {
    errors.push('Customer name is required');
  }

  return errors;
};
