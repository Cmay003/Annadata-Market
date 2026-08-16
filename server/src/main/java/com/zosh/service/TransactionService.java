package com.zosh.service;

import java.util.List;

import com.zosh.model.Order;
import com.zosh.model.PaymentRecord;
import com.zosh.model.Seller;
import com.zosh.model.Transaction;

public interface TransactionService {

    Transaction createTransaction(Order order,PaymentRecord paymentRecord);
    List<Transaction> getTransactionBySeller(Seller seller);
    List<Transaction>getAllTransactions();
}
