package com.zosh.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.zosh.model.AdminWallet;
import com.zosh.model.WalletTransaction;
import com.zosh.repository.AdminWalletRepository;
import com.zosh.repository.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminWalletService {

    private final AdminWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    // 🔹 Get or Create Wallet
    private AdminWallet getWallet() {
        return walletRepository.findById(1L)
                .orElseGet(() -> walletRepository.save(new AdminWallet(null, 0)));
    }

    // 🔹 CREDIT (Customer Payment)
    public void credit(double amount, String orderId) {
        AdminWallet wallet = getWallet();

        wallet.setTotalBalance(wallet.getTotalBalance() + amount);
        walletRepository.save(wallet);

        WalletTransaction tx = new WalletTransaction();
        tx.setTransactionCategory("PAYMENT");
        tx.setType("CREDIT");
        tx.setAmount(amount);
        tx.setReferenceId(orderId);
        tx.setDescription("Customer Payment");
        tx.setCreatedAt(LocalDateTime.now());
        
        transactionRepository.save(tx);
    }

    // 🔹 DEBIT (Farmer Payout)
    public void debit(double amount, String orderId) {
        AdminWallet wallet = getWallet();

        wallet.setTotalBalance(wallet.getTotalBalance() - amount);
        walletRepository.save(wallet);

        WalletTransaction tx = new WalletTransaction();
        tx.setTransactionCategory("PAYOUT");
        tx.setType("DEBIT");
        
        tx.setAmount(amount);
        tx.setReferenceId(orderId);
        tx.setDescription("Farmer Payout");
        tx.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(tx);
    }


  public void refund(double amount, String orderId) {

    AdminWallet wallet = getWallet();

    wallet.setTotalBalance(wallet.getTotalBalance() - amount);

    walletRepository.save(wallet);

    WalletTransaction tx = new WalletTransaction();

    tx.setType("DEBIT");

    tx.setTransactionCategory("REFUND");

    tx.setAmount(amount);

    tx.setReferenceId(orderId);

    tx.setDescription("Customer Refund");

    tx.setCreatedAt(LocalDateTime.now());

    transactionRepository.save(tx);
}
}