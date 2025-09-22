package com.example.backend.dao;

import com.example.backend.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Repository("postgresProduct")
public class ProductDataAccessService implements ProductDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProductDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addProduct(UUID id, Product product) {
        final String sql = "INSERT INTO products (id, product_title, product_description, course_id, product_type, is_combo) VALUES (?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                product.getProduct_title(),
                product.getProduct_description(),
                product.getCourse_id(),
                product.getProduct_type(),
                product.getIs_combo()
        );
    }

    @Override
    public List<Product> getAllProducts() {
        final String sql = "SELECT * FROM products";
        return jdbcTemplate.query(sql, (rs, i) -> new Product(
                UUID.fromString(rs.getString("id")),
                rs.getString("product_title"),
                rs.getString("product_description"),
                UUID.fromString(rs.getString("course_id")),
                rs.getString("product_type"),
                rs.getBoolean("is_combo"),
                rs.getTimestamp("created_date")
        ));
    }

    @Override
    public Product getProductById(UUID id) {
        final String sql = "SELECT * FROM products WHERE id=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, i) -> new Product(
                UUID.fromString(rs.getString("id")),
                rs.getString("product_title"),
                rs.getString("product_description"),
                UUID.fromString(rs.getString("course_id")),
                rs.getString("product_type"),
                rs.getBoolean("is_combo"),
                rs.getTimestamp("created_date")
        ));
    }

    @Override
    public void deleteProduct(UUID id) {
        final String sql = "DELETE FROM products WHERE id=?";
        jdbcTemplate.update(sql, id);
    }
}
