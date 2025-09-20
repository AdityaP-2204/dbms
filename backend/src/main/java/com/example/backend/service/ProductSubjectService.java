package com.example.backend.service;

import com.example.backend.dao.ProductSubjectDao;
import com.example.backend.model.ProductSubject;
import com.example.backend.model.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductSubjectService {
    private final ProductSubjectDao productSubjectDao;

    @Autowired
    public ProductSubjectService(@Qualifier("postgresProductSubject") ProductSubjectDao productSubjectDao) {
        this.productSubjectDao = productSubjectDao;
    }

    public int addProductSubject(ProductSubject productSubject) {
        return productSubjectDao.insertProductSubject(productSubject);
    }

    public List<ProductSubject> findAllProductSubject() {
        return productSubjectDao.getAllProductSubject();
    }

    public List<Subject> getAllSubjectsofProduct(UUID productId) {
        return productSubjectDao.getAllProductSubjectByProductId(productId);
    }


}
