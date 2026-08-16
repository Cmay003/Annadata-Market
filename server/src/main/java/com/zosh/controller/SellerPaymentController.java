package com.zosh.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.model.PaymentRecord;
import com.zosh.service.impl.AdminPaymentService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
public class SellerPaymentController {

    private final AdminPaymentService adminPaymentService;

    @GetMapping("/seller/payments")
public List<PaymentRecord> getSellerPayments(@RequestParam Long sellerId){
    return adminPaymentService.getSellerPayments(sellerId);
}
    
}
