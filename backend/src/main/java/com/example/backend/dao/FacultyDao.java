package com.example.backend.dao;

import com.example.backend.model.Faculty;

import java.util.List;
import java.util.UUID;

public interface FacultyDao {
    int addFaculty(UUID id, Faculty faculty);

    default int addFaculty(Faculty faculty) {
        UUID id = UUID.randomUUID();
        return addFaculty(id, faculty);
    }

    List<Faculty> getAllFaculty();
}
