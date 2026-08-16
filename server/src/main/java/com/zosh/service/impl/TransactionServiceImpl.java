package com.zosh.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zosh.model.Order;
import com.zosh.model.PaymentRecord;
import com.zosh.model.Seller;
import com.zosh.model.Transaction;
import com.zosh.repository.SellerRepository;
import com.zosh.repository.TransactionRepository;
import com.zosh.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final SellerRepository sellerRepository;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  SellerRepository sellerRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.sellerRepository = sellerRepository;
    }

    // @Override
    // public Transaction createTransaction(Order order) {
    //     Seller seller = sellerRepository.findById(order.getSellerId()).get();
    //     Transaction transaction = new Transaction();
    //     transaction.setCustomer(order.getUser());
    //     transaction.setOrder(order);
    //     transaction.setSeller(seller);
    //     return transactionRepository.save(transaction);
    // }

    @Override
    public Transaction createTransaction(Order order, PaymentRecord paymentRecord) {

    Seller seller = sellerRepository.findById(order.getSellerId()).get();

    Transaction transaction = new Transaction();

    transaction.setCustomer(order.getUser());
    transaction.setOrder(order);
    transaction.setSeller(seller);

    // ✅ NEW FIELDS
    transaction.setTotalAmount(paymentRecord.getTotalAmount());
    transaction.setPlatformFee(paymentRecord.getPlatformFee());
    transaction.setDeliveryFee(paymentRecord.getDeliveryFee());
    transaction.setNetPayout(paymentRecord.getNetFarmerPayout());

    return transactionRepository.save(transaction);
}



    @Override
    public List<Transaction> getTransactionBySeller(Seller seller) {
        return transactionRepository.findBySellerId(seller.getId());
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

}
