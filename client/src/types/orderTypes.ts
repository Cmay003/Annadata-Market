// import type { Product } from './productTypes';
// import type { Address, User } from './userTypes';

// export interface OrderState {
//     orders: Order[];
//     orderItem:OrderItem | null;
//     currentOrder: Order | null;
//     paymentOrder: any | null;
//     loading: boolean;
//     error: string | null;
//     orderCanceled: boolean
// }

// export interface Order {
//     id: number;
//     orderId: string;
//     user: User;
//     sellerId: number;
//     orderItems: OrderItem[];
//     orderDate: string; 
//     shippingAddress: Address;
//     paymentDetails: any;
//     totalMrpPrice: number;
//     totalSellingPrice?: number; // Optional field
//     discount?: number; // Optional field
//     orderStatus: OrderStatus;
//     totalItem: number;
//     deliverDate:string;
// }

// export const OrderStatus = {
//     PENDING: 'PENDING',
//     SHIPPED: 'SHIPPED',
//     DELIVERED: 'DELIVERED',
//     CANCELLED: 'CANCELLED'
// } as const;

// export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// export interface OrderItem {
//     id: number;
//     order: Order;
//     product: Product;
//     // size: string;
//     quantity: number;
//     mrpPrice: number;
//     sellingPrice: number; 
//     userId: number;
// }


import type { Product } from './productTypes';
import type { Address, User } from './userTypes';

export interface OrderState {
    orders: Order[];
    orderItem: OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any | null;
    loading: boolean;
    error: string | null;
    orderCanceled: boolean;
    paymentVerified: boolean;
}

export interface Order {

    id: number;

    orderId: string;

    user: User;

    sellerId: number;

    orderItems: OrderItem[];

    orderDate: string;

    shippingAddress: Address;

    paymentDetails: any;

    totalMrpPrice: number;

    totalSellingPrice?: number;

    discount?: number;

    totalItem: number;

    deliverDate: string;

    // ✅ NEW
    paymentMethod?: string;

    // ✅ NEW
    paymentStatus?: string;

    // ✅ NEW
    deliveryStatus?: string;

    // ✅ NEW
    deliveryBoyId?: number;

    // ✅ NEW
    couponCode?: string;

    // ✅ NEW
    couponPrice?: number;


        // ✅ Commission Fields
    commissionPercent?: number;

    commissionAmount?: number;

    farmerAmount?: number;


    orderStatus: OrderStatus;

    // ─── OTP Delivery (shown to customer when order is IN_TRANSIT) ───────────
    deliveryOtp?: string | null;
    otpUsed?: boolean;
    deliveryCharge?: number;
}

// export const OrderStatus = {
//     PENDING: 'PENDING',
//     SHIPPED: 'SHIPPED',
//     DELIVERED: 'DELIVERED',
//     CANCELLED: 'CANCELLED'
// } as const;

export const OrderStatus = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PACKED:"PACKED",
  READY_FOR_PICKUP:"READY_FOR_PICKUP",
  IN_TRANSIT:"IN_TRANSIT",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus =
    typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderItem {

    id: number;

    order: Order;

    product: Product;

    quantity: number;

    mrpPrice: number;

    sellingPrice: number;

    userId: number;
}