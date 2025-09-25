package com.example.backend.dao;

import com.example.backend.model.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
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
        final String sql = "INSERT INTO reviews (user_id, product_id, comment, created_at) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                review.getUser_id(),
                review.getProduct_id(),
                review.getComment(),
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
                rs.getTimestamp("created_at").toLocalDateTime()
        ), review_id);
    }

    @Override
    public int updateReview(Integer review_id, String comment) {
        final String sql = "UPDATE reviews SET comment = ? WHERE review_id = ?";
        return jdbcTemplate.update(sql, comment, review_id);
    }

    @Override
    public int deleteReview(Integer review_id) {
        final String sql = "DELETE FROM reviews WHERE review_id = ?";
        return jdbcTemplate.update(sql, review_id);
    }
}