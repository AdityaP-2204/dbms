package com.example.backend.dao;

import com.example.backend.model.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Repository("postgresTransaction")
public class TransactionDataAccessService implements TransactionDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public TransactionDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addTransaction(UUID id, Transaction transaction) {
        final String sql = "INSERT INTO transactions (transaction_id, user_id, total_amount, coupon_id, payment_status, transaction_date) VALUES (?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                transaction.getUser_id(),
                transaction.getTotal_amount(),
                transaction.getcoupon_id(),
                transaction.getPayment_status().name(),
                transaction.getTransaction_date()
        );
    }

    @Override
    public List<Transaction> getAllTransactions() {
        final String sql = "SELECT * FROM transactions";
        return jdbcTemplate.query(sql, (rs, i) -> new Transaction(
                UUID.fromString(rs.getString("transaction_id")),
                UUID.fromString(rs.getString("user_id")),
                rs.getDouble("total_amount"),
                rs.getString("coupon_id") != null ? UUID.fromString(rs.getString("coupon_id")) : null,
                Transaction.PaymentStatus.valueOf(rs.getString("payment_status")),
                rs.getTimestamp("transaction_date")
        ));
    }

    @Override
    public List<Transaction> getTransactionsByUserId(UUID userId) {
        final String sql = "SELECT * FROM transactions WHERE user_id = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, i) -> new Transaction(
                UUID.fromString(rs.getString("transaction_id")),
                UUID.fromString(rs.getString("user_id")),
                rs.getDouble("total_amount"),
                rs.getString("coupon_id") != null ? UUID.fromString(rs.getString("coupon_id")) : null,
                Transaction.PaymentStatus.valueOf(rs.getString("payment_status")),
                rs.getTimestamp("transaction_date")
        ));
    }

    @Override
    public List<Transaction> getTransactionsByStatus(Transaction.PaymentStatus status) {
        final String sql = "SELECT * FROM transactions WHERE payment_status = ?";
        return jdbcTemplate.query(sql, new Object[]{status.name()}, (rs, i) -> new Transaction(
                UUID.fromString(rs.getString("transaction_id")),
                UUID.fromString(rs.getString("user_id")),
                rs.getDouble("total_amount"),
                rs.getString("coupon_id") != null ? UUID.fromString(rs.getString("coupon_id")) : null,
                Transaction.PaymentStatus.valueOf(rs.getString("payment_status")),
                rs.getTimestamp("transaction_date")
        ));
    }

    @Override
    public List<Transaction> getTransactionsByDate(Timestamp date) {
        final String sql = "SELECT * FROM transactions WHERE DATE(transaction_date) = DATE(?)";
        return jdbcTemplate.query(sql, new Object[]{date}, (rs, i) -> new Transaction(
                UUID.fromString(rs.getString("transaction_id")),
                UUID.fromString(rs.getString("user_id")),
                rs.getDouble("total_amount"),
                rs.getString("coupon_id") != null ? UUID.fromString(rs.getString("coupon_id")) : null,
                Transaction.PaymentStatus.valueOf(rs.getString("payment_status")),
                rs.getTimestamp("transaction_date")
        ));
    }

    @Override
    public List<Transaction> getTransactionsBetweenDates(Timestamp startDate, Timestamp endDate) {
        final String sql = "SELECT * FROM transactions WHERE transaction_date BETWEEN ? AND ?";
        return jdbcTemplate.query(sql, new Object[]{startDate, endDate}, (rs, i) -> new Transaction(
                UUID.fromString(rs.getString("transaction_id")),
                UUID.fromString(rs.getString("user_id")),
                rs.getDouble("total_amount"),
                rs.getString("coupon_id") != null ? UUID.fromString(rs.getString("coupon_id")) : null,
                Transaction.PaymentStatus.valueOf(rs.getString("payment_status")),
                rs.getTimestamp("transaction_date")
        ));
    }
}
