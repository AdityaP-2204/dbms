package com.example.backend.model;

import java.util.UUID;

public class ProductSubject {
    private final UUID subject_id;
    private final UUID product_id;
    public ProductSubject(UUID subject_id, UUID product_id) {
        this.subject_id = subject_id;
        this.product_id = product_id;
    }
    public UUID getSubjectId() {
        return subject_id;
    }
    public UUID getProductId() {
        return product_id;
    }
}
