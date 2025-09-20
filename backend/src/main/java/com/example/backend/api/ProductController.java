package com.example.backend.api;


import com.example.backend.model.Product;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/product")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping(params = "id")
    public Product getProductById(UUID id) {
        return productService.getProductById(id);
    }

    @PostMapping
    public int addProduct(@RequestBody Product product) {
       return productService.addProduct(product);
    }

    @DeleteMapping(params="id")
    public void deleteProduct(@RequestParam UUID id) {
         productService.deleteProduct(id);
    }

}
