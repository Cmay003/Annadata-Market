


package com.zosh.domain;


public enum OrderStatus {

    // ── Order Lifecycle ─────────────────────────────────────────
    PENDING,            // Order cart mein hai, checkout nahi hua
    PLACED,             // Customer ne order place kiya (COD ya payment initiated)
    CONFIRMED,          // Seller (Farmer) ne order accept kiya
    PACKED,             // Farmer ne pack kar diya
    READY_FOR_PICKUP,   // Delivery boy pickup ke liye ready
    IN_TRANSIT,         // Delivery boy ne pick kiya, delivery mein hai
    SHIPPED,            // Long distance — shipped via courier (optional step)
    DELIVERED,          // Customer ko deliver ho gaya

    // ── Terminal States ──────────────────────────────────────────
    CANCELLED,          // User ya Admin ne cancel kiya
    RETURNED            // Delivery ke baad customer ne return kiya
}