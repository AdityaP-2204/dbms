package com.example.backend.model;

import java.util.UUID;

public class User {
    private final UUID id;
    private final String name;
    private final String email;
    private final String password;
    private final String role;
    private final String phone_number;
    private final String address;

    public User(UUID id, String name, String email, String password, String role, String phone_number, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phone_number = phone_number;
        this.address = address;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public String getPhone_number() { return phone_number; }
    public String getAddress() { return address; }
}
