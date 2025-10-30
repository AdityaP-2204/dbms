package com.example.backend.dao;

import com.example.backend.model.Response;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Repository("postgresResponse")
public class ResponseDataAccessService implements ResponseDao {

    private final JdbcTemplate jdbcTemplate;

    public ResponseDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int insertResponse(UUID id,Response response) {
        String sql = "INSERT INTO response (id, message, sentAt, userId, queryId) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(
                sql,
                id,
                response.getMessage(),
                new Timestamp(System.currentTimeMillis()),
                response.getUserId(),
                response.getQueryId()
        );
    }

    @Override
    public List<Response> selectAllResponses() {
        String sql = "SELECT * FROM response";
        return jdbcTemplate.query(sql, (rs, i) -> mapRowToResponse(rs));
    }

    @Override
    public List<Response> selectAllResponsesByQueryId(UUID id) {
        String sql = "SELECT * FROM response WHERE queryId = ?";
        return jdbcTemplate.query(sql, new Object[]{id}, (rs, i) -> mapRowToResponse(rs));
    }

    @Override
    public Response selectResponseById(UUID id) {
        String sql = "SELECT * FROM response WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, i) -> mapRowToResponse(rs), id);
    }

    @Override
    public int deleteResponse(UUID id) {
        String sql = "DELETE FROM response WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    @Override
    public int updateResponse(UUID id, Response response) {
        String sql = "UPDATE response SET message = ?, userId = ?, queryId = ? WHERE id = ?";
        return jdbcTemplate.update(
                sql,
                response.getMessage(),
                response.getUserId(),
                response.getQueryId(),
                id
        );
    }

    private Response mapRowToResponse(ResultSet rs) throws java.sql.SQLException {
        return new Response(
                (UUID) rs.getObject("id"),
                rs.getString("message"),
                rs.getTimestamp("sentAt"),
                (UUID) rs.getObject("userId"),
                (UUID) rs.getObject("queryId")
        );
    }
}
