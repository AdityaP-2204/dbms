package com.example.backend.dao;

import com.example.backend.model.Faculty;
import com.example.backend.model.ProductFaculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresProductFaculty")
public class ProductFacultyDataAccessService implements ProductFacultyDao{

    private final JdbcTemplate jdbcTemplate;
    @Autowired
    public ProductFacultyDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addProductFaculty(ProductFaculty productFaculty) {
        final String sql="INSERT INTO productFaculty (productId, facultyId) VALUES (?,?)";
        return jdbcTemplate.update(sql,productFaculty.getProductId(),productFaculty.getFacultyId());
    }

    @Override
    public List<ProductFaculty> getAllProductFaculty() {
        final String sql="SELECT * FROM productFaculty";
        return jdbcTemplate.query(sql,(resultSet,i)->{
            UUID productId = UUID.fromString(resultSet.getString("productId"));
            UUID facultyId = UUID.fromString(resultSet.getString("facultyId"));
            return new ProductFaculty(productId,facultyId);
        });
    }

    @Override
    public List<Faculty> getAllFacultyByProductId(UUID productId) {
        final String sql = """
            SELECT f.id, f.name, f.description, f.email, f.InstituteName, f.ProfileImage
            FROM faculty f
            JOIN productFaculty pf ON f.id = pf.facultyId
            WHERE pf.productId = ?
          """;
        return jdbcTemplate.query(sql,new Object[]{productId},(resultSet,id)->{
            UUID facultyId=UUID.fromString(resultSet.getString("id"));
            String facultyName = resultSet.getString("name");
            String facultyDescription = resultSet.getString("description");
            String email=resultSet.getString("email");
            String instituteName=resultSet.getString("InstituteName");
            String profileImage=resultSet.getString("ProfileImage");
            return new Faculty(facultyId,facultyName,facultyDescription,email,instituteName,profileImage);
        });
    }

}
