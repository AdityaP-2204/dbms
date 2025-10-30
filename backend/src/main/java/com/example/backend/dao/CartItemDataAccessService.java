package com.example.backend.dao;

import com.example.backend.model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository("postgresCartItem")
public class CartItemDataAccessService implements CartItemDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CartItemDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CartItem> rowMapper = (rs, i) -> {
        return new CartItem(
                UUID.fromString(rs.getString("id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getInt("quantity"),
                rs.getTimestamp("added_at"));
    };

    @Override
    public int insertCartItem(UUID id, CartItem cartItem) {
        final String sql = "INSERT INTO cart_item (id, user_id, variant_id, quantity) VALUES (?,?,?,?)";
        return jdbcTemplate.update(sql, id, cartItem.getUser_id(), cartItem.getVariant_id(), 1);
    }

    @Override
    public List<CartItem> getAllCartItemsByUserId(UUID user_id) {
        final String sql = "SELECT * FROM cart_item WHERE user_id=?";
        return jdbcTemplate.query(sql, rowMapper, user_id);
    }

    @Override
    public Optional<CartItem> getCartItemByUserAndVariant(UUID userId, UUID variantId) {
        final String sql = "SELECT * FROM cart_item WHERE user_id=? AND variant_id=?";
        try {
            CartItem item = jdbcTemplate.queryForObject(sql, rowMapper, userId, variantId);
            return Optional.of(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public int updateCartItemQuantityById(UUID id, int quant) {
        final String sql = "SELECT * FROM cart_item WHERE id=?";
        try {
            CartItem item = jdbcTemplate.queryForObject(sql, rowMapper, id);
            if (item != null) {
                if ((quant + item.getQuantity()) <= 0) {
                    return deleteCartItemById(id);
                } else {
                    final String sql2 = "UPDATE cart_item SET quantity=? WHERE id=?";
                    return jdbcTemplate.update(sql2, item.getQuantity() + quant, id);
                }
            } else
                return 0;
        } catch (EmptyResultDataAccessException e) {
            return 0;
        }
    }

    @Override
    public int deleteCartItemById(UUID id) {
        final String sql = "DELETE FROM cart_item WHERE id=?";
        return jdbcTemplate.update(sql, id);
    }
}
