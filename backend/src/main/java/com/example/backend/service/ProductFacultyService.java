package com.example.backend.service;

import com.example.backend.dao.ProductFacultyDao;
import com.example.backend.model.Faculty;
import com.example.backend.model.ProductFaculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class ProductFacultyService {
    private final ProductFacultyDao productFacultyDao;

    @Autowired
    public ProductFacultyService(@Qualifier("postgresProductFaculty") ProductFacultyDao productFacultyDao) {
        this.productFacultyDao = productFacultyDao;
    }

    public int addProductFaculty(ProductFaculty productFaculty) {
        return productFacultyDao.addProductFaculty(productFaculty);
    }

    public List<ProductFaculty> getProductFaculty() {
        return  productFacultyDao.getAllProductFaculty();
    }

    public List<Faculty> getAllProductFacultyByProductId(UUID productId) {
        return productFacultyDao.getAllFacultyByProductId(productId);
    }

}
