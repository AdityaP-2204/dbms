-- CREATE TYPE payment_status AS ENUM ('PENDING','SUCCESSFUL','FAILED');

CREATE TABLE transactions (
  transaction_id UUID PRIMARY KEY , 
  total_amount NUMERIC(15,2) NOT NULL,
  coupon_id UUID, 
  payment_status VARCHAR(100) NOT NULL DEFAULT 'PENDING',
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES users(id)
  
);

