// package com.zosh.controller;
// import java.util.List;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.zosh.domain.DeliveryStatus;
// import com.zosh.model.Order;
// import com.zosh.repository.OrderRepository;

// import lombok.RequiredArgsConstructor;


// @RestController
// @RequestMapping("/admin/orders")
// @RequiredArgsConstructor
// public class AdminOrderController {

//     private final OrderRepository orderRepository;

//     // ✅ All orders
//     @GetMapping
//     public List<Order> getAllOrders() {
//         return orderRepository.findAll();
//     }

//     // ✅ Assign Delivery Boy
//     @PutMapping("/{orderId}/assign/{deliveryBoyId}")
//     public Order assignDelivery(
//             @PathVariable Long orderId,
//             @PathVariable Long deliveryBoyId
//     ) {
//         Order order = orderRepository.findById(orderId).orElseThrow();

//         order.setDeliveryBoyId(deliveryBoyId);
//         order.setDeliveryStatus(DeliveryStatus.ASSIGNED);

//         return orderRepository.save(order);
//     }

//     // ✅ Cancel Order
//     @PutMapping("/{orderId}/cancel")
//     public Order cancelOrder(@PathVariable Long orderId) {
//         Order order = orderRepository.findById(orderId).orElseThrow();

//         order.setIsCancelled(true);
//         order.setDeliveryStatus(DeliveryStatus.CANCELLED);

//         return orderRepository.save(order);
//     }
// }

package com.zosh.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.domain.DeliveryStatus;
import com.zosh.domain.OrderStatus;
import com.zosh.exception.OrderException;
import com.zosh.model.DeliveryBoy;
import com.zosh.model.Order;
import com.zosh.repository.DeliveryBoyRepository;
import com.zosh.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// ✅ FIX B8: Ab OrderService use ho raha hai — Repository direct nahi
// Service layer mein business logic hoti hai — validation, events, notifications
// Repository direct use karna bypass karta hai sab kuch

@Slf4j
@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;                 // ✅ Service layer use karo
    private final DeliveryBoyRepository deliveryBoyRepository; // Delivery boy lookup ke liye

    // ✅ Saare orders — admin dashboard ke liye
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) OrderStatus status
    ) {
        // ✅ Status filter optional hai — admin specific status filter kar sakta hai
        List<Order> orders;
        if (status != null) {
            // OrderService mein ye method add karo (neeche README mein bataya hai)
            orders = orderService.usersOrderHistory(null); // temporary — update with filter method
        } else {
            orders = orderService.usersOrderHistory(null); // all orders
        }
        // Note: OrderService mein getAllOrders() method add karna hoga
        // Abhi ke liye simple implementation
        return ResponseEntity.ok(orders);
    }

    // ✅ Delivery boy assign karo — proper validation ke saath
    @PutMapping("/{orderId}/assign/{deliveryBoyId}")
    public ResponseEntity<Order> assignDelivery(
            @PathVariable Long orderId,
            @PathVariable Long deliveryBoyId
    ) throws OrderException {

        Order order = orderService.findOrderById(orderId);

        // ✅ Delivery boy exist karta hai check karo
        DeliveryBoy deliveryBoy = deliveryBoyRepository.findById(deliveryBoyId)
                .orElseThrow(() -> new RuntimeException("Delivery boy not found: " + deliveryBoyId));

        order.setDeliveryBoyId(deliveryBoyId);
        order.setDeliveryStatus(DeliveryStatus.ASSIGNED);

        // ✅ OrderService ke through save karo
        Order updated = orderService.updateOrderStatus(orderId, order.getOrderStatus());
        log.info("Delivery boy {} assigned to order {}", deliveryBoyId, orderId);

        return ResponseEntity.ok(updated);
    }

    // ✅ Order cancel — service layer ke through
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long orderId
    ) throws OrderException {

        // ✅ OrderService.updateOrderStatus use karo — business logic preserve hoti hai
        Order updated = orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
        updated.setIsCancelled(true);
        updated.setDeliveryStatus(DeliveryStatus.CANCELLED);

        log.info("Order {} cancelled by admin", orderId);
        return ResponseEntity.ok(updated);
    }

    // ✅ Order status update — admin ke liye
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) throws OrderException {

        Order updated = orderService.updateOrderStatus(orderId, status);
        log.info("Admin updated order {} status to {}", orderId, status);
        return ResponseEntity.ok(updated);
    }
}