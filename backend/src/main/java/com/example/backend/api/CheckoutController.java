package com.example.backend.api;

import com.example.backend.model.CheckoutRequest;
import com.example.backend.model.Product;
import com.example.backend.model.Variant;
import com.example.backend.service.EmailService;
import com.example.backend.dao.ProductDao;
import com.example.backend.dao.VariantDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST})
public class CheckoutController {

    private final EmailService emailService;
    private final VariantDao variantDao;
    private final ProductDao productDao;

    @Autowired
    public CheckoutController(EmailService emailService, VariantDao variantDao, ProductDao productDao) {
        this.emailService = emailService;
        this.variantDao = variantDao;
        this.productDao = productDao;
    }

    @PostMapping
    public String checkout(@RequestBody CheckoutRequest request) {
        // 🧾 Build the email body
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("🛍️ New Order Received!\n\n");
        emailBody.append("👤 User ID: ").append(request.getUserId()).append("\n");
        emailBody.append("Name: ").append(request.getName()).append("\n");
        emailBody.append("Email: ").append(request.getEmail()).append("\n");
        emailBody.append("💰 Total Amount: ₹").append(request.getTotalAmount()).append("\n");
        emailBody.append("🎟️ Discount: ₹").append(request.getDiscount()).append("\n");
        emailBody.append("🏷️ Coupon: ").append(request.getCouponCode() != null ? request.getCouponCode() : "None").append("\n\n");
        emailBody.append("🧾 Ordered Items:\n");

        // 🔍 Loop through each cart item and fetch details
        for (CheckoutRequest.CartItem item : request.getCartItems()) {
            try {
                Variant variant = variantDao.getVariantById(item.getVariant_id());
                if (variant == null) {
                    emailBody.append("- ❌ Variant not found for ID: ").append(item.getVariant_id()).append("\n\n");
                    continue;
                }

                Product product = productDao.getProductById(variant.getProduct_id());
                if (product == null) {
                    emailBody.append("- ❌ Product not found for variant ID: ").append(item.getVariant_id()).append("\n\n");
                    continue;
                }

                emailBody.append("- 🧩 Product: ").append(product.getProduct_title())
                        .append("\n   • Variant ID: ").append(item.getVariant_id())
                        .append("\n   • Attempt: ").append(variant.getAttempt() != null ? variant.getAttempt() : "N/A")
                        .append("\n   • Validity: ").append(variant.getValidity() != null ? variant.getValidity() : "N/A")
                        .append("\n   • Quantity: ").append(item.getQuantity())
                        .append("\n   • Price per unit: ₹").append(variant.getPrice())
                        .append("\n\n");

            } catch (Exception e) {
                emailBody.append("- ⚠️ Error fetching details for variant ID: ").append(item.getVariant_id())
                        .append("\n   • Error: ").append(e.getMessage()).append("\n\n");
            }
        }

        // 📧 Send the email to admin
        emailService.sendOrderEmail(
                "jamwalmansi16@gmail.com",  // change to your admin email
                "🛒 New Order Received",
                emailBody.toString()
        );

        return "✅ Checkout email sent to admin successfully.";
    }
}
