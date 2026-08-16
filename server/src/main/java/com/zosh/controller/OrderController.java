// package com.zosh.controller;

// import java.util.List;
// import java.util.Set;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestHeader;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.razorpay.PaymentLink;
// import com.razorpay.RazorpayException;
// import com.stripe.exception.StripeException;
// import com.zosh.domain.OrderStatus;
// import com.zosh.domain.PaymentMethod;
// import com.zosh.domain.PaymentStatus;
// import com.zosh.exception.OrderException;
// import com.zosh.exception.SellerException;
// import com.zosh.exception.UserException;
// import com.zosh.model.Address;
// import com.zosh.model.Cart;
// import com.zosh.model.Order;
// import com.zosh.model.OrderItem;
// import com.zosh.model.PaymentOrder;
// import com.zosh.model.Seller;
// import com.zosh.model.SellerReport;
// import com.zosh.model.User;
// import com.zosh.repository.PaymentOrderRepository;
// import com.zosh.response.PaymentLinkResponse;
// import com.zosh.service.CartService;
// import com.zosh.service.OrderItemService;
// import com.zosh.service.OrderService;
// import com.zosh.service.PaymentService;
// import com.zosh.service.SellerReportService;
// import com.zosh.service.SellerService;
// import com.zosh.service.UserService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/orders")
// @RequiredArgsConstructor
// public class OrderController {

//     private final OrderService orderService;
//     private final UserService userService;
//     private final OrderItemService orderItemService;
//     private final CartService cartService;
//     private final PaymentService paymentService;
//     private final PaymentOrderRepository paymentOrderRepository;
//     private final SellerReportService sellerReportService;
//     private final SellerService sellerService;

//     @PostMapping()
//     public ResponseEntity<PaymentLinkResponse> createOrderHandler(
//             @RequestBody Address spippingAddress,
//             @RequestParam PaymentMethod paymentMethod,
//             @RequestHeader("Authorization") String jwt)
//             throws UserException, RazorpayException, StripeException {

//         User user = userService.findUserProfileByJwt(jwt);
//         Cart cart = cartService.findUserCart(user);
//         cart.setPaymentMethod(paymentMethod);
//         Set<Order> orders = orderService.createOrder(user, spippingAddress, cart);

//         PaymentOrder paymentOrder = paymentService.createOrder(user, orders);

//         PaymentLinkResponse res = new PaymentLinkResponse();

//         if (paymentMethod.equals(PaymentMethod.COD)) {

//             // for (Order order : orders) {
//             //     order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED); // COD = paid on delivery
//             //     order.setOrderStatus(OrderStatus.PLACED);
//             // }
//             for (Order order : orders) {

//                 order.setPaymentStatus(PaymentStatus.PENDING);

//                 order.setPaymentMethod(PaymentMethod.COD);

//                 order.setOrderStatus(OrderStatus.PLACED);
//             }

//             res.setPayment_link_url(null); // ❌ no payment link

//             return new ResponseEntity<>(res, HttpStatus.OK);
//         }

//         if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
//             PaymentLink payment = paymentService.createRazorpayPaymentLink(user,
//                     paymentOrder.getAmount(),
//                     paymentOrder.getId());
//             String paymentUrl = payment.get("short_url");
//             String paymentUrlId = payment.get("id");

//             res.setPayment_link_url(paymentUrl);
// //			res.setPayment_link_id(paymentUrlId);
//             paymentOrder.setPaymentLinkId(paymentUrlId);
//             paymentOrderRepository.save(paymentOrder);
//         } else {
//             String paymentUrl = paymentService.createStripePaymentLink(user,
//                     paymentOrder.getAmount(),
//                     paymentOrder.getId());
//             res.setPayment_link_url(paymentUrl);
//         }
//         return new ResponseEntity<>(res, HttpStatus.OK);

//     }

//     @GetMapping("/user")
//     public ResponseEntity< List<Order>> usersOrderHistoryHandler(
//             @RequestHeader("Authorization") String jwt) throws UserException {

//         User user = userService.findUserProfileByJwt(jwt);
//         List<Order> orders = orderService.usersOrderHistory(user.getId());
//         return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
//     }

//     @GetMapping("/{orderId}")
//     public ResponseEntity< Order> getOrderById(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt) throws OrderException, UserException {

//         User user = userService.findUserProfileByJwt(jwt);
//         Order orders = orderService.findOrderById(orderId);
//         return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
//     }

//     @GetMapping("/item/{orderItemId}")
//     public ResponseEntity<OrderItem> getOrderItemById(
//             @PathVariable Long orderItemId, @RequestHeader("Authorization") String jwt) throws Exception {
//         System.out.println("------- controller ");
//         User user = userService.findUserProfileByJwt(jwt);
//         OrderItem orderItem = orderItemService.getOrderItemById(orderItemId);
//         return new ResponseEntity<>(orderItem, HttpStatus.ACCEPTED);
//     }

//     @PutMapping("/{orderId}/cancel")
//     public ResponseEntity<Order> cancelOrder(
//             @PathVariable Long orderId,
//             @RequestHeader("Authorization") String jwt
//     ) throws UserException, OrderException, SellerException {
//         User user = userService.findUserProfileByJwt(jwt);
//         Order order = orderService.cancelOrder(orderId, user);

//         Seller seller = sellerService.getSellerById(order.getSellerId());
//         SellerReport report = sellerReportService.getSellerReport(seller);

//         report.setCanceledOrders(report.getCanceledOrders() + 1);
//         report.setTotalRefunds(report.getTotalRefunds() + order.getTotalSellingPrice());
//         sellerReportService.updateSellerReport(report);

//         return ResponseEntity.ok(order);
//     }

//     @PutMapping("/admin/orders/{id}/status")
//     public ResponseEntity<Order> updateStatus(
//             @PathVariable Long id,
//             @RequestParam OrderStatus status
//     ) throws Exception {

//         Order updatedOrder = orderService.updateOrderStatus(id, status);
//         return ResponseEntity.ok(updatedOrder);
//     }

// }


package com.zosh.controller;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.zosh.domain.OrderStatus;
import com.zosh.domain.PaymentMethod;
import com.zosh.domain.PaymentStatus;
import com.zosh.exception.OrderException;
import com.zosh.exception.SellerException;
import com.zosh.exception.UserException;
import com.zosh.model.Address;
import com.zosh.model.Cart;
import com.zosh.model.Order;
import com.zosh.model.OrderItem;
import com.zosh.model.PaymentOrder;
import com.zosh.model.Seller;
import com.zosh.model.SellerReport;
import com.zosh.model.User;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.PaymentOrderRepository;
import com.zosh.response.PaymentLinkResponse;
import com.zosh.service.CartService;
import com.zosh.service.OrderItemService;
import com.zosh.service.OrderService;
import com.zosh.service.PaymentService;
import com.zosh.service.SellerReportService;
import com.zosh.service.SellerService;
import com.zosh.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final OrderItemService orderItemService;
    private final CartService cartService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;
    private final SellerReportService sellerReportService;
    private final SellerService sellerService;
    private final OrderRepository orderRepository; // ✅ FIX B10: COD save ke liye

    // ✅ Order create karo — COD ya Online Payment
    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
            @RequestBody Address shippingAddress,          // ✅ Fixed typo: spippingAddress → shippingAddress
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt)
            throws UserException, RazorpayException, StripeException {

        User user = userService.findUserProfileByJwt(jwt);
        Cart cart = cartService.findUserCart(user);
        cart.setPaymentMethod(paymentMethod);

        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);
        PaymentOrder paymentOrder = paymentService.createOrder(user, orders);

        PaymentLinkResponse res = new PaymentLinkResponse();

        // ─── COD Flow ────────────────────────────────────────────
        if (paymentMethod.equals(PaymentMethod.COD)) {
            for (Order order : orders) {
                order.setPaymentStatus(PaymentStatus.PENDING); // Pay on delivery
                order.setPaymentMethod(PaymentMethod.COD);
                order.setOrderStatus(OrderStatus.PLACED);

                // ✅ FIX B10: COD orders DB mein save karo
                // Pehle sirf status set ho raha tha — save() nahi tha
                orderRepository.save(order);
            }
            log.info("COD order placed for user {} — {} orders", user.getId(), orders.size());

            res.setPayment_link_url(null); // COD mein payment link nahi hota
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        // ─── Razorpay Flow ────────────────────────────────────────
        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            PaymentLink payment = paymentService.createRazorpayPaymentLink(
                    user,
                    paymentOrder.getAmount(),
                    paymentOrder.getId()
            );
            String paymentUrl   = payment.get("short_url");
            String paymentUrlId = payment.get("id");

            res.setPayment_link_url(paymentUrl);
            paymentOrder.setPaymentLinkId(paymentUrlId);
            paymentOrderRepository.save(paymentOrder);

            log.info("Razorpay payment link created: {}", paymentUrl);
        }
        // ─── Stripe Flow ──────────────────────────────────────────
        else {
            String paymentUrl = paymentService.createStripePaymentLink(
                    user,
                    paymentOrder.getAmount(),
                    paymentOrder.getId()
            );
            res.setPayment_link_url(paymentUrl);
            log.info("Stripe payment link created: {}", paymentUrl);
        }

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // ✅ User ka order history
    @GetMapping("/user")
    public ResponseEntity<List<Order>> usersOrderHistoryHandler(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        List<Order> orders = orderService.usersOrderHistory(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // ✅ Order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws OrderException, UserException {

        userService.findUserProfileByJwt(jwt); // auth check
        Order order = orderService.findOrderById(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    // ✅ Order item by ID
    @GetMapping("/item/{orderItemId}")
    public ResponseEntity<OrderItem> getOrderItemById(
            @PathVariable Long orderItemId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        userService.findUserProfileByJwt(jwt); // auth check
        OrderItem orderItem = orderItemService.getOrderItemById(orderItemId);
        return new ResponseEntity<>(orderItem, HttpStatus.OK);
    }

    // ✅ Order cancel
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, OrderException, SellerException {

        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.cancelOrder(orderId, user);

        Seller seller = sellerService.getSellerById(order.getSellerId());
        SellerReport report = sellerReportService.getSellerReport(seller);

        report.setCanceledOrders(report.getCanceledOrders() + 1);
        report.setTotalRefunds(report.getTotalRefunds() + order.getTotalSellingPrice());
        sellerReportService.updateSellerReport(report);

        log.info("Order {} cancelled by user {}", orderId, user.getId());
        return ResponseEntity.ok(order);
    }

    // ✅ Admin: order status update
    @PutMapping("/admin/orders/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) throws Exception {

        Order updatedOrder = orderService.updateOrderStatus(id, status);
        log.info("Order {} status updated to {}", id, status);
        return ResponseEntity.ok(updatedOrder);
    }
}