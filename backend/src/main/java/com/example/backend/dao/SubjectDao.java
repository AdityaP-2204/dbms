package com.example.backend.dao;

import com.example.backend.model.Subject;

import java.util.List;
import java.util.UUID;

public interface SubjectDao {
    int addSubject(UUID id, Subject subject);
    default int addSubject(Subject subject){
        UUID id = UUID.randomUUID();
        return addSubject(id, subject);
    }
    int deleteSubject(UUID id);
    List<Subject> getAllSubjects();
    Subject getSubjectById(UUID id);
}
