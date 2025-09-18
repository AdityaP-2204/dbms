package com.example.backend.dao;

import com.example.backend.model.User;

import java.util.List;
import java.util.UUID;

public interface UserDao {
    int insertUser(UUID id, User user);

    default int insertUser(User user){
        UUID uuid = UUID.randomUUID();
        return insertUser(uuid,user);
    }

    List<User> getAllUsers();
    User getUserByEmailPassword(String email, String password);
    User getUserById(UUID id);
    int updateUser(UUID id, String name, String email, String address, String phoneNumber);
    int deleteUser(UUID id);
}
