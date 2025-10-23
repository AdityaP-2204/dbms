package com.example.backend.service;

import com.example.backend.dao.UserDao;
import com.example.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserDao userDao;
    @Autowired
    public UserService(@Qualifier("postgres") UserDao userDao) {
        this.userDao = userDao;
    }
    public int addUser(User user) {
        return userDao.insertUser(user);
    }
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }
    public User getUserByEmailPassword(String email, String password) {
        return userDao.getUserByEmailPassword(email,password);
    }
    public int updateUser(UUID id,String name, String email, String phone_number, String address) {
        return userDao.updateUser(id,name,email,phone_number,address);
    }

    public int deleteUser(UUID id) {
        return userDao.deleteUser(id);
    }
    public User getUserById(UUID id) {
        return userDao.getUserById(id);
    }
    public User getUserByEmail(String email) {
        return userDao.getUserByEmail(email);
    }
}
