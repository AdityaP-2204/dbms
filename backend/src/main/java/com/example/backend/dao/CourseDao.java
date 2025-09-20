package com.example.backend.dao;

import com.example.backend.model.Course;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;


public interface CourseDao {
    int insertCourse(UUID id,Course course);
    default int insertCourse(Course course){
        UUID id = UUID.randomUUID();
        return insertCourse(id,course);
    }
    List<Course> getAllCourses();
    Course getCourseById(UUID id);
    int deleteCourseById(UUID id);
}
