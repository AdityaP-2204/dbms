package com.example.backend.model;

import java.util.UUID;

public class Course {
    private final UUID id;
    private final String course_name;
    private final String course_description;

    public Course(UUID id, String course_name, String course_description) {
        this.id = id;
        this.course_name = course_name;
        this.course_description = course_description;
    }

    public UUID getId() { return id; }
    public String getCourse_name() { return course_name; }
    public String getCourse_description() { return course_description; }
}
