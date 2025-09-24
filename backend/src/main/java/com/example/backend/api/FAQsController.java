package com.example.backend.api;

import com.example.backend.model.FAQs;
import com.example.backend.service.FAQsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/FAQs")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class FAQsController {
    private final FAQsService FAQService;
    @Autowired
    public FAQsController(FAQsService FAQService) {
        this.FAQService = FAQService;
    }
    @PostMapping
    public int addFAQs(@RequestBody FAQs FAQ){
        return FAQService.addFAQs(FAQ);
    }

    @GetMapping
    public List<FAQs> getAllFAQs(){
        return FAQService.getAllFAQs();
    }
}