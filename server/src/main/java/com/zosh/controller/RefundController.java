package com.zosh.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.response.ApiResponse;
import com.zosh.service.RefundService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/refunds")
public class RefundController {

    private final RefundService refundService;

    @PostMapping("/{orderId}")
    public ResponseEntity<ApiResponse> refundOrder(
            @PathVariable Long orderId,
            @RequestParam String reason
    ) throws Exception {

        refundService.processRefund(orderId, reason);

        ApiResponse response = new ApiResponse();
        response.setStatus(true);
        response.setMessage("Refund processed successfully");

        return ResponseEntity.ok(response);
    }
}