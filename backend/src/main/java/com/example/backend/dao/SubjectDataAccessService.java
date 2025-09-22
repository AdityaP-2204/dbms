package com.example.backend.dao;

import com.example.backend.model.Subject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresSubject")
public class SubjectDataAccessService implements SubjectDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SubjectDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addSubject(UUID id, Subject subject) {
        final String sql = "INSERT INTO subjects (id, subject_name, subject_description) VALUES (?,?,?)";
        return jdbcTemplate.update(sql, id, subject.getSubject_name(), subject.getSubject_description());
    }

    @Override
    public int deleteSubject(UUID id) {
        final String sql = "DELETE FROM subjects WHERE id=?";
        return jdbcTemplate.update(sql, id);
    }

    @Override
    public List<Subject> getAllSubjects() {
        final String sql = "SELECT * FROM subjects";
        return jdbcTemplate.query(sql, (rs, i) -> new Subject(
                UUID.fromString(rs.getString("id")),
                rs.getString("subject_name"),
                rs.getString("subject_description")
        ));
    }

    @Override
    public Subject getSubjectById(UUID id) {
        final String sql = "SELECT * FROM subjects WHERE id=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, i) -> new Subject(
                UUID.fromString(rs.getString("id")),
                rs.getString("subject_name"),
                rs.getString("subject_description")
        ));
    }
}
