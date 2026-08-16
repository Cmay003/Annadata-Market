package com.zosh.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.zosh.model.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {}