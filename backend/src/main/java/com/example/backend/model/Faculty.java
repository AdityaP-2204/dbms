package com.example.backend.model;

import java.util.UUID;

public class Faculty {
     private final UUID id;
     private final String name;
     private final String description;
     private final String email;
    private String ProfileImage;;
     private final String InstituteName;

     public Faculty(UUID id, String name, String description, String email, String InstituteName, String ProfileImage) {
         this.id = id;
         this.name = name;
         this.description = description;
         this.email = email;
         this.InstituteName = InstituteName;
         this.ProfileImage = ProfileImage;
     }
     public UUID getId() {
         return id;
     }
     public String getName() {
         return name;
     }
     public String getDescription() {
         return description;
     }
     public String getEmail() {
         return email;
     }
     public String getInstituteName() {
         return InstituteName;
     }
     public String getProfileImage() {
         return ProfileImage;
     }

}
