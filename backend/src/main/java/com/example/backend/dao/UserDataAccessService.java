package com.example.backend.dao;

import com.example.backend.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgres")
public class UserDataAccessService implements UserDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int insertUser(UUID id, User user) {
        final String sql = "INSERT INTO users (id, name, email, password, role, phone_number, address) VALUES (?,?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getPhone_number(),
                user.getAddress()
        );
    }

    @Override
    public List<User> getAllUsers() {
        final String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, (rs, i) -> new User(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("role"),
                rs.getString("phone_number"),
                rs.getString("address")
        ));
    }

    @Override
    public User getUserByEmailPassword(String email, String password) {
        final String sql = "SELECT * FROM users WHERE email=? AND password=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{email, password}, (rs, i) -> new User(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("role"),
                rs.getString("phone_number"),
                rs.getString("address")
        ));
    }

    @Override
    public User getUserById(UUID id) {
        final String sql = "SELECT * FROM users WHERE id=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, i) -> new User(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("role"),
                rs.getString("phone_number"),
                rs.getString("address")
        ));
    }

    @Override
    public int updateUser(UUID id, String name, String email, String phone_number, String address) {
        final String sql = "UPDATE users SET name=?, email=?, phone_number=?, address=? WHERE id=?";
        return jdbcTemplate.update(sql, name, email, phone_number, address, id);
    }

    @Override
    public int deleteUser(UUID id) {
        final String sql = "DELETE FROM users WHERE id=?";
        return jdbcTemplate.update(sql, id);
    }

    @Override
    public User getUserByEmail(String email) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT * FROM users WHERE email=?",
                    new Object[]{email},
                    (rs, rowNum) -> new User(
                            UUID.fromString(rs.getString("id")),
                            rs.getString("name"),
                            rs.getString("email"),
                            rs.getString("password"),
                            rs.getString("role"),
                            rs.getString("phone_number"),
                            rs.getString("address")
                    )
            );
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null; // no user found
        }
    }
}
