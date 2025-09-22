package com.example.backend.api;

import com.example.backend.model.JoinedProduct;
import com.example.backend.service.JoinedProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/joinedProduct")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class JoinedProductController {

    private final JoinedProductService joinedProductService;
    @Autowired
    public JoinedProductController(JoinedProductService joinedProductService) {
        this.joinedProductService = joinedProductService;
    }

    @GetMapping
    public List<JoinedProduct> getJoinedProducts() {
        return joinedProductService.getJoinedProducts();
    }

    @GetMapping(params = "id")
    public JoinedProduct getJoinedProduct(UUID id) {
        return joinedProductService.getJoinedProduct(id);
    }
}
