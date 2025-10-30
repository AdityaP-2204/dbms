package com.example.backend.dao;

import com.example.backend.model.Query;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Repository
public class QueryDataAccessService implements QueryDao {

    private final JdbcTemplate jdbcTemplate;

    public QueryDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class QueryRowMapper implements RowMapper<Query> {
        @Override
        public Query mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Query(
                    UUID.fromString(rs.getString("id")),
                    rs.getString("subject"),
                    rs.getString("message"),
                    rs.getTimestamp("createdAt").toLocalDateTime(),
                    UUID.fromString(rs.getString("userId"))
            );
        }
    }

    @Override
    public void insertQuery(UUID id,Query query) {
        String sql = "INSERT INTO queries (id, subject, message, createdAt, userId) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                id,
                query.getSubject(),
                query.getMessage(),
                new Timestamp(System.currentTimeMillis()),
                query.getUserId()
        );
    }

    @Override
    public Query getQueryById(UUID id) {
        String sql = "SELECT * FROM queries WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new QueryRowMapper(), id.toString());
    }

    @Override
    public List<Query> getAllQueries() {
        String sql = "SELECT * FROM queries";
        return jdbcTemplate.query(sql, new QueryRowMapper());
    }

    @Override
    public void deleteQuery(UUID id) {
        String sql = "DELETE FROM queries WHERE id = ?";
        jdbcTemplate.update(sql, id.toString());
    }
}
