package com.example.backend.dao;

import com.example.backend.model.Faculty;
import com.example.backend.model.ProductFaculty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresProductFaculty")
public class ProductFacultyDataAccessService implements ProductFacultyDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProductFacultyDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addProductFaculty(ProductFaculty productFaculty) {
        final String sql = "INSERT INTO product_faculty (product_id, faculty_id) VALUES (?,?)";
        return jdbcTemplate.update(sql, productFaculty.getProduct_id(), productFaculty.getFaculty_id());
    }

    @Override
    public List<ProductFaculty> getAllProductFaculty() {
        final String sql = "SELECT * FROM product_faculty";
        return jdbcTemplate.query(sql, (rs, i) -> new ProductFaculty(
                UUID.fromString(rs.getString("product_id")),
                UUID.fromString(rs.getString("faculty_id"))
        ));
    }

    @Override
    public List<Faculty> getAllFacultyByProductId(UUID product_id) {
        final String sql = """
            SELECT f.id, f.name, f.description, f.email, f.institute_name, f.profile_image
            FROM faculty f
            JOIN product_faculty pf ON f.id = pf.faculty_id
            WHERE pf.product_id = ?
        """;
        return jdbcTemplate.query(sql, new Object[]{product_id}, (rs, i) -> new Faculty(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getString("description"),
                rs.getString("email"),
                rs.getString("institute_name"),
                rs.getString("profile_image")
        ));
    }
}
