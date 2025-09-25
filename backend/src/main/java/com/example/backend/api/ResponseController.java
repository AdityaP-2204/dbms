package com.example.backend.api;

import com.example.backend.model.Response;
import com.example.backend.service.ResponseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/responses")
public class ResponseController {

    private final ResponseService responseService;

    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    @PostMapping
    public void addResponse(@RequestBody Response response) {
        responseService.addResponse(response);
    }

    @GetMapping
    public List<Response> getAllResponses() {
        return responseService.getAllResponses();
    }

    @GetMapping(path = "{id}")
    public Response getResponseById(@PathVariable("id") UUID id) {
        return responseService.getResponseById(id);
    }

    @DeleteMapping(path = "{id}")
    public void deleteResponse(@PathVariable("id") UUID id) {
        responseService.deleteResponse(id);
    }

    @PutMapping(path = "{id}")
    public void updateResponse(@PathVariable("id") UUID id, @RequestBody Response response) {
        responseService.updateResponse(id, response);
    }
}
