package com.example.backend.service;

import com.example.backend.dao.OrdersDao;
import com.example.backend.model.Orders;
import com.example.backend.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class OrdersService {
    private final OrdersDao ordersDao;

    @Autowired
    public OrdersService(@Qualifier("postgresOrders") OrdersDao ordersDao) {
        this.ordersDao = ordersDao;
    }

    public int addOrder(Orders order) {
        return ordersDao.addOrder(order);
    }

    public List<Orders> getAllOrders() {
        return ordersDao.getAllOrders();
    }

    public List<Orders> getOrdersByUserId(UUID userId) {
        return ordersDao.getOrdersByUserId(userId);
    }

    public List<Orders> getOrdersByVariantId(UUID variantId) {
        return ordersDao.getOrdersByVariantId(variantId);
    }

    public List<Orders> getOrdersByTransactionId(UUID transactionId) {
        return ordersDao.getOrdersByTransactionId(transactionId);
    }

    public List<Orders> getOrdersByDate(Timestamp orderDate) {
        return ordersDao.getOrdersByDate(orderDate);
    }

    public List<Orders> getOrdersBetweenDates(Timestamp startDate, Timestamp endDate) {
        return ordersDao.getOrdersBetweenDates(startDate, endDate);
    }

    public List<Orders> getOrdersByProductId(UUID productId) {
        return ordersDao.getOrdersByProductId(productId);
    }

    public List<Orders> getOrdersByPaymentStatus(Transaction.PaymentStatus paymentStatus) {
        return ordersDao.getOrdersByPaymentStatus(paymentStatus);
    }
}
