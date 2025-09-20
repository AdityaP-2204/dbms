package com.example.backend.model;

import java.util.UUID;

public class ProductFaculty {
    private final UUID productId;
    private final UUID facultyId;

    public ProductFaculty(UUID productId, UUID facultyId) {
        this.productId = productId;
        this.facultyId = facultyId;
    }

    public UUID getProductId() {
        return productId;
    }
    public UUID getFacultyId() {
        return facultyId;
    }


}
