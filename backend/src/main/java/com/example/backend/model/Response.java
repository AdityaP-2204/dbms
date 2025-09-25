package com.example.backend.model;

import java.sql.Timestamp;
import java.util.UUID;

public class Response {
    private UUID id;
    private String message;
    private Timestamp sentAt;
    private UUID userId;
    private UUID queryId;

    public Response() {}

    public Response(UUID id, String message, Timestamp sentAt, UUID userId, UUID queryId) {
        this.id = id;
        this.message = message;
        this.sentAt = sentAt;
        this.userId = userId;
        this.queryId = queryId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Timestamp getSentAt() {
        return sentAt;
    }

    public void setSentAt(Timestamp sentAt) {
        this.sentAt = sentAt;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getQueryId() {
        return queryId;
    }

    public void setQueryId(UUID queryId) {
        this.queryId = queryId;
    }
}
