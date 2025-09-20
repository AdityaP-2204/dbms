package com.example.backend.api;

import com.example.backend.model.Faculty;
import com.example.backend.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/faculty")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class FacultyController {
    private final FacultyService facultyService;
    @Autowired
    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }
    @PostMapping
    public int addFaculty(@RequestBody Faculty faculty){
        return facultyService.addFaculty(faculty);
    }

    @GetMapping
    public List<Faculty> getAllFaculty(){
        return facultyService.getAllFaculty();
    }
}
