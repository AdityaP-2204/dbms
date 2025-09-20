package com.example.backend.api;

import com.example.backend.model.Faculty;
import com.example.backend.model.ProductFaculty;
import com.example.backend.service.ProductFacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/productFaculty")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ProductFacultyController {
    private final ProductFacultyService productFacultyService;
    @Autowired
    public ProductFacultyController(ProductFacultyService productFacultyService) {
        this.productFacultyService = productFacultyService;
    }

    @PostMapping
    public int addProductFaculty(@RequestBody ProductFaculty productFaculty){
        return productFacultyService.addProductFaculty(productFaculty);
    }

    @GetMapping
    public List<ProductFaculty> getAllProductFaculty(){
        return productFacultyService.getProductFaculty();
    }

    @GetMapping(params="productId")
    public List<Faculty> getProductFacultyById(@RequestParam UUID productId){
        return productFacultyService.getAllProductFacultyByProductId(productId);
    }

}
