package com.example.backend.dao;

import com.example.backend.model.Coupon;

import java.util.List;
import java.util.Optional;

public interface CouponDao {
    int insertCoupon(Coupon coupon);
    
    List<Coupon> getAllCoupons();
    
    Optional<Coupon> getCouponById(Integer coupon_id);
    
    Optional<Coupon> getCouponByCode(String coupon_code);
    
    int updateCoupon(Integer coupon_id, Coupon coupon);
    
    int deleteCouponById(Integer coupon_id);
}
