package com.example.backend.model;

import java.util.UUID;

public class Faculty {
    private final UUID id;
    private final String name;
    private final String description;
    private final String email;
    private final String institute_name;
    private final String profile_image;

    public Faculty(UUID id, String name, String description, String email,
                   String institute_name, String profile_image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.email = email;
        this.institute_name = institute_name;
        this.profile_image = profile_image;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getEmail() { return email; }
    public String getInstitute_name() { return institute_name; }
    public String getProfile_image() { return profile_image; }
}
