package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Query {

    private UUID id;
    private String subject;
    private String message;
    private LocalDateTime createdAt;
    private UUID userId; // foreign key to User

    public Query() {}

    public Query(UUID id, String subject, String message, LocalDateTime createdAt, UUID userId) {
        this.id = id;
        this.subject = subject;
        this.message = message;
        this.createdAt = createdAt;
        this.userId = userId;
    }

    // Getters and Setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}
