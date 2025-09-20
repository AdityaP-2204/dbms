package com.example.backend.dao;

import com.example.backend.model.Variant;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresVariant")
public class VariantDataAccessService implements VariantDao{
    private final JdbcTemplate jdbcTemplate;
    @Autowired
    public VariantDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    @Override
    public int addVariant(UUID id, Variant variant) {
        final String sql="INSERT INTO variant (id,attempt,price,VariantImage,deliveryMode,availability,validity,ProductId) VALUES (?,?,?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,id,variant.getAttempt(),variant.getPrice(),variant.getVariantImage(),variant.getDeliveryMode(),variant.getAvailability(),variant.getValidity(),variant.getProductId());
    }

    @Override
    public List<Variant> getAllVariants() {
       final String sql="SELECT * FROM variant";
       return jdbcTemplate.query(sql,(resultSet,i)->{
           UUID id=UUID.fromString(resultSet.getString("id"));
           String attempt=resultSet.getString("attempt");
           Number price=resultSet.getInt("price");
           String VariantImage=resultSet.getString("VariantImage");
           String deliveryMode=resultSet.getString("deliveryMode");
           Boolean availability=resultSet.getBoolean("availability");
           String validity=resultSet.getString("validity");
           UUID ProductId=UUID.fromString(resultSet.getString("ProductId"));
           return new Variant(id, attempt,price,VariantImage,deliveryMode,availability,validity,ProductId);
       });
    }

    @Override
    public List<Variant> getAllVariantsByProductId(UUID productId) {
        final String sql="SELECT * FROM variant WHERE ProductId=?";
        return jdbcTemplate.query(sql, new Object[]{productId},(resultSet,i)->{
            UUID id=UUID.fromString(resultSet.getString("id"));
            String attempt=resultSet.getString("attempt");
            Number price=resultSet.getInt("price");
            String VariantImage=resultSet.getString("VariantImage");
            String deliveryMode=resultSet.getString("deliveryMode");
            Boolean availability=resultSet.getBoolean("availability");
            String validity=resultSet.getString("validity");
            return new Variant(id,attempt,price,VariantImage,deliveryMode,availability,validity,productId);
        });
    }
}
