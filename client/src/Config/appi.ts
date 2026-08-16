

import type { CommissionSettings } from "../types";
import { api } from "./Api"; // ✅ Ek hi axios instance use karo

// ─── SELLERS (Farmers) ───────────────────────────────────────
// Backend: GET /sellers?status=ACTIVE  → SellerController.java
export const farmerApi = {
  // Saare sellers/farmers — status filter optional
  getAll: (page = 0, size = 10, status?: string) =>
    api.get("/sellers", { params: { status } }),

  // Seller by ID
  getById: (id: number) => api.get(`/sellers/${id}`),

  // Seller account status change — ACTIVE, SUSPENDED, BANNED etc.
  updateStatus: (id: number, status: string) =>
    api.patch(`/admin/sellers/${id}/status`, { status }),
};

// ─── ORDERS (Admin) ──────────────────────────────────────────
// Backend: GET /admin/orders → AdminOrderController.java
export const orderApi = {
  // Saare orders
  getAll: () => api.get("/admin/orders"),

  // Order by ID
  getById: (id: number) => api.get(`/api/orders/${id}`),

  // Order status update
  updateStatus: (orderId: number, status: string) =>
    api.put(`/admin/orders/${orderId}/status`, null, { params: { status } }),

  // Delivery boy assign
  assignDeliveryBoy: (orderId: number, deliveryBoyId: number) =>
    api.put(`/admin/orders/${orderId}/assign/${deliveryBoyId}`),

  // Cancel order
  cancel: (orderId: number) =>
    api.put(`/admin/orders/${orderId}/cancel`),
};

// ─── DELIVERY BOYS ───────────────────────────────────────────
// Backend: GET /admin/delivery → AdminDeliveryController.java
export const deliveryApi = {
  // Saare delivery boys
  getAll: () => api.get("/admin/delivery"),

  // Delivery boy by ID
  getById: (id: number) => api.get(`/admin/delivery/${id}`),
};

// ─── PAYMENTS / TRANSACTIONS ─────────────────────────────────
// Backend: GET /api/transactions → TransactionController.java
export const paymentApi = {
  // Seller transactions
  getSellerTransactions: (sellerId: number) =>
    api.get(`/api/transactions/seller/${sellerId}`),

  // Payment success verify
  verifyPayment: (paymentId: string, paymentLinkId: string) =>
    api.get(`/api/payment/${paymentId}`, { params: { paymentLinkId } }),
};

// ─── COMMISSION SETTINGS ─────────────────────────────────────
// Backend: GET /admin/commission → AdminCommissionController.java
export const commissionApi = {
  getSettings: () => api.get("/admin/commission/save"),

  // updateSettings: (data: { commissionPercentage: number }) =>
  //   api.put("/admin/commission/save", data),

  updateSettings: (data: CommissionSettings) =>
  api.put("/admin/commission/save", data),
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
// Backend: GET /admin/dashboard → AdminDashboardController.java
export const dashboardApi = {
  getStats: () => api.get("/admin/dashboard"),
};

// ─── COUPONS (Admin) ─────────────────────────────────────────
// Backend: AdminCouponController.java
export const couponApi = {
  getAll: () => api.get("/admin/coupons"),
  create: (data: any) => api.post("/admin/coupons", data),
  delete: (id: number) => api.delete(`/admin/coupons/${id}`),
};

export const sellerCommissionApi = {

  getCurrentCommission: () =>
    api.get("/commission")

};