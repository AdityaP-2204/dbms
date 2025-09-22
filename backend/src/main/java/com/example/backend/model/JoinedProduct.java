package com.example.backend.model;

import java.util.*;

public class JoinedProduct {
    private UUID id;
    private String title;
    private String description;
    private String course_name;
    private String course_description;
    private String product_type;
    private String product_image;
    private boolean is_combo;

    private double rating = 4.5;
    private int total_reviews = 2;

    private List<Variant> variants;
    private List<String> subjects;
    private List<Faculty> faculties;

    private List<Map<String, Object>> reviews = Arrays.asList(
            new HashMap<>() {{ put("reviewer", "Alice"); put("rating", 5.0); put("comment", "Excellent course!"); }},
            new HashMap<>() {{ put("reviewer", "Bob"); put("rating", 4.0); put("comment", "Good explanations, learned a lot."); }}
    );

    public JoinedProduct(UUID id, String title, String description, String course_name,
                         String course_description, String product_type, String product_image,
                         boolean is_combo, List<Variant> variants, List<String> subjects,
                         List<Faculty> faculties) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.course_name = course_name;
        this.course_description = course_description;
        this.product_type = product_type;
        this.product_image = product_image;
        this.is_combo = is_combo;
        this.variants = variants;
        this.subjects = subjects;
        this.faculties = faculties;
    }

    // Getters
    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCourse_name() { return course_name; }
    public String getCourse_description() { return course_description; }
    public String getProduct_type() { return product_type; }
    public String getProduct_image() { return product_image; }
    public boolean isIs_combo() { return is_combo; }
    public double getRating() { return rating; }
    public int getTotal_reviews() { return total_reviews; }
    public List<Variant> getVariants() { return variants; }
    public List<String> getSubjects() { return subjects; }
    public List<Faculty> getFaculties() { return faculties; }
    public List<Map<String, Object>> getReviews() { return reviews; }
}
