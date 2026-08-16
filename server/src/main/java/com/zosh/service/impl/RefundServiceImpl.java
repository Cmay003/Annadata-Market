package com.zosh.service.impl;

import org.springframework.stereotype.Service;

import com.zosh.domain.PaymentStatus;
import com.zosh.domain.RefundStatus;
import com.zosh.model.Order;
import com.zosh.model.PaymentRecord;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.PaymentRecordRepository;
import com.zosh.service.RefundService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final OrderRepository orderRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final AdminWalletService walletService;

    @Override
    public void processRefund(Long orderId, String reason) throws Exception {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));

        PaymentRecord paymentRecord
                = paymentRecordRepository.findByOrder(order);

        if (paymentRecord == null) {
            throw new Exception("Payment record not found");
        }

        // ✅ already refunded check
        if (order.getRefundStatus() == RefundStatus.COMPLETED) {
            throw new Exception("Order already refunded");
        }

        // // ✅ wallet reverse
        // walletService.debit(
        //         order.getTotalSellingPrice(),
        //         order.getOrderId()
        // );
        walletService.refund(
                order.getTotalSellingPrice(),
                order.getOrderId()
        );

        // ✅ payout reverse
        walletService.credit(
                paymentRecord.getNetFarmerPayout(),
                "REFUND-" + order.getOrderId()
        );

        // ✅ order update
        order.setRefundStatus(RefundStatus.COMPLETED);

        order.setRefundAmount(
                Double.valueOf(order.getTotalSellingPrice())
        );

        order.setRefundReason(reason);

        order.setPaymentStatus(PaymentStatus.REFUNDED);

        orderRepository.save(order);

        // ✅ payment record update
        paymentRecord.setRefundedAmount(
                Double.valueOf(order.getTotalSellingPrice())
        );

        paymentRecord.setRefundStatus(RefundStatus.COMPLETED);

        paymentRecordRepository.save(paymentRecord);
    }
}
