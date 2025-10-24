package com.example.backend.api;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.WishlistItem;
import com.example.backend.service.WishlistService;

@RequestMapping("/api/wishlist")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})

public class WishlistItemController {
    private final WishlistService wishlistService;
    @Autowired
    public WishlistItemController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public void addWishlistItem(@RequestBody WishlistItem wishlistItem) {
        wishlistService.addWishlistItem(wishlistItem);
        return;
    }
    @GetMapping(params = "userId")
    public List<WishlistItem> getWishlistItemsByUserId(@RequestParam UUID userId) {
        return wishlistService.getWishlistItemsByUserId(userId);
    }
    @GetMapping(params = {"userId", "variantId"})
    public WishlistItem getWishlistItemByUserAndVariant(@RequestParam UUID userId, @RequestParam UUID variantId) {
        return wishlistService.getWishlistItemByUserAndVariant(userId, variantId);
    }
    @DeleteMapping(params = "id")
    public void deleteWishlistItemById(@RequestParam UUID id) {
        wishlistService.deleteWishlistItemById(id);
        return;
    }
}
