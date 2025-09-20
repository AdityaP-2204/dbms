package com.example.backend.api;

import com.example.backend.model.ProductSubject;
import com.example.backend.model.Subject;
import com.example.backend.service.ProductSubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/productSubject")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ProductSubjectController {
    private final ProductSubjectService productSubjectService;

    @Autowired
    public ProductSubjectController(ProductSubjectService productSubjectService) {
        this.productSubjectService = productSubjectService;
    }

    @GetMapping
    public List<ProductSubject> getAllProductSubject() {
        return productSubjectService.findAllProductSubject();
    }

    @GetMapping(params = "id")
    public List<Subject> getSubjectByproductId(UUID id) {
        return productSubjectService.getAllSubjectsofProduct(id);
    }

    @PostMapping
    public int insertProductSubject(@RequestBody ProductSubject productSubject) {
        return productSubjectService.addProductSubject(productSubject);
    }

}
