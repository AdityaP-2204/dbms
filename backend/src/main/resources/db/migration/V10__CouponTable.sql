CREATE TABLE coupon (
    coupon_id SERIAL PRIMARY KEY,
    discount_percentage INTEGER,
    max_discount INTEGER NOT NULL,
    coupon_code VARCHAR(20) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    limit_count INTEGER NOT NULL,
    min_value INTEGER NOT NULL
);
