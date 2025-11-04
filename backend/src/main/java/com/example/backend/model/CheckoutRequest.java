package com.example.backend.model;

import com.example.backend.model.Transaction;
import java.util.List;
import java.util.UUID;

public class CheckoutRequest {
    private UUID userId;
    private String name;
    private String email;
    private List<CartItem> items;
    private double totalAmount;
    private double discount;
    private String couponCode;

    public Iterable<? extends CartItem> getCartItems() {
        return items;
    }


    // Inner class for items
    public static class CartItem {
        private UUID id;
        private UUID variant_id;
        private int quantity;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public UUID getVariant_id() { return variant_id; }
        public void setVariant_id(UUID variant_id) { this.variant_id = variant_id; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() {
        return name;
    }
    public void setName(String name) { this.name = name; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
}
