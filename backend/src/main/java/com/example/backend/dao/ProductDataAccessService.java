package com.example.backend.dao;

import com.example.backend.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestMapping;

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
        final String sql="INSERT INTO products (id, productTitle, productDescription, courseId, productType, isCombo ) VALUES (?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                product.getProductTitle(),
                product.getProductDescription(),
                product.getCourseId(),
                product.getProductType(),
                product.isCombo()
        );
    }

    @Override
    public List<Product> getAllProducts() {
        final String sql="SELECT * FROM products";
        return jdbcTemplate.query(sql, (resultSet, i)->{
            UUID id = UUID.fromString(resultSet.getString("id"));
            String productTitle = resultSet.getString("productTitle");
            String productDescription = resultSet.getString("productDescription");
            UUID courseId = UUID.fromString(resultSet.getString("courseId"));
            String productType = resultSet.getString("productType");
            Boolean isCombo = resultSet.getBoolean("isCombo");
            Timestamp productDate = resultSet.getTimestamp("createdDate");
            return new Product(id, productTitle,productDescription,courseId,productType,isCombo,productDate);
        });
    }

    @Override
    public Product getProductById(UUID id) {
        final String sql="SELECT * FROM products WHERE id=?";
        return jdbcTemplate.queryForObject(sql,new Object[]{id},(resultSet,i)->{
            UUID productId = UUID.fromString(resultSet.getString("id"));
            String productTitle = resultSet.getString("productTitle");
            String productDescription = resultSet.getString("productDescription");
            UUID courseId = UUID.fromString(resultSet.getString("courseId"));
            String productType = resultSet.getString("productType");
            Boolean isCombo = resultSet.getBoolean("isCombo");
            Timestamp productDate = resultSet.getTimestamp("createdDate");
            return new Product(productId,productTitle,productDescription,courseId,productType,isCombo,productDate);
        });
    }

    @Override
    public void deleteProduct(UUID id) {
        final String sql="DELETE FROM products WHERE id=?";
        jdbcTemplate.update(sql,id);
    }
}
