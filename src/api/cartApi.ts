import { api } from './api';


// Types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    price: number;
    discountPrice: number | null;
    sku: string;
    stock: number;
    profileImgUrl: string | null;
    isActive: boolean;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface GuestCartItem {
  productId: string;
  quantity: number;
}



// API Response types
export interface CartResponse {
  success: boolean;
  data: Cart;
}

export interface ErrorResponse {
  error: string;
}

// Create axios instance with auth interceptor


  // Add auth token to requests if available
  

export const cartApi = {
  // Get user's cart
  async getCart(): Promise<Cart> {
    const response = await api.get<CartResponse>('/cart');
    return response.data.data;
  },

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await api.post<CartResponse>('/cart/add', data);
    return response.data.data;
  },

  // Update cart item quantity
  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    const response = await api.put<CartResponse>(`/cart/items/${itemId}/quantity`, {
      quantity,
    });
    return response.data.data;
  },

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<Cart> {
    const response = await api.delete<CartResponse>(`/cart/items/${itemId}`);
    return response.data.data;
  },

  // Clear cart
  async clearCart(): Promise<Cart> {
    const response = await api.delete<CartResponse>('/cart/clear');
    return response.data.data;
  },


}; 