package com.example.backend.dao;

import com.example.backend.model.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository("postgresReview")
public class ReviewDataAccessService implements ReviewDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ReviewDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int insertReview(Review review) {
        final String sql = "INSERT INTO reviews (user_id, product_id, comment, rating, created_at) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                review.getUser_id(),
                review.getProduct_id(),
                review.getComment(),
                review.getRating(),
                review.getCreated_at()
        );
    }

    @Override
    public List<Review> getAllReviews() {
        final String sql = "SELECT * FROM reviews ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, i) -> new Review(
                rs.getInt("review_id"),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("product_id")),
                rs.getString("comment"),
                rs.getInt("rating"),
                rs.getTimestamp("created_at").toLocalDateTime()
        ));
    }

    @Override
    public List<Review> getReviewsByProductId(UUID product_id) {
        final String sql = "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, i) -> new Review(
                rs.getInt("review_id"),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("product_id")),
                rs.getString("comment"),
                rs.getInt("rating"),
                rs.getTimestamp("created_at").toLocalDateTime()
        ), product_id);
    }

    @Override
    public List<Review> getReviewsByUserId(UUID user_id) {
        final String sql = "SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, (rs, i) -> new Review(
                rs.getInt("review_id"),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("product_id")),
                rs.getString("comment"),
                rs.getInt("rating"),
                rs.getTimestamp("created_at").toLocalDateTime()
        ), user_id);
    }

    @Override
    public Review getReviewById(Integer review_id) {
        final String sql = "SELECT * FROM reviews WHERE review_id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, i) -> new Review(
                rs.getInt("review_id"),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("product_id")),
                rs.getString("comment"),
                rs.getInt("rating"),
                rs.getTimestamp("created_at").toLocalDateTime()
        ), review_id);
    }

    @Override
    public int updateReview(Integer review_id, String comment, Integer rating) {
        final String sql = "UPDATE reviews SET comment = ?, rating = ? WHERE review_id = ?";
        return jdbcTemplate.update(sql, comment, rating, review_id);
    }

    @Override
    public int deleteReview(Integer review_id) {
        final String sql = "DELETE FROM reviews WHERE review_id = ?";
        return jdbcTemplate.update(sql, review_id);
    }

    @Override
    public Map<String, Object> getProductRatingStats(UUID product_id) {
        final String sql = """
            SELECT 
                AVG(rating::decimal) as average_rating,
                COUNT(*) as review_count,
                COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
                COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
                COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
                COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
                COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
            FROM reviews 
            WHERE product_id = ?
        """;
        
        return jdbcTemplate.queryForMap(sql, product_id);
    }

    @Override
    public List<Map<String, Object>> getAllProductsWithRatings() {
        final String sql = """
            SELECT 
                p.id as product_id,
                p.product_title,
                COALESCE(AVG(r.rating::decimal), 0) as average_rating,
                COALESCE(COUNT(r.rating), 0) as review_count
            FROM products p
            LEFT JOIN reviews r ON p.id = r.product_id
            GROUP BY p.id, p.product_title
            ORDER BY average_rating DESC
        """;
        
        return jdbcTemplate.queryForList(sql);
    }
}