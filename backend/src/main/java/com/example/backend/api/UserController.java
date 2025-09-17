package com.example.backend.api;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/user")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class UserController {
    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public void addUser(@RequestBody User user) {
         userService.addUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping(params={"email","password"})
    public User getUserByEmailAndPassword(@RequestParam String email, @RequestParam String password) {
        return userService.getUserByEmailPassword(email,password);
    }
    @PutMapping(params="id")
    public int updateUser(@RequestParam UUID id, @RequestBody User user) {
        return userService.updateUser(id,user);
    }

    @DeleteMapping(params="id")
    public void deleteUser(@RequestParam UUID id) {
        userService.deleteUser(id);
    }

}
