package com.example.backend.model;


import java.sql.Timestamp;
import java.util.UUID;

public class Product {
    private final UUID id;
    private final String productTitle;
    private final String productDescription;
    private final UUID courseId;
    private final String productType;
    private final boolean isCombo;
    private final Timestamp createdDate;

    public Product(UUID id, String productTitle, String productDescription, UUID courseId, String productType, boolean isCombo, Timestamp createdDate) {
        this.id = id;
        this.productTitle = productTitle;
        this.productDescription = productDescription;
        this.courseId = courseId;
        this.productType = productType;
        this.isCombo = isCombo;
        this.createdDate = createdDate;
    }

    public UUID getId() {
        return id;
    }
    public String getProductTitle() {
        return productTitle;
    }
    public String getProductDescription() {
        return productDescription;
    }
    public UUID getCourseId() {
        return courseId;
    }
    public String getProductType() {
        return productType;
    }
    public boolean isCombo() {
        return isCombo;
    }
    public Timestamp getCreatedDate() {
        return createdDate;
    }
}
