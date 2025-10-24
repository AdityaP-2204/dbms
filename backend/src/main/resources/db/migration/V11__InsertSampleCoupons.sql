-- Sample coupons for testing
INSERT INTO coupon (discount_percentage, max_discount, coupon_code, start_date, end_date, limit_count, min_value) 
VALUES 
    (10, 500, 'WELCOME10', '2024-01-01 00:00:00', '2025-12-31 23:59:59', 100, 500),
    (20, 1000, 'SAVE20', '2024-01-01 00:00:00', '2025-12-31 23:59:59', 50, 1000),
    (15, 750, 'SPECIAL15', '2024-01-01 00:00:00', '2025-12-31 23:59:59', 75, 750),
    (25, 2000, 'MEGA25', '2024-01-01 00:00:00', '2025-12-31 23:59:59', 25, 2000),
    (5, 200, 'FIRST5', '2024-01-01 00:00:00', '2025-12-31 23:59:59', 200, 300);
