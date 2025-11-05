package com.example.backend.service;

import com.example.backend.dao.TransactionDao;
import com.example.backend.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {
    private final TransactionDao transactionDao;

    @Autowired
    public TransactionService(@Qualifier("postgresTransaction") TransactionDao transactionDao) {
        this.transactionDao = transactionDao;
    }

    public UUID addTransaction(Transaction transaction) {
        return transactionDao.addTransaction(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionDao.getAllTransactions();
    }

    public List<Transaction> getTransactionsByUserId(UUID userId) {
        return transactionDao.getTransactionsByUserId(userId);
    }

    public List<Transaction> getTransactionsByStatus(Transaction.PaymentStatus status) {
        return transactionDao.getTransactionsByStatus(status);
    }

    public List<Transaction> getTransactionsByDate(Timestamp date) {
        return transactionDao.getTransactionsByDate(date);
    }

    public List<Transaction> getTransactionsBetweenDates(Timestamp startDate, Timestamp endDate) {
        return transactionDao.getTransactionsBetweenDates(startDate, endDate);
    }
}
