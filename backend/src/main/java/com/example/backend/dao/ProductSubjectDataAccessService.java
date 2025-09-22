package com.example.backend.dao;

import com.example.backend.model.ProductSubject;
import com.example.backend.model.Subject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresProductSubject")
public class ProductSubjectDataAccessService implements ProductSubjectDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProductSubjectDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int insertProductSubject(ProductSubject productSubject) {
        final String sql = "INSERT INTO product_subjects (product_id, subject_id) VALUES (?,?)";
        return jdbcTemplate.update(sql, productSubject.getProduct_id(), productSubject.getSubject_id());
    }

    @Override
    public List<ProductSubject> getAllProductSubject() {
        final String sql = "SELECT * FROM product_subjects";
        return jdbcTemplate.query(sql, (rs, i) -> new ProductSubject(
                UUID.fromString(rs.getString("product_id")),
                UUID.fromString(rs.getString("subject_id"))
        ));
    }

    @Override
    public List<Subject> getAllProductSubjectByProductId(UUID product_id) {
        final String sql = """
            SELECT s.id, s.subject_name, s.subject_description
            FROM product_subjects ps
            JOIN subjects s ON ps.subject_id = s.id
            WHERE ps.product_id = ?
        """;
        return jdbcTemplate.query(sql, new Object[]{product_id}, (rs, i) -> new Subject(
                UUID.fromString(rs.getString("id")),
                rs.getString("subject_name"),
                rs.getString("subject_description")
        ));
    }
}
