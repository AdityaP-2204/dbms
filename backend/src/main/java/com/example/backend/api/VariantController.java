package com.example.backend.api;

import com.example.backend.model.Variant;
import com.example.backend.service.VariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/variant")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class VariantController {
    private final VariantService variantService;

    @Autowired
    public VariantController(VariantService variantService) {
        this.variantService = variantService;
    }

    @PostMapping
    public int addVariant(@RequestBody Variant variant){
        return variantService.addVariant(variant);
    }

    @GetMapping
    public List<Variant> getAllVariants(){
        return variantService.getAllVariants();
    }

    @GetMapping(params = "id")
    public Variant getVariantById(@RequestParam UUID id){
        return variantService.getVariantById(id);
    }

    @GetMapping(params="productId")
    public List<Variant> getAllVariantsByProductId(@RequestParam UUID productId){
        return variantService.getAllVariantsByProductId(productId);
    }

}
