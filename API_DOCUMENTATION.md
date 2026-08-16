# Annadata — Complete REST API Documentation

This document lists all REST API endpoints provided by the **Annadata Server** (Spring Boot backend).

- **Base URL (Local)**: `http://localhost:5454`
- **Authentication**: Bearer Token in `Authorization` header (`Bearer <JWT>`)

---

## 1. Authentication & Account APIs (`/auth`)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | No | Register a new customer account |
| `POST` | `/auth/signin` | No | Login customer / get JWT token |
| `POST` | `/auth/sent/login-signup-otp` | No | Send email OTP for login/signup |

---

## 2. Customer / Buyer APIs (`/api`)

### Products & Browse
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/products` | No | Search & filter products (page, category, price, sort) |
| `GET` | `/api/products/{id}` | No | Get product details by ID |
| `GET` | `/api/products/search` | No | Full-text search products |
| `GET` | `/api/home` | No | Fetch homepage banners, categories, and deals |

### Cart Management
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Customer JWT | Fetch current user's cart |
| `PUT` | `/api/cart/add` | Customer JWT | Add product item to cart |
| `DELETE` | `/api/cart/item/{cartItemId}` | Customer JWT | Remove item from cart |
| `PUT` | `/api/cart/item/{cartItemId}` | Customer JWT | Update cart item quantity |

### Orders & Checkout
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Customer JWT | Create a new order with shipping address |
| `GET` | `/api/orders/user` | Customer JWT | Get customer order history |
| `GET` | `/api/orders/{orderId}` | Customer JWT | Get detailed order info |
| `PUT` | `/api/orders/{orderId}/cancel` | Customer JWT | Cancel order |

### Payments
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/payment/{paymentMethod}/create-link` | Customer JWT | Generate Razorpay or Stripe payment link |
| `GET` | `/api/payment/{paymentId}` | Customer JWT | Verify payment status |

### Reviews & Wishlist
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/products/{productId}/reviews` | No | Public product reviews |
| `POST` | `/api/products/{productId}/reviews` | Customer JWT | Write product review |
| `GET` | `/api/wishlist` | Customer JWT | Get customer wishlist |
| `POST` | `/api/wishlist/add/{productId}` | Customer JWT | Toggle product in wishlist |

---

## 3. Seller / Farmer APIs (`/sellers` & `/seller`)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/sellers/register` | No | Register new seller (Phase 1) |
| `POST` | `/sellers/login` | No | Seller login |
| `GET` | `/sellers/profile` | Seller JWT | Get authenticated seller profile |
| `PATCH` | `/sellers/profile` | Seller JWT | Update business/bank details |
| `POST` | `/seller/products` | Seller JWT | Create new product listing |
| `GET` | `/seller/products` | Seller JWT | Get seller listed products |
| `PUT` | `/seller/products/{id}` | Seller JWT | Update product stock / price |
| `DELETE` | `/seller/products/{id}` | Seller JWT | Delete product |
| `GET` | `/seller/orders` | Seller JWT | Get orders containing seller's items |
| `PUT` | `/seller/orders/{orderId}/status` | Seller JWT | Update item fulfillment status |
| `GET` | `/seller/transactions` | Seller JWT | View earnings & payout history |

---

## 4. Delivery Personnel APIs (`/delivery`)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/delivery/signup` | No | Delivery partner signup |
| `POST` | `/delivery/login` | No | Delivery partner login |
| `GET` | `/delivery/profile` | Delivery JWT | Get delivery person profile |
| `GET` | `/delivery/orders` | Delivery JWT | View assigned delivery orders |
| `PUT` | `/delivery/orders/{orderId}/status` | Delivery JWT | Update status (`PICKED_UP`, `DELIVERED`) |
| `POST` | `/delivery/orders/{orderId}/verify-otp` | Delivery JWT | Verify customer OTP on delivery |

---

## 5. Admin Portal APIs (`/admin`)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/admin/dashboard` | Admin JWT | High-level platform stats & revenue metrics |
| `GET` | `/admin/sellers` | Admin JWT | List all registered sellers (filter by status) |
| `PATCH` | `/admin/sellers/{id}/status` | Admin JWT | Approve, suspend, or ban seller account |
| `GET` | `/admin/orders` | Admin JWT | View all platform orders |
| `PUT` | `/admin/orders/{orderId}/assign/{deliveryBoyId}` | Admin JWT | Assign order to delivery person |
| `GET` | `/admin/coupons` | Admin JWT | List promotional coupons |
| `POST` | `/admin/coupons` | Admin JWT | Create new coupon discount |
| `DELETE` | `/admin/coupons/{id}` | Admin JWT | Delete coupon |
| `GET` | `/admin/commission/save` | Admin JWT | View / Update admin commission percentages |

---

## 6. AI Assistant APIs (`/ai`)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/ai/chat` | JWT | Ask Annadata Gemini AI chatbot product/farming questions |
