package com.example.backend.dao;

import com.example.backend.model.Query;

import java.util.List;
import java.util.UUID;

public interface QueryDao {
    void insertQuery(UUID id,Query query);

    default void insertQuery(Query query){
        UUID uuid = UUID.randomUUID();
        insertQuery(uuid,query);
    }

    Query getQueryById(UUID id);

    List<Query> getAllQueries();

    void deleteQuery(UUID id);

}