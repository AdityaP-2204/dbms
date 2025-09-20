package com.example.backend.model;

import com.example.backend.dao.FacultyDao;

import java.util.UUID;

public class Variant {
    private final UUID id;
    private final String attempt;
    private final Number  price;
    private final String VariantImage;
    private final String deliveryMode;
    private final Boolean availability;
    private final String validity;
    private final UUID ProductId;

    public Variant(UUID id, String attempt, Number price, String VariantImage, String deliveryMode, Boolean availability, String validity, UUID ProductId) {
        this.id = id;
        this.attempt = attempt;
        this.price = price;
        this.VariantImage = VariantImage;
        this.deliveryMode = deliveryMode;
        this.availability = availability;
        this.validity = validity;
        this.ProductId = ProductId;
    }
    public UUID getId() {
        return id;
    }
    public String getAttempt() {
        return attempt;
    }
    public Number getPrice() {
        return price;
    }
    public String getVariantImage() {
        return VariantImage;
    }
    public String getDeliveryMode() {
        return deliveryMode;
    }
    public Boolean getAvailability() {
        return availability;
    }
    public String getValidity() {
        return validity;
    }
    public UUID getProductId() {
        return ProductId;
    }
}
