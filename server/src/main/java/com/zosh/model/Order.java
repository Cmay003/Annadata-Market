package com.zosh.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.zosh.domain.DeliveryStatus;
import com.zosh.domain.OrderStatus;
import com.zosh.domain.PaymentMethod;
import com.zosh.domain.PaymentStatus;
import com.zosh.domain.RefundStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;

    @ManyToOne
    private User user;

    private Long sellerId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToOne
    private Address shippingAddress;

    // @Embedded
    // private PaymentDetails paymentDetails = new PaymentDetails();
    private double totalMrpPrice;

    private Integer totalSellingPrice;

    private Integer discount;

    // private OrderStatus orderStatus;
    private int totalItem;

    // private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    private LocalDateTime orderDate = LocalDateTime.now();
    private LocalDateTime deliverDate = orderDate.plusDays(7);

    private Long farmerId;   // who is selling

    private Long deliveryBoyId;  // assigned delivery partner

    @Enumerated(EnumType.STRING)
    private DeliveryStatus deliveryStatus; // ASSIGNED / OUT_FOR_DELIVERY / DELIVERED / CANCELLED

    private Boolean isCancelled = false;

    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus = RefundStatus.NONE;

    private Double refundAmount;

    private String refundReason;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private LocalDateTime deliveredAt;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    // private Double commissionPercent;
    // private Double commissionAmount;
    // private Double farmerAmount;
 
    private Double commissionPercent;

  
    private Double commissionAmount;


    private Double farmerAmount;

    private Integer deliveryCharge;

    // ─── OTP Delivery Verification ────────────────────────────────────────
    /** 6-digit OTP sent to customer when delivery boy picks up the order */
    private String deliveryOtp;

    /** True once OTP has been used to complete the delivery */
    private Boolean otpUsed = false;

}
