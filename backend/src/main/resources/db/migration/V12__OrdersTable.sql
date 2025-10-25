CREATE TABLE orders_item (
    order_item_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    variant_id UUID NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (variant_id) REFERENCES variant(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);
