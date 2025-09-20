package com.example.backend.api;

import com.example.backend.model.Subject;
import com.example.backend.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/subject")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class SubjectController {
    private final SubjectService subjectService;
    @Autowired
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public int addSubject(@RequestBody Subject subject){
        return subjectService.addSubject(subject);
    };
    @GetMapping
    public List<Subject> getAllSubjects(){
        return subjectService.getAllSubjects();
    }
    @GetMapping(params="id")
    public Subject getSubject(UUID id){
        return subjectService.getSubjectById(id);
    }
    @DeleteMapping
    public void deleteSubject(UUID id){
        subjectService.deleteSubject(id);
    }
}
