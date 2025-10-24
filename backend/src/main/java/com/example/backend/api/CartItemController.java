package com.example.backend.api;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.CartItem;
import com.example.backend.service.CartService;

@RequestMapping("/api/cart")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})

public class CartItemController {
    private final CartService cartService;
    @Autowired
    public CartItemController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public void addCartItem(@RequestBody CartItem cartItem) {
        cartService.addCartItem(cartItem);
        return;
    }
    @GetMapping(params = "userId")
    public List<CartItem> getCartItemsByUserId(@RequestParam UUID userId) {
        return cartService.getAllCartItemsByUserId(userId);
    }
    @GetMapping(params = {"userId", "variantId"})
    public CartItem getCartItemByUserAndVariant(@RequestParam UUID userId, @RequestParam UUID variantId) {
        return cartService.getCartItemByUserAndVariant(userId, variantId);
    }
    @PutMapping(params = {"id", "quantity"})
    public void updateCartItemQuantityById(@RequestParam UUID id, @RequestParam int quantity) {
        cartService.updateCartItemQuantityById(id, quantity);
        return;
    }
    @DeleteMapping(params = "id")
    public void deleteCartItemById(@RequestParam UUID id) {
        cartService.deleteCartItem(id);
        return;
    }
}
