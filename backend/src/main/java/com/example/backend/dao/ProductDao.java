package com.example.backend.dao;

import com.example.backend.model.Product;

import java.util.List;
import java.util.UUID;

public interface ProductDao {
    int addProduct(UUID id, Product product);
    default int addProduct(Product product){
        UUID id = UUID.randomUUID();
        return addProduct(id, product);
    }
    List<Product> getAllProducts();
    Product getProductById(UUID id);
    void deleteProduct(UUID id);
}
