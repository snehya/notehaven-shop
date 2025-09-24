/**
 * @fileoverview Checkout page component with multiple payment options
 * @author NoteMart Team
 * @created 2024
 */

import React, { memo, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Shield, Clock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { 
  PaymentMethod, 
  processPayment, 
  getPaymentMethodInfo,
  validatePaymentRequest,
  type PaymentRequest 
} from '@/lib/paymentService';

/**
 * Checkout page component
 */
export const CheckoutPage: React.FC = memo(() => {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.STRIPE);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Memoized order summary
   */
  const orderSummary = useMemo(() => ({
    subtotal: totalPrice,
    tax: totalPrice * 0.1,
    total: totalPrice * 1.1
  }), [totalPrice]);

  /**
   * Payment methods configuration
   */
  const paymentMethods = Object.values(PaymentMethod).map(method => ({
    value: method,
    ...getPaymentMethodInfo(method)
  }));

  /**
   * Handle form submission and payment processing
   */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        amount: orderSummary.total,
        currency: 'USD',
        method: selectedPaymentMethod,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1
        })),
        customerInfo
      };

      // Validate payment request
      const validationErrors = validatePaymentRequest(paymentRequest);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(', '),
          variant: "destructive"
        });
        return;
      }

      // Process payment
      const result = await processPayment(paymentRequest);

      if (result.success) {
        // Clear cart and show success
        clearCart();
        toast({
          title: "Payment Successful!",
          description: result.message
        });
        
        // Navigate to orders page
        navigate(ROUTES.ORDERS, { 
          state: { 
            orderData: {
              transactionId: result.transactionId,
              items: paymentRequest.items,
              total: orderSummary.total,
              paymentMethod: selectedPaymentMethod,
              date: new Date()
            }
          }
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">No Items to Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Your cart is empty. Add some items before proceeding to checkout.
          </p>
          <Button asChild>
            <Link to={ROUTES.NOTES}>Browse Notes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={ROUTES.CART}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Checkout</h1>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
                    className="space-y-4"
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={method.value} id={method.value} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xl">{method.icon}</span>
                            <Label htmlFor={method.value} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {method.processingTime}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="truncate mr-2">{item.title}</span>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${orderSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (10%)</span>
                      <span>${orderSummary.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Pay $${orderSummary.total.toFixed(2)}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

CheckoutPage.displayName = 'CheckoutPage';

export default CheckoutPage;
