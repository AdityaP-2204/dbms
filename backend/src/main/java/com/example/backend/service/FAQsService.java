package com.example.backend.service;

import com.example.backend.dao.FAQsDao;
import com.example.backend.model.FAQs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FAQsService {
    private final FAQsDao FAQsDao;

    @Autowired
    public FAQsService(@Qualifier("postgresFAQs") FAQsDao FAQDao) {
        this.FAQsDao = FAQDao;
    }

    public List<FAQs> getAllFAQs(){
        return FAQsDao.getAllFAQs();
    }

    public int addFAQs(FAQs FAQ){
        return FAQsDao.addFAQs(FAQ);
    }

}
