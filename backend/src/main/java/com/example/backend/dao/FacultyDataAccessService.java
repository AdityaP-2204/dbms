package com.example.backend.dao;

import com.example.backend.model.Faculty;
import org.springframework.beans.factory.annotation.Autowired;
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
        final String sql = "INSERT INTO faculty (id, name, description, email, institute_name, profile_image) VALUES (?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                faculty.getName(),
                faculty.getDescription(),
                faculty.getEmail(),
                faculty.getInstitute_name(),
                faculty.getProfile_image()
        );
    }

    @Override
    public List<Faculty> getAllFaculty() {
        final String sql = "SELECT * FROM faculty";
        return jdbcTemplate.query(sql, (rs, i) -> new Faculty(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getString("description"),
                rs.getString("email"),
                rs.getString("institute_name"),
                rs.getString("profile_image")
        ));
    }
}
