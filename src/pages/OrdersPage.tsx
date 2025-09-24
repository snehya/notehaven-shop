/**
 * @fileoverview Orders page component for viewing purchase history
 * @author NoteMart Team
 * @created 2024
 */

import React, { memo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Download, Calendar, CreditCard, Check } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { PaymentMethod, getPaymentMethodInfo } from '@/lib/paymentService';

/**
 * Order interface
 */
interface Order {
  id: string;
  transactionId: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentMethod: PaymentMethod;
  date: Date;
  status: 'completed' | 'processing' | 'failed';
}

/**
 * Orders page component
 */
export const OrdersPage: React.FC = memo(() => {
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);

  /**
   * Load orders from localStorage and location state
   */
  useEffect(() => {
    // Load existing orders from localStorage
    const savedOrders = localStorage.getItem('notemart_orders');
    const existingOrders = savedOrders ? JSON.parse(savedOrders) : [];

    // Add new order from checkout if present
    if (location.state?.orderData) {
      const newOrder: Order = {
        id: `order_${Date.now()}`,
        ...location.state.orderData,
        status: 'completed' as const
      };
      
      const updatedOrders = [newOrder, ...existingOrders];
      setOrders(updatedOrders);
      
      // Save to localStorage
      localStorage.setItem('notemart_orders', JSON.stringify(updatedOrders));
      
      // Clear location state
      window.history.replaceState({}, document.title);
    } else {
      setOrders(existingOrders);
    }
  }, [location.state]);

  /**
   * Format date for display
   */
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge variant
   */
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="text-3xl font-bold text-primary mb-2">No Orders Yet</h1>
            <p className="text-muted-foreground text-lg">
              When you make your first purchase, it will appear here
            </p>
          </div>
          
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
            <Link to={ROUTES.NOTES}>
              Start Shopping
            </Link>
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
          <h1 className="text-3xl font-bold text-primary mb-2">Order History</h1>
          <p className="text-muted-foreground">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const paymentInfo = getPaymentMethodInfo(order.paymentMethod);
            
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(order.date)}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="mr-1 h-4 w-4" />
                      {paymentInfo.name}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">{paymentInfo.icon}</span>
                      Transaction: {order.transactionId}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                            <Download className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-primary">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            ${item.price.toFixed(2)}
                          </div>
                          <Button size="sm" variant="outline" className="mt-1">
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Total */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-muted-foreground">
                        Payment completed successfully
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Order Total</div>
                      <div className="text-xl font-bold text-primary">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to={ROUTES.NOTES}>
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
});

OrdersPage.displayName = 'OrdersPage';

export default OrdersPage;
