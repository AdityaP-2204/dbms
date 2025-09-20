package com.example.backend.dao;

import com.example.backend.model.ProductSubject;
import com.example.backend.model.Subject;

import java.util.List;
import java.util.UUID;

public interface ProductSubjectDao {
     int insertProductSubject(ProductSubject productSubject);
     List<ProductSubject> getAllProductSubject();
     List<Subject> getAllProductSubjectByProductId(UUID product_id);
}
