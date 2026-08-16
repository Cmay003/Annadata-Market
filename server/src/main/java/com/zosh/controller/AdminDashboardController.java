package com.zosh.controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.model.PaymentRecord;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.PaymentRecordRepository;
import com.zosh.repository.SellerRepository;
import com.zosh.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRecordRepository paymentRecordRepository;

    @GetMapping
    public Map<String, Object> getDashboard() {

        Map<String, Object> data = new HashMap<>();

        data.put("totalFarmers", sellerRepository.count());
        data.put("totalCustomers", userRepository.count());
        data.put("totalOrders", orderRepository.count());

        Double revenue = paymentRecordRepository
                .findAll()
                .stream()
                .mapToDouble(r -> r.getPlatformFee() != null ? r.getPlatformFee() : 0.0)
                .sum();

        data.put("totalRevenue", revenue);

        return data;
    }
}