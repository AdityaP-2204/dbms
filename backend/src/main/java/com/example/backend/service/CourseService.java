package com.example.backend.service;

import com.example.backend.dao.CourseDao;
import com.example.backend.model.Course;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CourseService {
    private final CourseDao courseDao;
    public CourseService(@Qualifier("postgresCourse") CourseDao courseDao) {
        this.courseDao = courseDao;
    }
    public int addCourse(Course course){
        return courseDao.insertCourse(course);
    }
    public Course getCourse(UUID id){
        return courseDao.getCourseById(id);
    }
    public List<Course> getAllCourses(){
        return courseDao.getAllCourses();
    }
    public int deleteCourse(UUID id){
        return courseDao.deleteCourseById(id);
    }
}
