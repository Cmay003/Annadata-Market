package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.AdminWallet;

public interface AdminWalletRepository extends JpaRepository<AdminWallet, Long> {}