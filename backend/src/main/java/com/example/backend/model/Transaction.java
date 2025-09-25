package com.example.backend.model;

import java.util.UUID;
import java.sql.Timestamp;

public class Transaction {
    private final UUID transaction_id;   
    private final UUID user_id;          
    private final Double total_amount;
    private final UUID coupon_id;       
    private final PaymentStatus payment_status;
    private final Timestamp transaction_date;

    public Transaction(UUID transaction_id, UUID user_id, Double total_amount,
                       UUID coupon_id, PaymentStatus payment_status,
                       Timestamp transaction_date) {
        this.transaction_id = transaction_id;
        this.user_id = user_id;
        this.total_amount = total_amount;
        this.coupon_id = coupon_id;
        this.payment_status = payment_status;
        this.transaction_date = transaction_date;
    }

    public UUID getTransaction_id() { return transaction_id; }
    public UUID getUser_id() { return user_id; }
    public Double getTotal_amount() { return total_amount; }
    public UUID getcoupon_id() { return coupon_id; }
    public PaymentStatus getPayment_status() { return payment_status; }
    public Timestamp getTransaction_date() { return transaction_date; }


    public enum PaymentStatus {
        PENDING,
        SUCCESSFUL,
        FAILED
    }
}
