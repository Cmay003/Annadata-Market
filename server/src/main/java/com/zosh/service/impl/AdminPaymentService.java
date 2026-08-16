package com.zosh.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zosh.domain.PaymentStatus;
import com.zosh.model.CommissionSetting;
import com.zosh.model.Order;
import com.zosh.model.PaymentRecord;
import com.zosh.model.Seller;
import com.zosh.repository.CommissionSettingRepository;
import com.zosh.repository.PaymentRecordRepository;
import com.zosh.repository.SellerRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AdminPaymentService {

    private final PaymentRecordRepository paymentRecordRepository;
    private final CommissionSettingRepository commissionRepository;
    private final SellerRepository sellerRepository; // ✅ ADD THIS

    public PaymentRecord createPaymentRecord(Order order) {

        // ✅ prevent duplicate
        if (paymentRecordRepository.existsByOrder(order)) {
            return null;
        }

        CommissionSetting setting = commissionRepository
                .findTopByOrderByCreatedAtDesc()
                .orElseGet(() -> {
                    CommissionSetting defaultSetting = new CommissionSetting();
                    defaultSetting.setPlatformCommissionPercent(5.0);
                    defaultSetting.setDeliveryCharge(20);
                    return defaultSetting;
                });

        double total = order.getTotalSellingPrice();

        double platformFee = total * setting.getPlatformCommissionPercent() / 100;
        double deliveryFee = setting.getDeliveryCharge();

        double payout = total - platformFee;

        // ✅ fetch seller (IMPORTANT)
        Seller seller = sellerRepository.findById(order.getSellerId()).orElse(null);

        PaymentRecord record = new PaymentRecord();

        record.setOrder(order);
        record.setSellerId(order.getSellerId());

        record.setTotalAmount(total);
        record.setPlatformFee(platformFee);
        record.setDeliveryFee(deliveryFee);
        record.setNetFarmerPayout(payout);

        record.setCommissionPercent(setting.getPlatformCommissionPercent());

        record.setPaymentStatus(PaymentStatus.COMPLETED);

        // ✅ FIXED
        record.setCustomerName(order.getUser().getFullName());
        record.setFarmerName(seller != null ? seller.getSellerName() : "Unknown");

        // ✅ FIXED TYPE
        record.setPaymentType(order.getPaymentMethod());

        record.setTransactionId("TXN_" + System.currentTimeMillis());

        // record.setPayoutDate(LocalDateTime.now());

        return paymentRecordRepository.save(record);
    }

    public List<PaymentRecord> getSellerPayments(Long sellerId) {
        return paymentRecordRepository.findBySellerId(sellerId);
    }

    public Double getTotalEarnings(Long sellerId) {
        Double earnings = paymentRecordRepository.getTotalEarnings(sellerId);
        return earnings != null ? earnings : 0.0;
    }


    public PaymentRecord getPaymentRecordByOrder(Order order) {
    return paymentRecordRepository.findByOrder(order);
}
}