package com.example.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.example.backend.dao.WishlistDao;
import com.example.backend.model.WishlistItem;

@Service
public class WishlistService {
    private final WishlistDao wishlistDao;
    public WishlistService(@Qualifier("postgresWishlistItem") WishlistDao wishlistDao) {
        this.wishlistDao = wishlistDao;
    }
    public int addWishlistItem(WishlistItem wishlistItem){
        return wishlistDao.insertWishlistItem(wishlistItem);
    }
    public List<WishlistItem> getWishlistItemsByUserId(UUID userId){
        return wishlistDao.getAllWishlistItemsByUserId(userId);
    }
    public int deleteWishlistItemById(UUID id){
        return wishlistDao.deleteWishlistItemById(id);
    }

    public WishlistItem getWishlistItemByUserAndVariant(UUID userId, UUID variantId){
        return wishlistDao.getWishlistItemByUserAndVariant(userId, variantId).orElse(null);
    }
}
