package com.example.backend.dao;

import com.example.backend.model.Orders;
import com.example.backend.model.Transaction;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public interface OrdersDao {
    int addOrder(UUID id, Orders order);

    default int addOrder(Orders order) {
        UUID id = UUID.randomUUID();
        return addOrder(id, order);
    }

    List<Orders> getAllOrders();
    List<Orders> getOrdersByUserId(UUID userId);
    List<Orders> getOrdersByVariantId(UUID variantId);
    List<Orders> getOrdersByTransactionId(UUID transactionId);
    List<Orders> getOrdersByDate(Timestamp orderDate);
    List<Orders> getOrdersBetweenDates(Timestamp startDate, Timestamp endDate);


    
    // Get all orders that include variants of a given product
    List<Orders> getOrdersByProductId(UUID productId);

    // Get all orders whose corresponding transactions have a given payment status
    List<Orders> getOrdersByPaymentStatus(Transaction.PaymentStatus paymentStatus);
}
