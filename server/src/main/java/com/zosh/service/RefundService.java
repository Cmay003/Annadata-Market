package com.zosh.service;

public interface RefundService {

    void processRefund(Long orderId, String reason) throws Exception;

}