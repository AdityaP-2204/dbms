package com.example.backend.dao;

import com.example.backend.model.CartItem;
import com.example.backend.model.WishlistItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository("postgresWishlistItem")
public class WishlistItemDataAccessService implements WishlistDao{
    private final JdbcTemplate jdbcTemplate;
    @Autowired
    public WishlistItemDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    private final RowMapper<WishlistItem> rowMapper = (rs, i) -> {
        return new WishlistItem(
                UUID.fromString(rs.getString("id")),
                UUID.fromString(rs.getString("user_id")),
                UUID.fromString(rs.getString("variant_id")),
                rs.getTimestamp("added_at")
        );
    };

    @Override
    public int insertWishlistItem(UUID id, WishlistItem wishlistItem) {
        final String sql = "INSERT INTO wishlist_item (id, user_id, variant_id) VALUES (?,?,?,?)";
        return jdbcTemplate.update(sql, id, wishlistItem.getUser_id(), wishlistItem.getVariant_id());
    }

    @Override
    public List<WishlistItem> getAllWishlistItemsByUserId(UUID user_id) {
        final String sql = "SELECT * FROM wishlist_item WHERE user_id=?";
        return jdbcTemplate.query(sql, rowMapper, user_id);
    }

    @Override
    public Optional<WishlistItem> getWishlistItemByUserAndVariant(UUID userId, UUID variantId) {
        final String sql = "SELECT * FROM wishlist_item WHERE user_id=? AND variant_id=?";
        try {
            WishlistItem item = jdbcTemplate.queryForObject(sql, rowMapper, userId, variantId);
            return Optional.of(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public int deleteWishlistItembyId(UUID id) {
        final String sql = "DELETE FROM wishlist_item WHERE id=?";
        return jdbcTemplate.update(sql, id);
    }
}
