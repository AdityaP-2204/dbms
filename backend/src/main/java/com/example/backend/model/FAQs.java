package com.example.backend.model;


import java.util.UUID;

public class FAQs {
    private final UUID   id;
    private final String Question;
    private final String Answer;

    public FAQs(UUID id, String Question, String Answer) {
        this.id = id;
        this.Question = Question;
        this.Answer = Answer;
    }

    public UUID getId() { return id; }
    public String getQuestion() { return Question; }
    public String getAnswer() { return Answer; }

}
