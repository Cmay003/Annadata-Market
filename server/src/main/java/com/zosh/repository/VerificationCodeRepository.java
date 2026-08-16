package com.zosh.repository;

import com.zosh.model.VerificationCode;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    VerificationCode findByEmail(String email);

    VerificationCode findByOtp(String otp);

    @Transactional
    @Modifying
    @Query("DELETE FROM VerificationCode v WHERE v.expiryTime < :now")
    void deleteExpiredOtps(LocalDateTime now);
}
