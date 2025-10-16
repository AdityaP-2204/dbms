package com.example.backend.model;

import java.sql.Timestamp;

public class Coupon {
    private final Integer coupon_id;
    private final Integer discount_percentage;
    private final Integer max_discount;
    private final String coupon_code;
    private final Timestamp start_date;
    private final Timestamp end_date;
    private final Integer limit_count;
    private final Integer min_value;

    public Coupon(Integer coupon_id, Integer discount_percentage, Integer max_discount,
                  String coupon_code, Timestamp start_date, Timestamp end_date,
                  Integer limit_count, Integer min_value) {
        this.coupon_id = coupon_id;
        this.discount_percentage = discount_percentage;
        this.max_discount = max_discount;
        this.coupon_code = coupon_code;
        this.start_date = start_date;
        this.end_date = end_date;
        this.limit_count = limit_count;
        this.min_value = min_value;
    }

    public Integer getCoupon_id() {
        return coupon_id;
    }

    public Integer getDiscount_percentage() {
        return discount_percentage;
    }

    public Integer getMax_discount() {
        return max_discount;
    }

    public String getCoupon_code() {
        return coupon_code;
    }

    public Timestamp getStart_date() {
        return start_date;
    }

    public Timestamp getEnd_date() {
        return end_date;
    }

    public Integer getLimit_count() {
        return limit_count;
    }

    public Integer getMin_value() {
        return min_value;
    }
}
