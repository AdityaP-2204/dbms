package com.example.backend.dao;

import com.example.backend.model.WishlistItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistDao {
    int insertWishlistItem(UUID id, WishlistItem wishlistItem);
    default int insertWishlistItem(WishlistItem wishlistItem){
        UUID id = UUID.randomUUID();
        return insertWishlistItem(id, wishlistItem);
    }
    List<WishlistItem> getAllWishlistItemsByUserId(UUID user_id);
    Optional<WishlistItem> getWishlistItemByUserAndVariant(UUID user_id, UUID variant_id);
    int deleteWishlistItembyId(UUID id);
}
