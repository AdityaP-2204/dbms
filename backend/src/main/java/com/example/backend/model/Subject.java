package com.example.backend.model;

import java.util.UUID;

public class Subject {
    private final UUID id;
    private final String subject_name;
    private final String subject_description;

    public Subject(UUID id, String subject_name, String subject_description) {
        this.id = id;
        this.subject_name = subject_name;
        this.subject_description = subject_description;
    }

    public UUID getId() { return id; }
    public String getSubject_name() { return subject_name; }
    public String getSubject_description() { return subject_description; }
}
