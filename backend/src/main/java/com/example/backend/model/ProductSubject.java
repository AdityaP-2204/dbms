package com.example.backend.model;

import java.util.UUID;

public class ProductSubject {
    private final UUID product_id;
    private final UUID subject_id;

    public ProductSubject(UUID product_id, UUID subject_id) {
        this.product_id = product_id;
        this.subject_id = subject_id;
    }

    public UUID getProduct_id() { return product_id; }
    public UUID getSubject_id() { return subject_id; }
}
