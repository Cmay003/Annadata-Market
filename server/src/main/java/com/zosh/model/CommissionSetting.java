
package com.zosh.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class CommissionSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Commission
    private Double platformCommissionPercent = 5.0;

    // Delivery
    private Integer deliveryCharge = 20;

    private Double perKmCharge = 5.0;

    private Double freeDeliveryAbove = 500.0;

    // private Double deliveryCharge;

    // Discount
    private Boolean discountEnabled = false;

    private Double maxDiscountPercent = 10.0;

    private Double minOrderForDiscount = 300.0;

    private Boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();
}