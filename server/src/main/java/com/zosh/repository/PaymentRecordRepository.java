package com.zosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.zosh.model.Order;
import com.zosh.model.PaymentRecord;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {

    List<PaymentRecord> findBySellerId(Long sellerId);

    boolean existsByOrder(Order order);

    PaymentRecord findByOrder(Order order);

    @Query("SELECT COALESCE(SUM(p.netFarmerPayout),0) FROM PaymentRecord p WHERE p.sellerId = :sellerId")
    Double getTotalEarnings(Long sellerId);

}
