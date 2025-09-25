package com.example.backend.dao;

import com.example.backend.model.Response;

import java.util.List;
import java.util.UUID;

public interface ResponseDao {
    int insertResponse(Response response);

    List<Response> selectAllResponses();

    Response selectResponseById(UUID id);

    int deleteResponse(UUID id);

    int updateResponse(UUID id, Response response);
}
