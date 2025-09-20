package com.example.backend.api;

import com.example.backend.model.Course;
import com.example.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/course")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class CourseController {
    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public int addCourse(@RequestBody Course course) {
        return courseService.addCourse(course);
    }
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
    @GetMapping(params="id")
    public Course getCourseById(@RequestParam UUID id) {
        return courseService.getCourse(id);
    }
    @DeleteMapping
    public void deleteCourseById(@RequestParam UUID id) {
        courseService.deleteCourse(id);
    }

}
