package com.qwni.upshop.dao;

import com.qwni.upshop.common.entity.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class GoodsDao {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public GoodsDao(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Goods> getGoodsAll() {
        List<Goods> list = mongoTemplate.findAll(Goods.class, "goods");
        return list;
    }

    public List<Goods> getGoodsByPage(int page) {
        Query query = new Query();
        query.skip((page - 1) * 10).limit(10);
        List<Goods> list = mongoTemplate.find(query, Goods.class, "goods");
        return list;
    }

    public List<Goods> getGoodsByKey(String key) {
        Pattern pattern = Pattern.compile("^.*"+key+".*$");
        Query query = new Query();
        query.addCriteria(Criteria.where("title").regex(pattern));
        List<Goods> list = mongoTemplate.find(query, Goods.class, "goods");
        return list;
    }

    public Goods getGoodsById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        return mongoTemplate.find(query, Goods.class, "goods").get(0);
    }

}
