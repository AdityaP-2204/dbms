package com.example.backend.dao;

import com.example.backend.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresCourse")
public class CourseDataAccessService implements CourseDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CourseDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int insertCourse(UUID id, Course course) {
        final String sql = "INSERT INTO courses (id, course_name, course_description) VALUES (?,?,?)";
        return jdbcTemplate.update(sql, id, course.getCourse_name(), course.getCourse_description());
    }

    @Override
    public List<Course> getAllCourses() {
        final String sql = "SELECT * FROM courses";
        return jdbcTemplate.query(sql, (rs, i) -> new Course(
                UUID.fromString(rs.getString("id")),
                rs.getString("course_name"),
                rs.getString("course_description")
        ));
    }

    @Override
    public Course getCourseById(UUID id) {
        final String sql = "SELECT * FROM courses WHERE id=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, i) -> new Course(
                UUID.fromString(rs.getString("id")),
                rs.getString("course_name"),
                rs.getString("course_description")
        ));
    }

    @Override
    public int deleteCourseById(UUID id) {
        final String sql = "DELETE FROM courses WHERE id=?";
        return jdbcTemplate.update(sql, id);
    }
}
