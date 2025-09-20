package com.example.backend.dao;

import com.example.backend.model.Variant;

import java.util.List;
import java.util.UUID;

public interface VariantDao {
    int addVariant(UUID id, Variant variant);

    default int addVariant(Variant variant){
        UUID id = UUID.randomUUID();
        return addVariant(id, variant);
    }

    List<Variant> getAllVariants();
    List<Variant> getAllVariantsByProductId(UUID productId);

}
