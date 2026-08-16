package com.zosh.service.impl;

import org.springframework.stereotype.Service;

import com.zosh.domain.DeliveryStatus;
import com.zosh.model.DeliveryBoy;
import com.zosh.model.Order;
import com.zosh.repository.DeliveryBoyRepository;
import com.zosh.repository.OrderRepository;
import com.zosh.service.DeliveryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final OrderRepository orderRepository;
    private final DeliveryBoyRepository deliveryBoyRepository;

    @Override
    public Order assignDeliveryBoy(Long orderId, Long deliveryBoyId) {

        Order order = orderRepository.findById(orderId).orElseThrow();

        DeliveryBoy boy = deliveryBoyRepository.findById(deliveryBoyId).orElseThrow();

        if (!boy.getIsActive()) {
            throw new RuntimeException("Delivery boy not active");
        }

        order.setDeliveryBoyId(deliveryBoyId);
        order.setDeliveryStatus(DeliveryStatus.ASSIGNED);

        return orderRepository.save(order);
    }

    @Override
    public Order acceptOrder(Long orderId, Long deliveryBoyId) {

        Order order = orderRepository.findById(orderId).orElseThrow();

        if (!order.getDeliveryBoyId().equals(deliveryBoyId)) {
            throw new RuntimeException("Not your order");
        }

        order.setDeliveryStatus(DeliveryStatus.PICKED_UP);

        return orderRepository.save(order);
    }

    @Override
    public Order updateDeliveryStatus(Long orderId, DeliveryStatus status) {

        Order order = orderRepository.findById(orderId).orElseThrow();

        order.setDeliveryStatus(status);

        return orderRepository.save(order);
    }
}
