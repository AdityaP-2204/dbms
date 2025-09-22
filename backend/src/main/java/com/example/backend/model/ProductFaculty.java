package com.example.backend.model;

import java.util.UUID;

public class ProductFaculty {
    private final UUID product_id;
    private final UUID faculty_id;

    public ProductFaculty(UUID product_id, UUID faculty_id) {
        this.product_id = product_id;
        this.faculty_id = faculty_id;
    }

    public UUID getProduct_id() { return product_id; }
    public UUID getFaculty_id() { return faculty_id; }
}
