/**
 * @fileoverview Cart page component for viewing and managing cart items
 * @author NoteMart Team
 * @created 2024
 */

import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { ROUTES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

/**
 * Cart page component
 */
export const CartPage: React.FC = memo(() => {
  const { items, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { toast } = useToast();

  /**
   * Handle item removal with confirmation
   */
  const handleRemoveItem = (itemId: string, itemTitle: string) => {
    removeItem(itemId);
    toast({
      title: "Item Removed",
      description: `${itemTitle} has been removed from your cart.`
    });
  };

  /**
   * Handle clearing cart with confirmation
   */
  const handleClearCart = () => {
    if (items.length === 0) return;
    
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart."
    });
  };

  /**
   * Memoized cart summary
   */
  const cartSummary = useMemo(() => ({
    subtotal: totalPrice,
    tax: totalPrice * 0.1, // 10% tax
    total: totalPrice * 1.1
  }), [totalPrice]);

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="text-3xl font-bold text-primary mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground text-lg">
              Discover amazing study notes to add to your cart
            </p>
          </div>
          
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
            <Link to={ROUTES.NOTES}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Browse Notes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-primary mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Subject: {item.subject}
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Digital Note
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          By: {item.seller}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Price and Actions */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xl font-bold text-primary mb-4">
                        ${item.price.toFixed(2)}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>${cartSummary.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link to={ROUTES.CHECKOUT}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to={ROUTES.NOTES}>
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

CartPage.displayName = 'CartPage';

export default CartPage;
