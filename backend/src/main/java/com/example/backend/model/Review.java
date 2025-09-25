package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Review {
    private final Integer review_id;
    private final UUID user_id;
    private final UUID product_id;
    private final String comment;
    private final LocalDateTime created_at;

    public Review(Integer review_id, UUID user_id, UUID product_id, String comment, LocalDateTime created_at) {
        this.review_id = review_id;
        this.user_id = user_id;
        this.product_id = product_id;
        this.comment = comment;
        this.created_at = created_at;
    }

    public Integer getReview_id() { return review_id; }
    public UUID getUser_id() { return user_id; }
    public UUID getProduct_id() { return product_id; }
    public String getComment() { return comment; }
    public LocalDateTime getCreated_at() { return created_at; }
}