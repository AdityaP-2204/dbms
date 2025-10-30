package com.example.backend.model;

import java.util.UUID;
import java.sql.Timestamp;

public class Orders {
    private final UUID order_item_id;     // Primary Key
    private final UUID user_id;           // Foreign Key
    private final UUID variant_id;        // Foreign Key
    private final int quantity;
    private final double price;
    private final Timestamp order_date;
    private final UUID transaction_id;    // Foreign Key

    public Orders(UUID order_item_id, UUID user_id, UUID variant_id, int quantity,
                  double price, Timestamp order_date, UUID transaction_id) {
        this.order_item_id = order_item_id;
        this.user_id = user_id;
        this.variant_id = variant_id;
        this.quantity = quantity;
        this.price = price;
        this.order_date = order_date;
        this.transaction_id = transaction_id;
    }

    public UUID getOrder_item_id() { return order_item_id; }
    public UUID getUser_id() { return user_id; }
    public UUID getVariant_id() { return variant_id; }
    public int getQuantity() { return quantity; }
    public double getPrice() { return price; }
    public Timestamp getOrder_date() { return order_date; }
    public UUID getTransaction_id() { return transaction_id; }
}
