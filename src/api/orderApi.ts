import {api} from './api';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  discountPrice: string | null;
  total: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    discountPrice: string | null;
    profileImgUrl: string | null;
  };
}

export interface OrderAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string;
  province: string;
  postalCode: string | null;
}
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subtotal: string;
  deliveryFee: string;
  discount: string;
  total: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash_on_delivery' | 'online_payment';
  specialInstructions?: string;
  deliveryAddress: string;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address: OrderAddress;
}

export interface CreateOrderRequest {
  addressId: string;
  paymentMethod: 'cash_on_delivery' | 'online_payment';
  specialInstructions?: string;
  discount?: number;
  couponCode?: string;
  deliveryFee?: number;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    total: number;
  };
}

interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  outForDeliveryOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

interface StatisticsResponse {
  success: boolean;
  data: OrderStatistics;
}



export const orderApi = {
  // Create new order
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<OrderResponse>('/orders', data);
    return response.data.data;
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
      const response = await api.get<OrderResponse>(`/orders/${orderId}`);
    return response.data.data;
  },

  // Get user's orders
  async getUserOrders(filters: OrderFilters = {}): Promise<{ orders: Order[]; total: number }> {
        const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);

    const response = await api.get<OrdersResponse>(`/orders/user/orders?${params.toString()}`);
    return response.data.data;
  },

  // Get all orders (admin only)
  async getAllOrders(filters: OrderFilters = {}): Promise<{ orders: Order[]; total: number }> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);

    const response = await api.get<OrdersResponse>(`/orders/admin/all?${params.toString()}`);
    return response.data.data;
  },

  // Get order statistics (admin only)
  async getOrderStatistics(): Promise<OrderStatistics> {
    const response = await api.get<StatisticsResponse>('/orders/admin/statistics');
    return response.data.data;
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await api.patch<OrderResponse>(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  // User cancels their own order
  async userCancelOrder(orderId: string): Promise<Order> {
      const response = await api.patch<OrderResponse>(`/orders/${orderId}/cancel`);
    return response.data.data;
  },

  // Update payment status (admin only)
  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<Order> {
      
    const response = await api.patch<OrderResponse>(`/orders/${orderId}/payment-status`, { paymentStatus });
    return response.data.data;
  },

  // Assign order to staff (admin only)
  async assignOrderToStaff(orderId: string, staffId: string): Promise<Order> {
    const response = await api.patch<OrderResponse>(`/orders/${orderId}/assign`, { staffId });
    return response.data.data;
  },
};
