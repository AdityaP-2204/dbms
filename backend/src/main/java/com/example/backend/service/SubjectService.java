package com.example.backend.service;

import com.example.backend.dao.SubjectDao;
import com.example.backend.model.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SubjectService {
    private final SubjectDao subjectDao;
    @Autowired
    public SubjectService(SubjectDao subjectDao) {
        this.subjectDao = subjectDao;
    }
    public List<Subject> getAllSubjects() {
        return subjectDao.getAllSubjects();
    }
    public Subject getSubjectById(UUID id) {
        return subjectDao.getSubjectById(id);
    }
    public int  addSubject(Subject subject) {
        return subjectDao.addSubject(subject);
    }
    public void deleteSubject(UUID id) {
        subjectDao.deleteSubject(id);
    }
}
