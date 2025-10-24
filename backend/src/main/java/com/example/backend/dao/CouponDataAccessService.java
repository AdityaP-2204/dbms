package com.example.backend.dao;

import com.example.backend.model.Coupon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("postgresCoupon")
public class CouponDataAccessService implements CouponDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CouponDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Coupon> rowMapper = (rs, i) -> {
        return new Coupon(
                rs.getInt("coupon_id"),
                rs.getInt("discount_percentage"),
                rs.getInt("max_discount"),
                rs.getString("coupon_code"),
                rs.getTimestamp("start_date"),
                rs.getTimestamp("end_date"),
                rs.getInt("limit_count"),
                rs.getInt("min_value")
        );
    };

    @Override
    public int insertCoupon(Coupon coupon) {
        final String sql = "INSERT INTO coupon (discount_percentage, max_discount, coupon_code, " +
                "start_date, end_date, limit_count, min_value) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                coupon.getDiscount_percentage(),
                coupon.getMax_discount(),
                coupon.getCoupon_code(),
                coupon.getStart_date(),
                coupon.getEnd_date(),
                coupon.getLimit_count(),
                coupon.getMin_value()
        );
    }

    @Override
    public List<Coupon> getAllCoupons() {
        final String sql = "SELECT * FROM coupon";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Optional<Coupon> getCouponById(Integer coupon_id) {
        final String sql = "SELECT * FROM coupon WHERE coupon_id = ?";
        try {
            Coupon coupon = jdbcTemplate.queryForObject(sql, rowMapper, coupon_id);
            return Optional.of(coupon);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Coupon> getCouponByCode(String coupon_code) {
        final String sql = "SELECT * FROM coupon WHERE coupon_code = ?";
        try {
            Coupon coupon = jdbcTemplate.queryForObject(sql, rowMapper, coupon_code);
            return Optional.of(coupon);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public int updateCoupon(Integer coupon_id, Coupon coupon) {
        final String sql = "UPDATE coupon SET discount_percentage = ?, max_discount = ?, " +
                "coupon_code = ?, start_date = ?, end_date = ?, limit_count = ?, min_value = ? " +
                "WHERE coupon_id = ?";
        return jdbcTemplate.update(sql,
                coupon.getDiscount_percentage(),
                coupon.getMax_discount(),
                coupon.getCoupon_code(),
                coupon.getStart_date(),
                coupon.getEnd_date(),
                coupon.getLimit_count(),
                coupon.getMin_value(),
                coupon_id
        );
    }

    @Override
    public int deleteCouponById(Integer coupon_id) {
        final String sql = "DELETE FROM coupon WHERE coupon_id = ?";
        return jdbcTemplate.update(sql, coupon_id);
    }
}
