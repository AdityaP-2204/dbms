CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    comment VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);