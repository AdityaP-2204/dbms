package com.example.backend.service;

import com.example.backend.dao.ResponseDao;
import com.example.backend.model.Response;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ResponseService {
    private final ResponseDao responseDao;

    public ResponseService(ResponseDao responseDao) {
        this.responseDao = responseDao;
    }

    public int addResponse(Response response) {
        response.setId(UUID.randomUUID());
        return responseDao.insertResponse(response);
    }

    public List<Response> getAllResponses() {
        return responseDao.selectAllResponses();
    }

    public List<Response> getResponseByQueryId(UUID queryId) {
        return responseDao.selectAllResponsesByQueryId(queryId);
    }

    public Response getResponseById(UUID id) {
        return responseDao.selectResponseById(id);
    }

    public int deleteResponse(UUID id) {
        return responseDao.deleteResponse(id);
    }

    public int updateResponse(UUID id, Response response) {
        return responseDao.updateResponse(id, response);
    }
}
