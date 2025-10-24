package com.example.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.example.backend.dao.CartItemDao;
import com.example.backend.model.CartItem;

@Service
public class CartService {
    private final CartItemDao cartItemDao;
    public CartService(@Qualifier("postgresCartItem") CartItemDao cartItemDao) {
        this.cartItemDao = cartItemDao;
    }
    public int addCartItem(CartItem cartItem){
        return cartItemDao.insertCartItem(cartItem);
    }
    public int updateCartItemQuantityById(UUID id, int quant){
        return cartItemDao.updateCartItemQuantityById(id, quant);
    }
    public int deleteCartItem(UUID id){
        return cartItemDao.deleteCartItemById(id);
    }
    public CartItem getCartItemByUserAndVariant(UUID userId, UUID variantId){
        return cartItemDao.getCartItemByUserAndVariant(userId, variantId).orElse(null);
    }
    public List<CartItem> getAllCartItemsByUserId(UUID user_id){
        return cartItemDao.getAllCartItemsByUserId(user_id);
    }
    
}
