package com.zosh.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zosh.domain.DeliveryStatus;
import com.zosh.domain.OrderStatus;
import com.zosh.domain.PaymentMethod;
import com.zosh.domain.PaymentStatus;
import com.zosh.exception.OrderException;
import com.zosh.model.Address;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.CommissionSetting;
import com.zosh.model.Order;
import com.zosh.model.OrderItem;
import com.zosh.model.User;
import com.zosh.repository.AddressRepository;
import com.zosh.repository.CommissionSettingRepository;
import com.zosh.repository.OrderItemRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.CartService;
import com.zosh.service.OrderItemService;
import com.zosh.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImplementation implements OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OrderItemService orderItemService;
    private final OrderItemRepository orderItemRepository;
    private final AdminPaymentService adminPaymentService;
    private final AdminWalletService walletService;

    private final CommissionSettingRepository commissionRepo;

    @Override
    public Set<Order> createOrder(User user, Address shippAddress, Cart cart) {

//		shippAddress.setUser(user);
        if (!user.getAddresses().contains(shippAddress)) {
            user.getAddresses().add(shippAddress);
        }

        Address address = addressRepository.save(shippAddress);

        Map<Long, List<CartItem>> itemsBySeller = cart.getCartItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));

        Set<Order> orders = new HashSet<>();

        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<CartItem> cartItems = entry.getValue();

            int totalOrderPrice = cartItems.stream()
                    .mapToInt(CartItem::getSellingPrice).sum();

            // 
            CommissionSetting setting
                    = commissionRepo
                            .findTopByOrderByCreatedAtDesc()
                            .orElse(new CommissionSetting());

            // double deliveryCharge
            // = setting.getDeliveryCharge();
            double commissionPercent
                    = setting.getPlatformCommissionPercent();

            double commissionAmount
                    = totalOrderPrice * commissionPercent / 100;

            double farmerAmount
                    = totalOrderPrice - commissionAmount;

            int totalItem = cartItems.stream().mapToInt(CartItem::getQuantity).sum();

            Order createdOrder = new Order();

            // ✅ ADD THIS
            createdOrder.setOrderId(
                    "ORD-" + System.currentTimeMillis()
            );

            createdOrder.setUser(user);
            createdOrder.setSellerId(sellerId);
            createdOrder.setTotalMrpPrice(totalOrderPrice);
            // createdOrder.setTotalSellingPrice(totalOrderPrice);
            int deliveryCharge = 0;

            if (totalOrderPrice < setting.getFreeDeliveryAbove()) {
                deliveryCharge = setting.getDeliveryCharge();
            }

            // createdOrder.setDeliveryCharge(deliveryCharge);

            createdOrder.setTotalSellingPrice(
                   totalOrderPrice + deliveryCharge
            );
            createdOrder.setTotalItem(totalItem);
            createdOrder.setShippingAddress(address);
            createdOrder.setUser(user);
            createdOrder.setSellerId(sellerId);
            createdOrder.setTotalMrpPrice(totalOrderPrice);
            // createdOrder.setTotalSellingPrice(totalOrderPrice);
            createdOrder.setTotalItem(totalItem);
            createdOrder.setShippingAddress(address);
            // createdOrder.setOrderStatus(OrderStatus.PENDING);
            // createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);

            // createdOrder.setOrderStatus(OrderStatus.PLACED);
            // createdOrder.setPaymentStatus(PaymentStatus.PENDING);
            createdOrder.setOrderStatus(OrderStatus.PLACED);

            createdOrder.setCommissionPercent(
                    commissionPercent
            );

            createdOrder.setCommissionAmount(
                    commissionAmount
            );

            createdOrder.setFarmerAmount(
                    farmerAmount
            );

            createdOrder.setDeliveryCharge(
                    setting.getDeliveryCharge()
            );
// 👉 IMPORTANT (set payment method)
            createdOrder.setPaymentMethod(cart.getPaymentMethod()); // ensure cart me hai

// 👉 Payment logic
            if (createdOrder.getPaymentMethod() == PaymentMethod.COD) {
                createdOrder.setPaymentStatus(PaymentStatus.PENDING);
            } else {
                createdOrder.setPaymentStatus(PaymentStatus.PROCESSING);
            }

            Order savedOrder = orderRepository.save(createdOrder);
            orders.add(savedOrder);

            List<OrderItem> orderItems = new ArrayList<>();

            for (CartItem item : cartItems) {
                OrderItem orderItem = new OrderItem();

                orderItem.setOrder(savedOrder);
                orderItem.setMrpPrice(item.getMrpPrice());
                orderItem.setProduct(item.getProduct());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setSize(item.getSize());
                orderItem.setUserId(item.getUserId());
                orderItem.setSellingPrice(item.getSellingPrice());

                savedOrder.getOrderItems().add(orderItem);

                OrderItem createdOrderItem = orderItemRepository.save(orderItem);

                orderItems.add(createdOrderItem);
            }

        }
        cart.getCartItems().clear();

        return orders;

    }

    @Override
    public Order findOrderById(Long orderId) throws OrderException {
        Optional<Order> opt = orderRepository.findById(orderId);

        if (opt.isPresent()) {
            return opt.get();
        }
        throw new OrderException("order not exist with id " + orderId);
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {

        return orderRepository.findByUserId(userId);
    }

    // @Override
    // public List<Order> getShopsOrders(Long sellerId) {
    //     return orderRepository.findBySellerIdOrderByOrderDateDesc(sellerId);
    // }
//     @Override
// public List<Order> getShopsOrders(Long sellerId) {
//     List<Order> orders =
//             orderRepository.findBySellerIdOrderByOrderDateDesc(sellerId);
//     CommissionSetting setting =
//             commissionRepo.findTopByOrderByCreatedAtDesc()
//                     .orElse(null);
//     double commissionPercent =
//             setting != null
//                     ? setting.getPlatformCommissionPercent()
//                     : 5.0;
//     for (Order order : orders) {
//         double total = order.getTotalSellingPrice();
//         double commissionAmount =
//                 total * commissionPercent / 100;
//         double farmerAmount =
//                 total - commissionAmount;
//         order.setCommissionPercent(
//                 commissionPercent
//         );
//         order.setCommissionAmount(
//                 commissionAmount
//         );
//         order.setFarmerAmount(
//                 farmerAmount
//         );
//         // customer delivery pay karega
//         order.setDeliveryCharge(0.0);
//     }
//     return orders;
// }
    @Override
    public List<Order> getShopsOrders(Long sellerId) {
        return orderRepository
                .findBySellerIdOrderByOrderDateDesc(sellerId);
    }

    // @Override
    // public Order updateOrderStatus(Long orderId, OrderStatus orderStatus)
    // 		throws OrderException {
    // 	Order order=findOrderById(orderId);
    // 	order.setOrderStatus(orderStatus);
    // 	return orderRepository.save(order);
    // }
    // @Override
    // public Order updateOrderStatus(Long orderId, OrderStatus orderStatus)
    //         throws OrderException {
    //     Order order = findOrderById(orderId);
    //     order.setOrderStatus(orderStatus);
    //     // ✅ COD FLOW
    //     if (orderStatus == OrderStatus.DELIVERED) {
    //         if (order.getPaymentStatus() == PaymentStatus.PENDING) {
    //             order.setPaymentStatus(PaymentStatus.COMPLETED);
    //         }
    //         adminPaymentService.createPaymentRecord(order);
    //     }
    //     return orderRepository.save(order);
    // }
    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus)
            throws OrderException {

        Order order = findOrderById(orderId);

        OrderStatus currentStatus = order.getOrderStatus();

        // 🚫 Invalid transitions block karo
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new OrderException(
                    "Invalid order status transition from " + currentStatus + " to " + newStatus
            );
        }

        order.setOrderStatus(newStatus);

        // ✅ AUTO DELIVERY STATUS SYNC
        switch (newStatus) {

            case READY_FOR_PICKUP:
                order.setDeliveryStatus(DeliveryStatus.ASSIGNED);
                break;

            case IN_TRANSIT:
                order.setDeliveryStatus(DeliveryStatus.OUT_FOR_DELIVERY);
                break;

            case DELIVERED:
                order.setDeliveryStatus(DeliveryStatus.DELIVERED);
                break;

            case CANCELLED:
                order.setDeliveryStatus(DeliveryStatus.CANCELLED);
                break;

            default:
                break;
        }

        // ✅ Delivered case
        // if (newStatus == OrderStatus.DELIVERED) {
        //     order.setDeliveredAt(LocalDateTime.now());
        //     order.setPaymentStatus(PaymentStatus.COMPLETED);
        // }
        // if (newStatus == OrderStatus.DELIVERED) {
        //     order.setDeliveredAt(LocalDateTime.now());
        //     // 👉 COD case only
        //     if (order.getPaymentMethod() == PaymentMethod.COD) {
        //         order.setPaymentStatus(PaymentStatus.COMPLETED);
        //     }
        //     // 👉 🔥 IMPORTANT: Admin Payment Record create karo
        //     adminPaymentService.createPaymentRecord(order);
        // }
        // if (newStatus == OrderStatus.DELIVERED) {
        //     order.setDeliveredAt(LocalDateTime.now());
        //     if (order.getPaymentMethod() == PaymentMethod.COD) {
        //         order.setPaymentStatus(PaymentStatus.COMPLETED);
        //         // ✅ CREDIT ADMIN WALLET
        //         walletService.credit(
        //                 order.getTotalSellingPrice(),
        //                 order.getOrderId()
        //         );
        //     }
        //     adminPaymentService.createPaymentRecord(order);
        // }
        if (newStatus == OrderStatus.DELIVERED) {

            order.setDeliveredAt(LocalDateTime.now());

            // ✅ COD PAYMENT FLOW
            if (order.getPaymentMethod() == PaymentMethod.COD) {

                // ✅ payment completed
                order.setPaymentStatus(PaymentStatus.COMPLETED);

                // ✅ admin wallet credit
                walletService.credit(
                        order.getTotalSellingPrice(),
                        order.getOrderId()
                );
            }

            // ✅ create payment record
            adminPaymentService.createPaymentRecord(order);
        }

        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);

        orderRepository.deleteById(orderId);

    }

    @Override
    public Order cancelOrder(Long orderId, User user) throws OrderException {
        Order order = this.findOrderById(orderId);
        // if (user.getId() != order.getUser().getId()) {
        //     throw new OrderException("you can't perform this action " + orderId);
        // }

        if (!user.getId().equals(order.getUser().getId())) {
            throw new OrderException("you can't perform this action " + orderId);
        }

        if (order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new OrderException("Delivered order cannot be cancelled");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        return orderRepository.save(order);
    }

    private boolean isValidTransition(OrderStatus current, OrderStatus next) {

        switch (current) {

            case PLACED:
                return next == OrderStatus.CONFIRMED
                        || next == OrderStatus.CANCELLED;

            case CONFIRMED:
                return next == OrderStatus.PACKED
                        || next == OrderStatus.CANCELLED;

            case PACKED:
                return next == OrderStatus.READY_FOR_PICKUP;

            case READY_FOR_PICKUP:
                return next == OrderStatus.IN_TRANSIT;

            case IN_TRANSIT:
                return next == OrderStatus.DELIVERED;

            case DELIVERED:
                return next == OrderStatus.RETURNED;

            case CANCELLED:
            case RETURNED:
                return false; // final states

            default:
                return false;
        }
    }

}
