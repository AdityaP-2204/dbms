package com.example.backend.dao;

import com.example.backend.model.Orders;
import com.example.backend.model.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Repository("postgresOrders")
public class OrdersDataAccessService implements OrdersDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OrdersDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addOrder(UUID id, Orders order) {
        final String sql = "INSERT INTO orders_item (order_item_id, user_id, variant_id, quantity, price, transaction_id) VALUES (?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                order.getUser_id(),
                order.getVariant_id(),
                order.getQuantity(),
                order.getPrice(),
                order.getTransaction_id()
        );
    }

    @Override
    public List<Orders> getAllOrders() {
        final String sql = "SELECT * FROM orders_item";
        return jdbcTemplate.query(sql, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }

    @Override
    public List<Orders> getOrdersByUserId(UUID userId) {
        final String sql = "SELECT * FROM orders_item WHERE user_id = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }

    @Override
    public List<Orders> getOrdersByVariantId(UUID variantId) {
        final String sql = "SELECT * FROM orders_item WHERE variant_id = ?";
        return jdbcTemplate.query(sql, new Object[]{variantId}, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }

    @Override
    public List<Orders> getOrdersByTransactionId(UUID transactionId) {
        final String sql = "SELECT * FROM orders_item WHERE transaction_id = ?";
        return jdbcTemplate.query(sql, new Object[]{transactionId}, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }

    @Override
    public List<Orders> getOrdersByDate(Timestamp orderDate) {
        final String sql = "SELECT * FROM orders_item WHERE DATE(order_date) = DATE(?)";
        return jdbcTemplate.query(sql, new Object[]{orderDate}, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }

    @Override
    public List<Orders> getOrdersBetweenDates(Timestamp startDate, Timestamp endDate) {
        final String sql = "SELECT * FROM orders_item WHERE order_date BETWEEN ? AND ?";
        return jdbcTemplate.query(sql, new Object[]{startDate, endDate}, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }

    @Override
    public List<Orders> getOrdersByProductId(UUID productId) {
        final String sql = """
            SELECT o.* 
            FROM orders_item o
            JOIN variants v ON o.variant_id = v.variant_id
            WHERE v.product_id = ?
        """;
        return jdbcTemplate.query(sql, new Object[]{productId}, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }

    @Override
    public List<Orders> getOrdersByPaymentStatus(Transaction.PaymentStatus paymentStatus) {
        final String sql = """
            SELECT o.* 
            FROM orders_item o
            JOIN transactions t ON o.transaction_id = t.transaction_id
            WHERE t.payment_status = ?
        """;
        return jdbcTemplate.query(sql, new Object[]{paymentStatus.name()}, (rs, i) -> new Orders(
                UUID.fromString(rs.getString("order_item_id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getDouble("price"),
                rs.getTimestamp("order_date"),
                UUID.fromString(rs.getString("transaction_id"))
        ));
    }
}
