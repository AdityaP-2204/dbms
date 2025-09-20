package com.example.backend.model;

import java.util.UUID;

public class Course {
    private final UUID id;
    private final String courseName;
    private final String courseDescription;

    public Course(UUID id, String courseName, String courseDescription) {
        this.id = id;
        this.courseName = courseName;
        this.courseDescription = courseDescription;
    }

    public UUID getId() {
        return id;
    }
    public String getCourseName() {
        return courseName;
    }
    public String getCourseDescription() {
        return courseDescription;
    }
}
