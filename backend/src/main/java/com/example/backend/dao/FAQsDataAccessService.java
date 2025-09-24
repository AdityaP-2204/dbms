package com.example.backend.dao;

import com.example.backend.model.FAQs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("postgresFAQs")
public class FAQsDataAccessService implements FAQsDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public FAQsDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int addFAQs(UUID id, FAQs FAQ) {
        final String sql = "INSERT INTO FAQ (id, Question, Answer) VALUES (?,?,?)";
        return jdbcTemplate.update(sql,
                id,
                FAQ.getQuestion(),
                FAQ.getAnswer()
        );
    }

    @Override
    public List<FAQs> getAllFAQs() {
        final String sql = "SELECT * FROM FAQ";
        return jdbcTemplate.query(sql, (rs, i) -> new FAQs(
                UUID.fromString(rs.getString("id")),
                rs.getString("Question"),
                rs.getString("Answer")
        ));
    }
}
