package com.example.backend.service;

import com.example.backend.dao.JoinedProductDao;
import com.example.backend.model.JoinedProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class JoinedProductService {
    private final JoinedProductDao joinedProductDao;
    @Autowired
    public JoinedProductService(@Qualifier("postgresJoinedProduct") JoinedProductDao joinedProductDao) {
        this.joinedProductDao = joinedProductDao;
    }
    public List<JoinedProduct> getJoinedProducts() {
        return joinedProductDao.getJoinedProducts();
    }
    public JoinedProduct getJoinedProduct(UUID id) {
        return joinedProductDao.getJoinedProduct(id);
    }
}
