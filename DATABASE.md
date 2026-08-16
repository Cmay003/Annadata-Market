# Annadata — Database Schema & ER Diagram Documentation

This document contains the complete database entity model, entity-relationship (ER) diagram, and relational schema for the **Annadata** multivendor marketplace.

---

## Visual Entity-Relationship (ER) Diagram

```mermaid
erDiagram

    USER ||--o{ ORDER : "places"
    USER ||--o{ ADDRESS : "has"
    USER ||--o| CART : "owns"
    USER ||--o| WISHLIST : "owns"
    USER ||--o{ REVIEW : "writes"

    SELLER ||--o{ PRODUCT : "manages"
    SELLER ||--o{ ORDER_ITEM : "fulfills"
    SELLER ||--o{ TRANSACTION : "earns"
    SELLER ||--o| BANK_DETAILS : "has"
    SELLER ||--o| BUSINESS_DETAILS : "has"

    CATEGORY ||--o{ PRODUCT : "classifies"
    CATEGORY ||--o{ CATEGORY : "parent_of"

    PRODUCT ||--o{ CART_ITEM : "in_cart"
    PRODUCT ||--o{ ORDER_ITEM : "in_order"
    PRODUCT ||--o{ REVIEW : "has_reviews"

    CART ||--o{ CART_ITEM : "contains"
    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER ||--o| ADDRESS : "shipping_address"
    ORDER ||--o| PAYMENT_DETAILS : "payment_info"

    DELIVERY_BOY ||--o{ ORDER : "assigned_to"

    USER {
        Long id PK
        String email
        String fullName
        String mobile
        USER_ROLE role
        String password
    }

    SELLER {
        Long id PK
        String sellerName
        String email
        String mobile
        String gstin
        AccountStatus status
    }

    PRODUCT {
        Long id PK
        String title
        String description
        double mrpPrice
        double sellingPrice
        int quantity
        Long category_id FK
        Long seller_id FK
    }

    ORDER {
        Long id PK
        String orderId
        OrderStatus orderStatus
        double totalAmount
        PaymentStatus paymentStatus
        Long user_id FK
        Long delivery_boy_id FK
    }

    ORDER_ITEM {
        Long id PK
        int quantity
        double price
        Long order_id FK
        Long product_id FK
        Long seller_id FK
    }

    CART {
        Long id PK
        double totalSellingPrice
        int totalItem
        Long user_id FK
    }

    CART_ITEM {
        Long id PK
        int quantity
        double sellingPrice
        Long cart_id FK
        Long product_id FK
    }

    DELIVERY_BOY {
        Long id PK
        String name
        String email
        String mobile
        DeliveryStatus status
    }

    TRANSACTION {
        Long id PK
        double amount
        String transactionId
        Long seller_id FK
        Long order_id FK
    }

    COUPON {
        Long id PK
        String code
        double discountPercentage
        boolean active
    }
```

---

## Core Relational Schema Tables

### 1. `users` Table
Stores customer, admin, seller, and delivery user accounts.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | User email address |
| `full_name` | `VARCHAR(255)` | `NOT NULL` | Full name |
| `password` | `VARCHAR(255)` | `NOT NULL` | BCrypt hashed password |
| `mobile` | `VARCHAR(20)` | `NULLABLE` | Mobile contact number |
| `role` | `VARCHAR(50)` | `NOT NULL` | Role: `ROLE_CUSTOMER`, `ROLE_ADMIN`, `ROLE_SELLER`, `ROLE_DELIVERY` |

---

### 2. `seller` Table
Stores seller (farmer) profile, GSTIN, business, and verification status.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique seller identifier |
| `seller_name` | `VARCHAR(255)` | `NOT NULL` | Business / Farmer name |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Seller email |
| `mobile` | `VARCHAR(20)` | `NOT NULL` | Seller phone number |
| `gstin` | `VARCHAR(50)` | `NULLABLE` | GST Identification Number |
| `account_status` | `VARCHAR(50)` | `DEFAULT 'PENDING'` | Status: `PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `BANNED` |

---

### 3. `product` Table
Stores produce items listed by farmers/sellers.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Product ID |
| `title` | `VARCHAR(255)` | `NOT NULL` | Product name |
| `description` | `TEXT` | `NULLABLE` | Detailed description |
| `mrp_price` | `DOUBLE` | `NOT NULL` | Maximum retail price |
| `selling_price` | `DOUBLE` | `NOT NULL` | Discounted selling price |
| `quantity` | `INT` | `NOT NULL` | Stock quantity available |
| `category_id` | `BIGINT` | `FOREIGN KEY (category.id)` | Category reference |
| `seller_id` | `BIGINT` | `FOREIGN KEY (seller.id)` | Farmer/Seller reference |

---

### 4. `orders` Table
Stores customer orders.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Order ID |
| `order_id` | `VARCHAR(100)` | `UNIQUE` | Human-readable order code |
| `user_id` | `BIGINT` | `FOREIGN KEY (users.id)` | Buyer reference |
| `shipping_address_id` | `BIGINT` | `FOREIGN KEY (address.id)` | Delivery address |
| `total_amount` | `DOUBLE` | `NOT NULL` | Total order amount |
| `order_status` | `VARCHAR(50)` | `NOT NULL` | `PENDING`, `PLACED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| `payment_status` | `VARCHAR(50)` | `NOT NULL` | `PENDING`, `COMPLETED`, `FAILED` |
| `delivery_boy_id` | `BIGINT` | `FOREIGN KEY (delivery_boy.id)` | Assigned delivery person |

---

### 5. `order_item` Table
Stores individual line items within an order.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Line item ID |
| `order_id` | `BIGINT` | `FOREIGN KEY (orders.id)` | Parent order |
| `product_id` | `BIGINT` | `FOREIGN KEY (product.id)` | Purchased product |
| `seller_id` | `BIGINT` | `FOREIGN KEY (seller.id)` | Seller fulfilling this item |
| `quantity` | `INT` | `NOT NULL` | Quantity purchased |
| `mrp_price` | `DOUBLE` | `NOT NULL` | Unit MRP |
| `selling_price` | `DOUBLE` | `NOT NULL` | Unit selling price |

---

### 6. `delivery_boy` Table
Stores registered delivery personnel.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Delivery person ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | Delivery boy full name |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Email |
| `mobile` | `VARCHAR(20)` | `NOT NULL` | Phone number |
| `status` | `VARCHAR(50)` | `DEFAULT 'AVAILABLE'` | `AVAILABLE`, `ON_DELIVERY`, `INACTIVE` |

---

### 7. `transactions` Table
Stores financial payouts and transaction records for seller earnings.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Transaction ID |
| `seller_id` | `BIGINT` | `FOREIGN KEY (seller.id)` | Target seller |
| `order_id` | `BIGINT` | `FOREIGN KEY (orders.id)` | Associated order |
| `amount` | `DOUBLE` | `NOT NULL` | Payout amount |
| `date` | `DATETIME` | `NOT NULL` | Transaction timestamp |
