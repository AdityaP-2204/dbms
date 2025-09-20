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
        final String sql= "INSERT INTO courses (id, courseName, courseDescription) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql,id,course.getCourseName(),course.getCourseDescription());
    }

    @Override
    public List<Course> getAllCourses() {
        final String sql="SELECT * FROM courses";
        return jdbcTemplate.query(sql,(resultSet,i)->{
            UUID id=UUID.fromString(resultSet.getString("id"));
            String courseName=resultSet.getString("courseName");
            String courseDescription=resultSet.getString("courseDescription");
            return new Course(id,courseName,courseDescription);
        });
    }

    @Override
    public Course getCourseById(UUID id) {
        final String sql="SELECT * FROM courses WHERE id=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id},(resultSet,i)->{
            UUID courseId=UUID.fromString(resultSet.getString("id"));
            String courseName=resultSet.getString("courseName");
            String courseDescription=resultSet.getString("courseDescription");
            return new Course(courseId,courseName,courseDescription);
        });
    }

    @Override
    public int deleteCourseById(UUID id) {
        final String sql="DELETE FROM courses WHERE id=?";
        return jdbcTemplate.update(sql,id);
    }
}
