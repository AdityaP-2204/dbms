package com.example.backend.api;

import com.example.backend.model.Review;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequestMapping("/api/v1/review")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public int addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping(params = "product_id")
    public List<Review> getReviewsByProductId(@RequestParam UUID product_id) {
        return reviewService.getReviewsByProductId(product_id);
    }

    @GetMapping(params = "user_id")
    public List<Review> getReviewsByUserId(@RequestParam UUID user_id) {
        return reviewService.getReviewsByUserId(user_id);
    }

    @GetMapping(params = "review_id")
    public Review getReviewById(@RequestParam Integer review_id) {
        return reviewService.getReviewById(review_id);
    }

    @PutMapping(params = "review_id")
    public int updateReview(@RequestParam Integer review_id, @RequestBody Review review) {
        return reviewService.updateReview(review_id, review.getComment(), review.getRating());
    }

    @DeleteMapping(params = "review_id")
    public int deleteReview(@RequestParam Integer review_id) {
        return reviewService.deleteReview(review_id);
    }

    @GetMapping("/stats")
    public Map<String, Object> getProductRatingStats(@RequestParam UUID product_id) {
        return reviewService.getProductRatingStats(product_id);
    }

    @GetMapping("/products-with-ratings")
    public List<Map<String, Object>> getAllProductsWithRatings() {
        return reviewService.getAllProductsWithRatings();
    }
}