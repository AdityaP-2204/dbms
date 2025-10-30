package com.example.backend.api;

import com.example.backend.model.Response;
import com.example.backend.service.ResponseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ResponseController {

    private final ResponseService responseService;

    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    @PostMapping
    public List<Response> addResponse(@RequestBody Response response) {
        responseService.addResponse(response);
        return responseService.getResponseByQueryId(response.getQueryId());
    }

//    @GetMapping
//    public List<Response> getAllResponses() {
//        List<Response> responses = responseService.getAllResponses();
//        System.out.println("Inside get all responses: " + responses);
//        return responses;
//    }

//    @GetMapping(path = "id")
//    public Response getResponseById(@PathVariable("id") UUID id) {
//        return responseService.getResponseById(id);
//    }

    @GetMapping
    public List<Response> getResponseByQueryId(@RequestParam("queryId") UUID queryId) {

        List<Response> responses = responseService.getResponseByQueryId(queryId);
        System.out.println("Inside getResponseByQueryId: " + responses);
        return responses;
    }


    @DeleteMapping(path = "id")
    public void deleteResponse(@PathVariable("id") UUID id) {
        responseService.deleteResponse(id);
    }

    @PutMapping(path = "id")
    public void updateResponse(@PathVariable("id") UUID id, @RequestBody Response response) {
        responseService.updateResponse(id, response);
    }
}
