package com.example.backend.service;

import com.example.backend.dao.QueryDao;
import com.example.backend.model.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class QueryService {

    private final QueryDao queryDao;

    public QueryService(QueryDao queryDao) {
        this.queryDao = queryDao;
    }

    public void createQuery(Query query) {
        // query.setId(UUID.randomUUID()); // generate new UUID
        // query.setCreatedAt(LocalDateTime.now()); // set current time
        queryDao.insertQuery(query);
    }

    public Query getQuery(UUID id) {
        return queryDao.getQueryById(id);
    }

    public List<Query> getAllQueries() {
        return queryDao.getAllQueries();
    }

    public void deleteQuery(UUID id) {
        queryDao.deleteQuery(id);
    }
}
