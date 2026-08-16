// package com.zosh.controller;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestHeader;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.zosh.model.Cart;
// import com.zosh.model.Order;
// import com.zosh.model.PaymentOrder;
// import com.zosh.model.PaymentRecord;
// import com.zosh.model.Seller;
// import com.zosh.model.SellerReport;
// import com.zosh.model.User;
// import com.zosh.repository.CartItemRepository;
// import com.zosh.repository.CartRepository;
// import com.zosh.response.ApiResponse;
// import com.zosh.response.PaymentLinkResponse;
// import com.zosh.service.PaymentService;
// import com.zosh.service.SellerReportService;
// import com.zosh.service.SellerService;
// import com.zosh.service.TransactionService;
// import com.zosh.service.UserService;
// import com.zosh.service.impl.AdminPaymentService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequiredArgsConstructor
// public class PaymentController {

//     private final UserService userService;
//     private final PaymentService paymentService;
//     private final TransactionService transactionService;
//     private final SellerReportService sellerReportService;
//     private final SellerService sellerService;
//     private final CartRepository cartRepository;
//     private final CartItemRepository cartItemRepository;
//     private final AdminPaymentService adminPaymentService;

// //     @PostMapping("/api/payment/{paymentMethod}/order/{orderId}")
// //     public ResponseEntity<PaymentLinkResponse> paymentHandler(
// //             @PathVariable PaymentMethod paymentMethod,
// //             @PathVariable Long orderId,
// //             @RequestHeader("Authorization") String jwt) throws Exception {
// //         User user = userService.findUserProfileByJwt(jwt);
// //         PaymentLinkResponse paymentResponse;
// //         PaymentOrder order= paymentService.getPaymentOrderById(orderId);
// // //        if(paymentMethod.equals(PaymentMethod.RAZORPAY)){
// // //            paymentResponse=paymentService.createRazorpayPaymentLink(user,
// // //                    order.getAmount(),
// // //                    order.getId());
// // //        }
// // //        else{
// // //            paymentResponse=paymentService.createStripePaymentLink(user,
// // //                    order.getAmount(),
// // //                    order.getId());
// // //        }
// //         return new ResponseEntity<>(order, HttpStatus.CREATED);
//     // }
//     @GetMapping("/api/payment/{paymentId}")
//     public ResponseEntity<ApiResponse> paymentSuccessHandler(
//             @PathVariable String paymentId,
//             @RequestParam String paymentLinkId,
//             @RequestHeader("Authorization") String jwt) throws Exception {

//         User user = userService.findUserProfileByJwt(jwt);

//         PaymentLinkResponse paymentResponse;

//         PaymentOrder paymentOrder = paymentService
//                 .getPaymentOrderByPaymentId(paymentLinkId);

//         boolean paymentSuccess = paymentService.ProceedPaymentOrder(
//                 paymentOrder,
//                 paymentId,
//                 paymentLinkId
//         );
//         if (paymentSuccess) {

//             // for (Order order : paymentOrder.getOrders()) {

//             //     Seller seller = sellerService.getSellerById(order.getSellerId());

//             //     SellerReport report = sellerReportService.getSellerReport(seller);

//             //     report.setTotalOrders(
//             //             report.getTotalOrders() + 1
//             //     );

//             //     report.setTotalEarnings(
//             //             report.getTotalEarnings() + order.getTotalSellingPrice()
//             //     );

//             //     report.setTotalSales(
//             //             report.getTotalSales() + order.getOrderItems().size()
//             //     );

//             //     report.setTotalTransactions(
//             //             report.getTotalTransactions() + 1
//             //     );

//             //     sellerReportService.updateSellerReport(report);
//             // }



//             for (Order order : paymentOrder.getOrders()) {

//     Seller seller = sellerService.getSellerById(order.getSellerId());

//     SellerReport report = sellerReportService.getSellerReport(seller);

//     PaymentRecord paymentRecord =
//             adminPaymentService.getPaymentRecordByOrder(order);

//     double earning = paymentRecord != null
//             ? paymentRecord.getNetFarmerPayout()
//             : 0;

//     report.setTotalOrders(
//             report.getTotalOrders() + 1
//     );

//     report.setTotalEarnings(
//             report.getTotalEarnings() + earning
//     );

//     report.setTotalSales(
//             report.getTotalSales() + order.getOrderItems().size()
//     );

//     report.setTotalTransactions(
//             report.getTotalTransactions() + 1
//     );

//     sellerReportService.updateSellerReport(report);
// }


//             // for(Order order:paymentOrder.getOrders()){
//             //     transactionService.createTransaction(order);
//             //     Seller seller=sellerService.getSellerById(order.getSellerId());
//             //     SellerReport report=sellerReportService.getSellerReport(seller);
//             //     report.setTotalOrders(report.getTotalOrders()+1);
//             //     report.setTotalEarnings(report.getTotalEarnings()+order.getTotalSellingPrice());
//             //     report.setTotalSales(report.getTotalSales()+order.getOrderItems().size());
//             //     sellerReportService.updateSellerReport(report);
//             // }

//             // for (Order order : paymentOrder.getOrders()) {
//             //     // ✅ Step 1: Create PaymentRecord
//             //     PaymentRecord paymentRecord = adminPaymentService.createPaymentRecord(order);
//             //     // ❗ safety check (duplicate case)
//             //     if (paymentRecord == null) {
//             //         continue;
//             //     }
//             //     // ✅ Step 2: Create Transaction with full data
//             //     transactionService.createTransaction(order, paymentRecord);
//             //     // ✅ Existing logic
//             //     Seller seller = sellerService.getSellerById(order.getSellerId());
//             //     SellerReport report = sellerReportService.getSellerReport(seller);
//             //     report.setTotalOrders(report.getTotalOrders() + 1);
//             //     report.setTotalEarnings(report.getTotalEarnings() + paymentRecord.getNetFarmerPayout()); // ✅ FIXED
//             //     report.setTotalSales(report.getTotalSales() + order.getOrderItems().size());
//             //     sellerReportService.updateSellerReport(report);
//             // }
//             Cart cart = cartRepository.findByUserId(user.getId());
//             cart.setCouponPrice(0);
//             cart.setCouponCode(null);
// //        Set<CartItem> items=cart.getCartItems();
// //        cartItemRepository.deleteAll(items);
// //        cart.setCartItems(new HashSet<>());
//             cartRepository.save(cart);

//         }

//         ApiResponse res = new ApiResponse();
//         res.setMessage("Payment successful");
//         res.setStatus(true);

//         return new ResponseEntity<>(res, HttpStatus.CREATED);
//     }
// }



package com.zosh.controller;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.Order;
import com.zosh.model.PaymentOrder;
import com.zosh.model.PaymentRecord;
import com.zosh.model.Seller;
import com.zosh.model.SellerReport;
import com.zosh.model.User;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.CartRepository;
import com.zosh.response.ApiResponse;
import com.zosh.service.PaymentService;
import com.zosh.service.SellerReportService;
import com.zosh.service.SellerService;
import com.zosh.service.TransactionService;
import com.zosh.service.UserService;
import com.zosh.service.impl.AdminPaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final UserService userService;
    private final PaymentService paymentService;
    private final TransactionService transactionService;
    private final SellerReportService sellerReportService;
    private final SellerService sellerService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AdminPaymentService adminPaymentService;

    // ✅ Payment success handler — Razorpay/Stripe callback yahan aata hai
    @GetMapping("/api/payment/{paymentId}")
    public ResponseEntity<ApiResponse> paymentSuccessHandler(
            @PathVariable String paymentId,
            @RequestParam String paymentLinkId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId);

        boolean paymentSuccess = paymentService.ProceedPaymentOrder(
                paymentOrder,
                paymentId,
                paymentLinkId
        );

        if (paymentSuccess) {

            // ✅ Step 1: Har order ke liye seller report update karo
            for (Order order : paymentOrder.getOrders()) {
                Seller seller = sellerService.getSellerById(order.getSellerId());
                SellerReport report = sellerReportService.getSellerReport(seller);

                // PaymentRecord se actual farmer payout nikaalo
                PaymentRecord paymentRecord = adminPaymentService.getPaymentRecordByOrder(order);
                double earning = (paymentRecord != null)
                        ? paymentRecord.getNetFarmerPayout()
                        : order.getTotalSellingPrice(); // fallback

                report.setTotalOrders(report.getTotalOrders() + 1);
                report.setTotalEarnings(report.getTotalEarnings() + earning);
                report.setTotalSales(report.getTotalSales() + order.getOrderItems().size());
                report.setTotalTransactions(report.getTotalTransactions() + 1);

                sellerReportService.updateSellerReport(report);

                // ✅ Step 2: Transaction record banao
                transactionService.createTransaction(order, paymentRecord);

                log.info("Payment processed for order {} — seller {} — earning {}",
                        order.getId(), seller.getId(), earning);
            }

            // ✅ FIX B5: Cart items clear karo payment ke baad
            // Pehle ye 3 lines comment-out thi — isliye cart empty nahi hota tha
            Cart cart = cartRepository.findByUserId(user.getId());
            if (cart != null) {
                Set<CartItem> items = cart.getCartItems();
                if (items != null && !items.isEmpty()) {
                    cartItemRepository.deleteAll(items);  // ✅ DB se items delete karo
                    cart.getCartItems().clear();           // ✅ In-memory clear karo
                }
                cart.setCouponPrice(0);
                cart.setCouponCode(null);
                cartRepository.save(cart);
                log.info("Cart cleared for user {}", user.getId());
            }
        }

        ApiResponse res = new ApiResponse();
        res.setMessage(paymentSuccess ? "Payment successful" : "Payment pending verification");
        res.setStatus(paymentSuccess);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}