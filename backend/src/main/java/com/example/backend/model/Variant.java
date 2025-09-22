package com.example.backend.model;

import java.util.UUID;

public class Variant {
    private final UUID id;
    private final String attempt;
    private final Number price;
    private final String variant_image;
    private final String delivery_mode;
    private final Boolean availability;
    private final String validity;
    private final UUID product_id;

    public Variant(UUID id, String attempt, Number price, String variant_image, String delivery_mode,
                   Boolean availability, String validity, UUID product_id) {
        this.id = id;
        this.attempt = attempt;
        this.price = price;
        this.variant_image = variant_image;
        this.delivery_mode = delivery_mode;
        this.availability = availability;
        this.validity = validity;
        this.product_id = product_id;
    }

    public UUID getId() { return id; }
    public String getAttempt() { return attempt; }
    public Number getPrice() { return price; }
    public String getVariant_image() { return variant_image; }
    public String getDelivery_mode() { return delivery_mode; }
    public Boolean getAvailability() { return availability; }
    public String getValidity() { return validity; }
    public UUID getProduct_id() { return product_id; }
}
