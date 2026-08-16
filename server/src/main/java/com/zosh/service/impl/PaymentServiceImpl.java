package com.zosh.service.impl;

import java.util.Optional;
import java.util.Set;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.zosh.domain.OrderStatus;
import com.zosh.domain.PaymentMethod;
import com.zosh.domain.PaymentOrderStatus;
import com.zosh.domain.PaymentStatus;
import com.zosh.model.Order;
import com.zosh.model.PaymentOrder;
import com.zosh.model.PaymentRecord;
import com.zosh.model.Seller;
import com.zosh.model.SellerReport;
import com.zosh.model.User;
import com.zosh.repository.CartRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.PaymentOrderRepository;
import com.zosh.repository.PaymentRecordRepository;
import com.zosh.repository.SellerRepository;
import com.zosh.service.PaymentService;
import com.zosh.service.SellerReportService;
import com.zosh.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    // @Value("${razorpay.api.key}")
    private String apiKey;

    // @Value("${razorpay.api.secret}")
    private String apiSecret;

    private final PaymentOrderRepository paymentOrderRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AdminWalletService walletService;
    private final AdminPaymentService adminPaymentService;
    private final PaymentRecordRepository paymentRecordRepository;
    private final TransactionService transactionService;
    private final SellerRepository sellerRepository;
    private final SellerReportService sellerReportService;

    @Override
    public PaymentOrder createOrder(User user, Set<Order> orders) {
        Long amount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();
        int couponPrice = cartRepository.findByUserId(user.getId()).getCouponPrice();

        PaymentOrder order = new PaymentOrder();
        order.setUser(user);
        order.setAmount(amount - couponPrice);
        order.setOrders(orders);

        return paymentOrderRepository.save(order);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        Optional<PaymentOrder> optionalPaymentOrder = paymentOrderRepository.findById(id);
        if (optionalPaymentOrder.isEmpty()) {
            throw new Exception("payment order not found with id " + id);
        }
        return optionalPaymentOrder.get();
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String paymentLinkId) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository
                .findByPaymentLinkId(paymentLinkId);

        if (paymentOrder == null) {
            throw new Exception("payment order not found with id " + paymentLinkId);
        }
        return paymentOrder;
    }

    @Override
    public Boolean ProceedPaymentOrder(PaymentOrder paymentOrder,
            String paymentId,
            String paymentLinkId) throws RazorpayException {

        if (paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)) {

            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
            Payment payment = razorpay.payments.fetch(paymentId);

            Integer amount = payment.get("amount");
            String status = payment.get("status");

//                 if(status.equals("captured")){
// //                    System.out.println("payment ===== captured");
//                     Set<Order> orders=paymentOrder.getOrders();
//                     for(Order order:orders){
//                         order.setPaymentStatus(PaymentStatus.COMPLETED);
//                         orderRepository.save(order);
//                     }
//                     paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
//                     paymentOrderRepository.save(paymentOrder);
//                     return true;
//                 }
// if(status.equals("captured")) {
//     Set<Order> orders = paymentOrder.getOrders();
//     for(Order order : orders){
//         // ✅ 1. CREDIT full amount to Admin Wallet
//         walletService.credit(order.getTotalSellingPrice(), order.getOrderId().toString());
//         // ✅ 2. Create PaymentRecord (commission calculation)
//         PaymentRecord record = adminPaymentService.createPaymentRecord(order);
//         // ✅ 3. DEBIT farmer payout
//         walletService.debit(record.getNetFarmerPayout(), order.getOrderId().toString());
//         order.setPaymentStatus(PaymentStatus.COMPLETED);
//         orderRepository.save(order);
//     }
//     paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
//     paymentOrderRepository.save(paymentOrder);
//     return true;
// }
            if (status.equals("captured")) {

                // ✅ 1. CREDIT FULL AMOUNT ONCE
                walletService.credit(paymentOrder.getAmount(), paymentOrder.getId().toString());

                Set<Order> orders = paymentOrder.getOrders();

                // for(Order order : orders){
                //     order.setPaymentStatus(PaymentStatus.COMPLETED);
                //     // ✅ 2. CREATE PAYMENT RECORD
                //     adminPaymentService.createPaymentRecord(order);
                //     orderRepository.save(order);
                // }
//     for(Order order : orders){
//     order.setPaymentStatus(PaymentStatus.COMPLETED);
//     // ✅ 1. CREATE PAYMENT RECORD
//     PaymentRecord record = adminPaymentService.createPaymentRecord(order);
//     // ✅ 2. CREATE TRANSACTION (IMPORTANT)
//     transactionService.createTransaction(order, record);
//     orderRepository.save(order);
// }
                // for (Order order : orders) {
                //     // ✅ Payment Success
                //     order.setPaymentStatus(PaymentStatus.COMPLETED);
                //     // ✅ IMPORTANT FIX
                //     order.setPaymentMethod(PaymentMethod.RAZORPAY);
                //     // ✅ Order placed
                //     order.setOrderStatus(OrderStatus.PLACED);
                //     // ✅ Create payment record
                //     PaymentRecord record = adminPaymentService.createPaymentRecord(order);
                //     // // ✅ Create transaction
                //     // transactionService.createTransaction(order, record);
                //     // ✅ Prevent null duplicate issue
                //     if (record != null) {
                //         // ✅ Farmer payout debit
                //         walletService.debit(
                //                 record.getNetFarmerPayout(),
                //                 order.getOrderId()
                //         );
                //         // ✅ Create transaction
                //         transactionService.createTransaction(order, record);
                //     }
                //     // ✅ Update seller report
                //     Seller seller = sellerRepository.findById(order.getSellerId()).orElse(null);
                //     if (seller != null) {
                //         SellerReport report = sellerReportService.getSellerReport(seller);
                //         report.setTotalOrders(report.getTotalOrders() + 1);
                //         report.setTotalSales(
                //                 report.getTotalSales() + order.getOrderItems().size()
                //         );
                //         report.setTotalEarnings(
                //                 report.getTotalEarnings() + record.getNetFarmerPayout()
                //         );
                //         sellerReportService.updateSellerReport(report);
                //     }
                //     orderRepository.save(order);
                // }
                for (Order order : orders) {

                    // ✅ Payment Success
                    order.setPaymentStatus(PaymentStatus.COMPLETED);

                    // ✅ IMPORTANT FIX
                    order.setPaymentMethod(PaymentMethod.RAZORPAY);

                    // ✅ Order placed
                    order.setOrderStatus(OrderStatus.PLACED);

                    // ✅ Create payment record
                    PaymentRecord record
                            = adminPaymentService.createPaymentRecord(order);

                    // ✅ IMPORTANT FIX
                    if (record != null) {

                        // ✅ Farmer payout debit
                        walletService.debit(
                                record.getNetFarmerPayout(),
                                order.getOrderId()
                        );

                        // ✅ Create transaction
                        transactionService.createTransaction(order, record);
                    }

                    // ✅ Update seller report
                    Seller seller = sellerRepository
                            .findById(order.getSellerId())
                            .orElse(null);

                    if (seller != null && record != null) {

                        SellerReport report
                                = sellerReportService.getSellerReport(seller);

                        report.setTotalOrders(
                                report.getTotalOrders() + 1
                        );

                        report.setTotalSales(
                                report.getTotalSales()
                                + order.getOrderItems().size()
                        );

                        report.setTotalEarnings(
                                report.getTotalEarnings()
                                + record.getNetFarmerPayout()
                        );

                        sellerReportService.updateSellerReport(report);
                    }

                    orderRepository.save(order);
                }

                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);

                return true;
            }

            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            return false;
        }

        return false;
    }

    @Override
    public PaymentLink createRazorpayPaymentLink(User user,
            Long Amount,
            Long orderId
    )
            throws RazorpayException {

        Long amount = Amount * 100;

        try {
            // Instantiate a Razorpay client with your key ID and secret
            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", amount);
            paymentLinkRequest.put("currency", "INR");

            // Create a JSON object with the customer details
            JSONObject customer = new JSONObject();
            customer.put("name", user.getFullName());

            customer.put("email", user.getEmail());
            paymentLinkRequest.put("customer", customer);

            // Create a JSON object with the notification settings
            JSONObject notify = new JSONObject();
            notify.put("email", true);
            paymentLinkRequest.put("notify", notify);

            // Set the reminder settings
            paymentLinkRequest.put("reminder_enable", true);

            // Set the callback URL and method
            paymentLinkRequest.put("callback_url", "http://localhost:5173/payment-success/" + orderId);
            paymentLinkRequest.put("callback_method", "get");

            PaymentLink payment = razorpay.paymentLink.create(paymentLinkRequest);

            String paymentLinkUrl = payment.get("short_url");
            String paymentLinkId = payment.get("id");

            System.out.println("payment ----- " + payment);

            return payment;

        } catch (RazorpayException e) {

            System.out.println("Error creating payment link: " + e.getMessage());
            throw new RazorpayException(e.getMessage());
        }
    }

    @Override
    public String createStripePaymentLink(User user, Long amount, Long orderId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/payment-success/" + orderId)
                .setCancelUrl("http://localhost:5173/payment/cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amount * 100)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData
                                        .builder()
                                        .setName("Top up wallet")
                                        .build()
                                ).build()
                        ).build()
                ).build();

        Session session = Session.create(params);

        System.out.println("session _____ " + session);

//        PaymentLinkResponse res = new PaymentLinkResponse();
//        res.setPayment_link_url(session.getUrl());
        return session.getUrl();
    }

}
