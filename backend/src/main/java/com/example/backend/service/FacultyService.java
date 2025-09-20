package com.example.backend.service;

import com.example.backend.dao.FacultyDao;
import com.example.backend.model.Faculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {
    private final FacultyDao facultyDao;

    @Autowired
    public FacultyService(@Qualifier("postgresFaculty") FacultyDao facultyDao) {
        this.facultyDao = facultyDao;
    }

    public List<Faculty> getAllFaculty(){
        return facultyDao.getAllFaculty();
    }

    public int addFaculty(Faculty faculty){
        return facultyDao.addFaculty(faculty);
    }

}
