package com.zosh.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zosh.model.DeliveryBoy;

public interface DeliveryBoyRepository extends JpaRepository<DeliveryBoy, Long> {

    Optional<DeliveryBoy> findByEmail(String email);

    List<DeliveryBoy> findByCurrentCityIgnoreCase(String city);

    List<DeliveryBoy> findByCurrentPincode(String pincode);

    List<DeliveryBoy> findByDeliveryStatus(String deliveryStatus);

    List<DeliveryBoy> findByIsActive(Boolean isActive);
}
