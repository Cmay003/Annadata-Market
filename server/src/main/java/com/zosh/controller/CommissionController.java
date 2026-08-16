package com.zosh.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.model.CommissionSetting;
import com.zosh.repository.CommissionSettingRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/commission")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionSettingRepository repository;

    @GetMapping
    public CommissionSetting getCurrentCommission() {

        return repository
                .findTopByOrderByCreatedAtDesc()
                .orElseThrow(() ->
                        new RuntimeException("Commission setting not found"));
    }
}