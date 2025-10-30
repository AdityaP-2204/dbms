package com.example.backend.service;

import com.example.backend.dao.VariantDao;
import com.example.backend.model.Variant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VariantService {
    private final VariantDao variantDao;
    @Autowired
    public VariantService(@Qualifier("postgresVariant") VariantDao variantDao) {
        this.variantDao=variantDao;
    }
    public List<Variant> getAllVariantsByProductId(UUID productId) {
        return variantDao.getAllVariantsByProductId(productId);
    }
    public Variant getVariantById(UUID id) {
        return variantDao.getVariantById(id);
    }
    public List<Variant> getAllVariants() {
        return variantDao.getAllVariants();
    }
    public int addVariant(Variant variant) {
        return variantDao.addVariant(variant);
    }

}
