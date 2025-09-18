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
    public UserDataAccessService(JdbcTemplate JDBCTemplate) {
        this.jdbcTemplate = JDBCTemplate;
    }

    @Override
    public int insertUser(UUID id, User user) {
        final String sql="INSERT INTO users (id,name,email,password,role,phoneNumber,address) VALUES (?,?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,id,user.getName(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getRole(),
                        user.getPhoneNumber(),
                        user.getAddress());
    }

    @Override
    public List<User> getAllUsers() {
         final String sql="SELECT id,name,email,password,role,phoneNumber,address FROM users";
         return jdbcTemplate.query(sql, (resultSet,i)->{
             UUID id=UUID.fromString(resultSet.getString("id"));
             String name=resultSet.getString("name");
             String email=resultSet.getString("email");
             String password=resultSet.getString("password");
             String role=resultSet.getString("role");
             String phoneNumber=resultSet.getString("phoneNumber");
             String address=resultSet.getString("address");
             return new User(id,name,email,password,role,phoneNumber,address);
         });
    }

    @Override
    public User getUserByEmailPassword(String email, String password) {
        final String sql = "SELECT id, name, email, password, role, phoneNumber, address FROM users WHERE email = ? AND password = ?";

        return jdbcTemplate.queryForObject(
                sql,
                new Object[]{email, password},  // pass parameters here ✅
                (resultSet, i) -> {
                    UUID id = UUID.fromString(resultSet.getString("id"));
                    String name = resultSet.getString("name");
                    String email1 = resultSet.getString("email");
                    String password1 = resultSet.getString("password");
                    String role = resultSet.getString("role");
                    String phoneNumber = resultSet.getString("phoneNumber"); // ✅ works now
                    String address = resultSet.getString("address");
                    return new User(id, name, email1, password1, role, phoneNumber, address);
                }
        );
    }

    @Override
    public User getUserById(UUID id) {
        final String sql="SELECT id, name, email, password, role, phoneNumber, address FROM users WHERE id = ? ";
        return jdbcTemplate.queryForObject(
                sql,
                new Object[]{id},  // pass the parameter
                (resultSet, i) -> {
                    UUID id1 = UUID.fromString(resultSet.getString("id"));
                    String name1 = resultSet.getString("name");
                    String email1 = resultSet.getString("email");
                    String password1 = resultSet.getString("password");
                    String role = resultSet.getString("role");
                    String phoneNumber = resultSet.getString("phoneNumber");
                    String address = resultSet.getString("address");
                    return new User(id1, name1, email1, password1, role, phoneNumber, address);
                }
        );
    }


    @Override
    public int updateUser(UUID id, String name, String email, String address, String phoneNumber) {
        final String sql = "UPDATE users SET name = ?, email = ?, phoneNumber = ?, address = ? WHERE id = ?";
        return jdbcTemplate.update(
                sql,
                name,
                email,
                phoneNumber,
                address,
                id
        );
    }



    @Override
    public int deleteUser(UUID id) {
        final String sql="DELETE FROM users WHERE id=? ";
        return jdbcTemplate.update(sql,id);
    }
}
