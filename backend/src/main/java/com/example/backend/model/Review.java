package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.UUID;

public class Review {
    @JsonProperty("review_id")
    private final Integer review_id;
    
    @JsonProperty("user_id")
    private final UUID user_id;
    
    @JsonProperty("product_id")
    private final UUID product_id;
    
    @JsonProperty("comment")
    private final String comment;
    
    @JsonProperty("rating")
    private final Integer rating;
    
    @JsonProperty("created_at")
    private final LocalDateTime created_at;

    public Review(Integer review_id, UUID user_id, UUID product_id, String comment, Integer rating, LocalDateTime created_at) {
        this.review_id = review_id;
        this.user_id = user_id;
        this.product_id = product_id;
        this.comment = comment;
        this.rating = rating;
        this.created_at = created_at;
    }

    public Integer getReview_id() { return review_id; }
    public UUID getUser_id() { return user_id; }
    public UUID getProduct_id() { return product_id; }
    public String getComment() { return comment; }
    public Integer getRating() { return rating; }
    public LocalDateTime getCreated_at() { return created_at; }
}