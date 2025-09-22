package com.example.backend.dao;

import com.example.backend.model.JoinedProduct;

import java.util.List;
import java.util.UUID;

public interface JoinedProductDao {
    List<JoinedProduct> getJoinedProducts();
    JoinedProduct getJoinedProduct(UUID id);
}
