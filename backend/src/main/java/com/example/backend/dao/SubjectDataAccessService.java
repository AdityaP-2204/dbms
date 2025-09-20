package com.example.backend.dao;

import com.example.backend.model.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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
        final String sql = "INSERT INTO subjects (id, subjectName, subjectDescription) VALUES (?, ?, ?) ";
        return jdbcTemplate.update(sql, id, subject.getSubjectName(), subject.getSubjectDescription());
    }

    @Override
    public int deleteSubject(UUID id) {
        final String sql = "DELETE FROM subjects WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    @Override
    public List<Subject> getAllSubjects() {
        final String sql = "SELECT * FROM subjects";
        return jdbcTemplate.query(sql, (resultSet,i)->{
            UUID id = UUID.fromString(resultSet.getString("id"));
            String subjectName = resultSet.getString("subjectName");
            String subjectDescription = resultSet.getString("subjectDescription");
            return new Subject(id,subjectName,subjectDescription);
        });
    }

    @Override
    public Subject getSubjectById(UUID id) {
        final  String sql = "SELECT * FROM subjects WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id},(resultSet,i)->{
            UUID id1=UUID.fromString(resultSet.getString("id"));
            String subjectName = resultSet.getString("subjectName");
            String subjectDescription = resultSet.getString("subjectDescription");
            return  new Subject(id1,subjectName,subjectDescription);
        });
    }
}
