package com.example.backend.dao;

import com.example.backend.model.Response;

import java.util.List;
import java.util.UUID;

public interface ResponseDao {
    int insertResponse(UUID uuid,Response response);

    default int insertResponse(Response response){
        UUID uuid = UUID.randomUUID();
        return insertResponse(uuid,response);
    };

    List<Response> selectAllResponses();

    List<Response> selectAllResponsesByQueryId(UUID id);

    Response selectResponseById(UUID id);

    int deleteResponse(UUID id);

    int updateResponse(UUID id, Response response);
}
