package com.zosh.response;

import lombok.Data;

@Data
public class CommissionSummaryResponse {

    private Double orderAmount;

    private Double commissionPercent;

    private Double commissionAmount;

    private Double deliveryCharge;

    private Double farmerReceives;
}