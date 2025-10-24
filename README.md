## API Endpoints

### Validate Coupon (Primary Endpoint)
http
POST /api/v1/coupon/validate?code={couponCode}&cartTotal={amount}

*Parameters:*
- code (String) - Coupon code to validate
- cartTotal (Double) - Current cart total amount

*Response:*
json
{
  "valid": true,
  "message": "Coupon applied successfully!",
  "discountAmount": 200.0,
  "finalPrice": 1800.0
}

**Base URL** - http://localhost:8080/api/v1/review
---
### Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/` | Create a new review for a product |
| GET    | `/` | Retrieve all reviews (newest first) |
| GET    | `/?product_id={uuid}` | Get all reviews for a specific product |
| GET    | `/?user_id={uuid}` | Get all reviews by a specific user |
| GET    | `/?review_id={id}` | Get a single review by its ID |
| PUT    | `/?review_id={id}` | Update the comment of an existing review |
| DELETE | `/?review_id={id}` | Delete a review by its ID |
