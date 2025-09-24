package com.example.backend.dao;

import com.example.backend.model.FAQs;

import java.util.List;
import java.util.UUID;

public interface FAQsDao {
    int addFAQs(UUID id, FAQs FAQ);

    default int addFAQs(FAQs FAQ) {
        UUID id = UUID.randomUUID();
        return addFAQs(id, FAQ);
    }

    List<FAQs> getAllFAQs();
}
