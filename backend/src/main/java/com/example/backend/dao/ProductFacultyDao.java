package com.example.backend.dao;

import com.example.backend.model.Faculty;
import com.example.backend.model.ProductFaculty;

import java.util.List;
import java.util.UUID;


public interface ProductFacultyDao {
    int addProductFaculty(ProductFaculty productFaculty);
    List<ProductFaculty> getAllProductFaculty();
    List<Faculty>getAllFacultyByProductId(UUID productId);
}
