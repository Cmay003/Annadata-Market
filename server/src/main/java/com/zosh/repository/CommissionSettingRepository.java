package com.zosh.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.CommissionSetting;

public interface CommissionSettingRepository extends JpaRepository<CommissionSetting, Long> {
    CommissionSetting findTopByOrderByIdDesc();

     Optional<CommissionSetting> findTopByOrderByCreatedAtDesc();
    
}
