package com.example.backend.service;

import com.example.backend.dao.ProductDao;
import com.example.backend.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductDao productDao;

    @Autowired
    public ProductService(@Qualifier("postgresProduct") ProductDao productDao) {
        this.productDao = productDao;
    }

    public int addProduct(Product product) {
        return productDao.addProduct(product);
    }

    public Product getProductById(UUID id) {
        return productDao.getProductById(id);
    }
    public List<Product> getAllProducts() {
        return productDao.getAllProducts();
    }
    public void deleteProduct(UUID id) {
        productDao.deleteProduct(id);
    }

}
