package com.example.backend.model;

import java.util.UUID;

public class Subject {
    private final UUID id;
    private final String subjectName;
    private final String subjectDescription;
    public Subject(UUID id, String subjectName, String subjectDescription) {
        this.id = id;
        this.subjectName = subjectName;
        this.subjectDescription = subjectDescription;
    }
    public UUID getId() {
        return id;
    }
    public String getSubjectName() {
        return subjectName;
    }
    public String getSubjectDescription() {
        return subjectDescription;
    }
}
