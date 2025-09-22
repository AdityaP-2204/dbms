package com.example.backend.model;

import java.sql.Timestamp;
import java.util.UUID;

public class Product {
    private final UUID id;
    private final String product_title;
    private final String product_description;
    private final UUID course_id;
    private final String product_type;
    private final boolean is_combo;
    private final Timestamp created_date;

    public Product(UUID id, String product_title, String product_description, UUID course_id,
                   String product_type, boolean is_combo, Timestamp created_date) {
        this.id = id;
        this.product_title = product_title;
        this.product_description = product_description;
        this.course_id = course_id;
        this.product_type = product_type;
        this.is_combo = is_combo;
        this.created_date = created_date;
    }

    public UUID getId() { return id; }
    public String getProduct_title() { return product_title; }
    public String getProduct_description() { return product_description; }
    public UUID getCourse_id() { return course_id; }
    public String getProduct_type() { return product_type; }
    public boolean getIs_combo() { return is_combo; }
    public Timestamp getCreated_date() { return created_date; }
}
