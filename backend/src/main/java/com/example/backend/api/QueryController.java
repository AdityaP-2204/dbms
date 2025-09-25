package com.example.backend.api;

import com.example.backend.model.Query;
import com.example.backend.service.QueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/queries")
public class QueryController {

    private final QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping
    public ResponseEntity<Query> createQuery(@RequestBody Query query) {
        if (query.getUserId() == null || query.getSubject() == null || query.getMessage() == null) {
            return ResponseEntity.badRequest().build();
        }
        Query created = queryService.createQuery(query);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Query> getQuery(@PathVariable UUID id) {
        Query query = queryService.getQuery(id);
        if (query == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(query);
    }

    @GetMapping
    public ResponseEntity<List<Query>> getAllQueries() {
        return ResponseEntity.ok(queryService.getAllQueries());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuery(@PathVariable UUID id) {
        queryService.deleteQuery(id);
        return ResponseEntity.noContent().build();
    }
}
