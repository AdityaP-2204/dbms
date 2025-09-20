package com.example.backend.dao;

import com.example.backend.model.ProductSubject;
import com.example.backend.model.Subject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresProductSubject")
public class ProductSubjectDataAccessService implements ProductSubjectDao{
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProductSubjectDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int insertProductSubject(ProductSubject productSubject) {
        final String sql="INSERT INTO productSubjects (product_id, subject_id) VALUES (?,?)";
        return jdbcTemplate.update(sql,productSubject.getProductId(),productSubject.getSubjectId());
    }

    @Override
    public List<ProductSubject> getAllProductSubject() {
        final String sql="SELECT * FROM productSubjects";
        return jdbcTemplate.query(sql, (resultSet,i)->{
            UUID product_id = UUID.fromString(resultSet.getString("product_id"));
            UUID subject_id = UUID.fromString(resultSet.getString("subject_id"));
            return new ProductSubject(product_id,subject_id);
        });
    }

    @Override
    public List<Subject> getAllProductSubjectByProductId(UUID product_id) {
        final String sql = """
            SELECT s.id, s.subjectName, s.subjectDescription
            FROM productSubjects ps
            JOIN subjects s ON ps.subject_id = s.id
            WHERE ps.product_id = ?
          """;
        return jdbcTemplate.query(sql,new Object[]{product_id},(resultSet,i)->{
            UUID subjectId = UUID.fromString(resultSet.getString("id"));
            String subjectName = resultSet.getString("subjectName");
            String subjectDescription = resultSet.getString("subjectDescription");
            return new Subject(subjectId,subjectName,subjectDescription);
        });
    }
}
