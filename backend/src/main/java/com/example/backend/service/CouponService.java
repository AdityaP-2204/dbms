package com.example.backend.service;

import com.example.backend.dao.CouponDao;
import com.example.backend.model.Coupon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class CouponService {
    private final CouponDao couponDao;

    @Autowired
    public CouponService(@Qualifier("postgresCoupon") CouponDao couponDao) {
        this.couponDao = couponDao;
    }

    public int addCoupon(Coupon coupon) {
        return couponDao.insertCoupon(coupon);
    }

    public List<Coupon> getAllCoupons() {
        return couponDao.getAllCoupons();
    }

    public Optional<Coupon> getCouponById(Integer coupon_id) {
        return couponDao.getCouponById(coupon_id);
    }

    public Optional<Coupon> getCouponByCode(String coupon_code) {
        return couponDao.getCouponByCode(coupon_code);
    }

    public int updateCoupon(Integer coupon_id, Coupon coupon) {
        return couponDao.updateCoupon(coupon_id, coupon);
    }

    public int deleteCoupon(Integer coupon_id) {
        return couponDao.deleteCouponById(coupon_id);
    }

    // Validate coupon and calculate discount
    public CouponValidationResult validateAndCalculateDiscount(String coupon_code, double cartTotal) {
        Optional<Coupon> couponOpt = couponDao.getCouponByCode(coupon_code);
        
        if (!couponOpt.isPresent()) {
            return new CouponValidationResult(false, "Invalid coupon code", 0, cartTotal);
        }

        Coupon coupon = couponOpt.get();
        Timestamp now = new Timestamp(System.currentTimeMillis());

        // Check if coupon is within valid date range
        if (now.before(coupon.getStart_date())) {
            return new CouponValidationResult(false, "Coupon is not yet active", 0, cartTotal);
        }

        if (now.after(coupon.getEnd_date())) {
            return new CouponValidationResult(false, "Coupon has expired", 0, cartTotal);
        }

        // Check minimum cart value
        if (cartTotal < coupon.getMin_value()) {
            return new CouponValidationResult(false, 
                "Minimum cart value of ₹" + coupon.getMin_value() + " required", 0, cartTotal);
        }

        // Calculate discount
        double discount = (cartTotal * coupon.getDiscount_percentage()) / 100.0;
        
        // Apply max discount limit
        if (discount > coupon.getMax_discount()) {
            discount = coupon.getMax_discount();
        }

        double finalTotal = cartTotal - discount;

        return new CouponValidationResult(true, "Coupon applied successfully", discount, finalTotal);
    }

    // Inner class for validation result
    public static class CouponValidationResult {
        private boolean valid;
        private String message;
        private double discount;
        private double finalTotal;

        public CouponValidationResult(boolean valid, String message, double discount, double finalTotal) {
            this.valid = valid;
            this.message = message;
            this.discount = discount;
            this.finalTotal = finalTotal;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public double getDiscount() {
            return discount;
        }

        public double getFinalTotal() {
            return finalTotal;
        }
    }
}
