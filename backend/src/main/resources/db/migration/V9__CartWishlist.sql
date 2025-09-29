CREATE TABLE wishlist_item(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    variant_id UUID REFERENCES variant(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_item(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    variant_id UUID REFERENCES variant(id),
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
