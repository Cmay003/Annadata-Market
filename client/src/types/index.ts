// src/types/index.ts

export interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface DashboardStats {
  totalFarmers: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeDeliveries: number;
}

export interface Farmer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmSize: string;
  products: string[];
  status: 'PENDING' | 'APPROVED' | 'BLOCKED';
  joinedDate: string;
  totalOrders: number;
  totalRevenue: number;
  rating: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  joinedDate: string;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  farmerId: number;
  farmerName: string;
  product: string;
  quantity: number;
  amount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMode: 'COD' | 'ONLINE';
  deliveryStatus: 'PLACED' | 'ACCEPTED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  deliveryBoyId: number | null;
  deliveryBoyName: string | null;
  createdAt: string;
  deliveredAt: string | null;
}

export interface DeliveryBoy {
  id: number;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_DELIVERY';
  rating: number;
  ordersCompleted: number;
  ordersCancelled: number;
  joinedDate: string;
  currentLocation: string;
}

export interface Payment {
  id: number;
  orderId: string;
  customerName: string;
  farmerName: string;
  totalAmount: number;
  platformFee: number;
  deliveryFee: number;
  netFarmerPayout: number;
  paymentStatus: 'PENDING' | 'SETTLED' | 'REFUNDED' | 'PARTIAL_REFUND';
  paymentMode: 'COD' | 'ONLINE';
  settledAt: string | null;
  createdAt: string;
}

export interface CommissionSettings {
  platformCommissionPercent: number;
  deliveryCharge: number;
  perKmCharge: number;
  freeDeliveryAbove: number;
  discountEnabled: boolean;
  maxDiscountPercent: number;
  minOrderForDiscount: number;
}

export interface RefundRequest {
  orderId: string;
  reason: string;
  refundType: 'FULL' | 'PARTIAL';
  partialAmount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}