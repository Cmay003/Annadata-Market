package com.zosh.service;

import com.zosh.domain.DeliveryStatus;
import com.zosh.model.Order;

public interface DeliveryService {

    Order assignDeliveryBoy(Long orderId, Long deliveryBoyId);

    Order acceptOrder(Long orderId, Long deliveryBoyId);

    Order updateDeliveryStatus(Long orderId, DeliveryStatus status);
}