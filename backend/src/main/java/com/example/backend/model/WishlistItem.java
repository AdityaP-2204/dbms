package com.example.backend.model;

import java.sql.Timestamp;
import java.util.UUID;

public class WishlistItem {
    private final UUID id;
    private final UUID user_id;
    private final UUID variant_id;
    private final Timestamp added_at;

    public WishlistItem(UUID id, UUID user_id, UUID variant_id,
                        Timestamp added_at) {
        this.id = id;
        this.user_id = user_id;
        this.variant_id = variant_id;
        this.added_at = added_at;
    }

    public UUID getId() { return id; }
    public UUID getUser_id() { return user_id; }
    public UUID getVariant_id() { return variant_id; }
    public Timestamp getAdded_at() { return added_at; }
}
