package com.example.backend.service;

import com.example.backend.dao.ReviewDao;
import com.example.backend.model.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ReviewService {
    private final ReviewDao reviewDao;

    @Autowired
    public ReviewService(@Qualifier("postgresReview") ReviewDao reviewDao) {
        this.reviewDao = reviewDao;
    }

    public int addReview(Review review) {
        return reviewDao.insertReview(review);
    }

    public List<Review> getAllReviews() {
        return reviewDao.getAllReviews();
    }

    public List<Review> getReviewsByProductId(UUID product_id) {
        return reviewDao.getReviewsByProductId(product_id);
    }

    public List<Review> getReviewsByUserId(UUID user_id) {
        return reviewDao.getReviewsByUserId(user_id);
    }

    public Review getReviewById(Integer review_id) {
        return reviewDao.getReviewById(review_id);
    }

    public int updateReview(Integer review_id, String comment, Integer rating) {
        return reviewDao.updateReview(review_id, comment, rating);
    }

    public int deleteReview(Integer review_id) {
        return reviewDao.deleteReview(review_id);
    }

    public Map<String, Object> getProductRatingStats(UUID product_id) {
        return reviewDao.getProductRatingStats(product_id);
    }

    public List<Map<String, Object>> getAllProductsWithRatings() {
        return reviewDao.getAllProductsWithRatings();
    }
}