package com.zosh.model;

import java.time.LocalDateTime;

import com.zosh.domain.PaymentMethod;
import com.zosh.domain.PaymentStatus;
import com.zosh.domain.RefundStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class PaymentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // private String orderId;

    private Double totalAmount;
    private Double platformFee;
    private Double deliveryFee;
    private Double netFarmerPayout;

    private PaymentStatus paymentStatus;

    private String customerName;
    private String farmerName;

    private Double commissionPercent;   // ⭐ NEW

    // private String paymentType; // COD / ONLINE
    @Enumerated(EnumType.STRING)
private PaymentMethod paymentType;

    private LocalDateTime createdAt = LocalDateTime.now();
    private Long sellerId;

    private String transactionId;

    private Double refundedAmount;

    private String refundId;

    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus;

    private LocalDateTime payoutDate=LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;


}
