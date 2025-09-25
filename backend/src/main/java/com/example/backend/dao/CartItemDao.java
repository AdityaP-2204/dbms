package com.example.backend.dao;

import com.example.backend.model.CartItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemDao {
    int insertCartItem(UUID id, CartItem cartItem);
    default int insertCartItem(CartItem cartItem){
        UUID id = UUID.randomUUID();
        return insertCartItem(id, cartItem);
    }
    List<CartItem> getAllCartItemsByUserId(UUID user_id);
    Optional<CartItem> getCartItemByUserAndVariant(UUID user_id, UUID variant_id);

    int updateCartItemQuantityById(UUID id, int quant);
    int deleteCartItemById(UUID id);
}
