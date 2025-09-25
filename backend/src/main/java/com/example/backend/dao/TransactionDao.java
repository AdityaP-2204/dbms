package com.example.backend.dao;

import com.example.backend.model.Transaction;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public interface TransactionDao {
    int addTransaction(UUID id, Transaction transaction);

    default int addTransaction(Transaction transaction) {
        UUID id = UUID.randomUUID();
        return addTransaction(id, transaction);
    }

    List<Transaction> getAllTransactions();
    List<Transaction> getTransactionsByUserId(UUID userId);
    List<Transaction> getTransactionsByStatus(Transaction.PaymentStatus status);
    List<Transaction> getTransactionsByDate(Timestamp date);
    List<Transaction> getTransactionsBetweenDates(Timestamp startDate, Timestamp endDate);
}
