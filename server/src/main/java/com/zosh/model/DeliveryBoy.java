package com.zosh.model;

import com.zosh.domain.AccountStatus;
import com.zosh.domain.USER_ROLE;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryBoy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String phone;

    // ─── Vehicle Details ──────────────────────────────────────
    private String vehicleType;   // BIKE, CAR, VAN

    private String vehicleNumber;

    /** Legacy field kept for backward compat */
    private String vehicleDetails;

    // ─── Status & Auth ────────────────────────────────────────
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_DELIVERY;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

    /** Delivery status: AVAILABLE | ON_DELIVERY | OFFLINE */
    private String deliveryStatus = "AVAILABLE";

    // ─── Location (for route optimizer) ──────────────────────
    private Double latitude;

    private Double longitude;

    private String currentCity;

    private String currentPincode;

    // ─── Performance ─────────────────────────────────────────
    private Double rating = 0.0;

    private Integer completedOrders = 0;

    private Integer cancelledOrders = 0;

    private Double totalEarnings = 0.0;
}