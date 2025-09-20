package com.example.backend.dao;

import com.example.backend.model.Faculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.annotation.AliasFor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresFaculty")
public class FacultyDataAccessService implements FacultyDao {
    private final JdbcTemplate jdbcTemplate;
    @Autowired
    public FacultyDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addFaculty(UUID id, Faculty faculty) {
        final String sql = "INSERT INTO faculty (id, name, description, email, InstituteName, ProfileImage) VALUES (?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                faculty.getName(),
                faculty.getDescription(),
                faculty.getEmail(),
                faculty.getInstituteName(),
                faculty.getProfileImage()
        );


    }

    @Override
    public List<Faculty> getAllFaculty() {
        final String sql="SELECT * FROM faculty";
        return jdbcTemplate.query(sql,(resultSet,i)->{
            UUID id=UUID.fromString(resultSet.getString("id"));
            String name=resultSet.getString("name");
            String description=resultSet.getString("description");
            String email=resultSet.getString("email");
            String ProfileImage=resultSet.getString("ProfileImage");
            String InstituteName=resultSet.getString("InstituteName");
            return new Faculty(
                    id,
                    name,
                    description,
                    email,
                    InstituteName,
                    ProfileImage
            );

        });
    }
}
