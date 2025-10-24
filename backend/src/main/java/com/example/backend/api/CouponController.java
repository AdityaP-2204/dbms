package com.example.backend.api;

import com.example.backend.model.Coupon;
import com.example.backend.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/api/v1/coupon")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class CouponController {
    private final CouponService couponService;

    @Autowired
    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping
    public int addCoupon(@RequestBody Coupon coupon) {
        return couponService.addCoupon(coupon);
    }

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @GetMapping(params = "id")
    public Optional<Coupon> getCouponById(@RequestParam Integer id) {
        return couponService.getCouponById(id);
    }

    @GetMapping(params = "code")
    public Optional<Coupon> getCouponByCode(@RequestParam String code) {
        return couponService.getCouponByCode(code);
    }

    @PostMapping("/validate")
    public CouponService.CouponValidationResult validateCoupon(
            @RequestParam String code,
            @RequestParam double cartTotal) {
        return couponService.validateAndCalculateDiscount(code, cartTotal);
    }

    @PutMapping(params = "id")
    public int updateCoupon(@RequestParam Integer id, @RequestBody Coupon coupon) {
        return couponService.updateCoupon(id, coupon);
    }

    @DeleteMapping(params = "id")
    public int deleteCoupon(@RequestParam Integer id) {
        return couponService.deleteCoupon(id);
    }
}
