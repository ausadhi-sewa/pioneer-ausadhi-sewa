 import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { closeCart } from '../../features/cart/cartSlice';
import { useCart } from '../../utils/hooks/useCart';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  Package,
  CreditCard,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function CartDrawer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.cart);

  
  const {
    items,
    loading,
    error,
    isAuthenticated,
    isEmpty,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearCartError,
  } = useCart();

  const handleClose = () => {
    dispatch(closeCart());
    if (error) {
      clearCartError();
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-medical-green-600" />
                <DrawerTitle className="text-xl font-bold text-neutral-800">
                  Shopping Cart
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="text-neutral-600">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
              {!isAuthenticated && (
                <span className="block text-sm text-amber-600 mt-1">
                  Guest cart - Sign in to save your items
                </span>
              )}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-medical-green-600" />
                <span className="ml-2 text-neutral-600">Loading cart...</span>
              </div>
            )}

            {/* Empty Cart */}
            {!loading && isEmpty && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">Your cart is empty</h3>
                <p className="text-neutral-500">Add some products to get started!</p>
              </div>
            )}

            {/* Cart Items */}
            {!loading && !isEmpty && (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-neutral-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.profileImgUrl ? (
                          <img
                            src={item.product.profileImgUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-neutral-500 truncate">
                          {item.product.shortDescription || item.product.description}
                        </p>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mt-2">
                          {item.product.discountPrice ? (
                            <>
                              <span className="text-lg font-bold text-medical-green-600">
                                रु {item.product.discountPrice}
                              </span>
                              <span className="text-sm text-neutral-400 line-through">
                                रु{item.product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-medical-green-600">
                              रु{item.product.price}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={loading}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={loading}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Summary */}
            {!loading && !isEmpty && (
              <>
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">रु{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Delivery Fee */}
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Delivery Fee</span>
                    <span className="font-medium text-medical-green-600">Free</span>
                  </div>
                  
                  <Separator />
                  
                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-medical-green-600">रु{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-6">
                  <LiquidButton 
                    className="w-full h-12 text-black rounded-lg backdrop:bg-medical-green-100"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </LiquidButton>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-black hover:text-black"
                    onClick={handleClearCart}
                    disabled={loading}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 