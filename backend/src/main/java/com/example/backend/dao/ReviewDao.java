package com.example.backend.dao;

import com.example.backend.model.Review;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ReviewDao {
    int insertReview(Review review);
    List<Review> getAllReviews();
    List<Review> getReviewsByProductId(UUID product_id);
    List<Review> getReviewsByUserId(UUID user_id);
    Review getReviewById(Integer review_id);
    int updateReview(Integer review_id, String comment, Integer rating);
    int deleteReview(Integer review_id);
    Map<String, Object> getProductRatingStats(UUID product_id);
    List<Map<String, Object>> getAllProductsWithRatings();
}