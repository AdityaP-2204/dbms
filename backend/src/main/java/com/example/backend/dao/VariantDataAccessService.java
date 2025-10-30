package com.example.backend.dao;

import com.example.backend.model.Variant;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresVariant")
public class VariantDataAccessService implements VariantDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public VariantDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addVariant(UUID id, Variant variant) {
        final String sql = "INSERT INTO variant (id, attempt, price, variant_image, delivery_mode, availability, validity, product_id) VALUES (?,?,?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                variant.getAttempt(),
                variant.getPrice(),
                variant.getVariant_image(),
                variant.getDelivery_mode(),
                variant.getAvailability(),
                variant.getValidity(),
                variant.getProduct_id()
        );
    }

    @Override
    public List<Variant> getAllVariants() {
        final String sql = "SELECT * FROM variant";
        return jdbcTemplate.query(sql, (rs, i) -> new Variant(
                UUID.fromString(rs.getString("id")),
                rs.getString("attempt"),
                rs.getInt("price"),
                rs.getString("variant_image"),
                rs.getString("delivery_mode"),
                rs.getBoolean("availability"),
                rs.getString("validity"),
                UUID.fromString(rs.getString("product_id"))
        ));
    }

    @Override
    public List<Variant> getAllVariantsByProductId(UUID productId) {
        final String sql = "SELECT * FROM variant WHERE product_id=?";
        return jdbcTemplate.query(sql, new Object[]{productId}, (rs, i) -> new Variant(
                UUID.fromString(rs.getString("id")),
                rs.getString("attempt"),
                rs.getInt("price"),
                rs.getString("variant_image"),
                rs.getString("delivery_mode"),
                rs.getBoolean("availability"),
                rs.getString("validity"),
                UUID.fromString(rs.getString("product_id"))
        ));
    }

    @Override
    public Variant getVariantById(UUID id) {
        final String sql = "SELECT * FROM variant WHERE id=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, i) -> new Variant(
                UUID.fromString(rs.getString("id")),
                rs.getString("attempt"),
                rs.getInt("price"),
                rs.getString("variant_image"),
                rs.getString("delivery_mode"),
                rs.getBoolean("availability"),
                rs.getString("validity"),
                UUID.fromString(rs.getString("product_id"))
        ));
    }
}
