package com.qwni.upshop.dao;

import com.mongodb.client.result.UpdateResult;
import com.qwni.upshop.common.entity.Rush;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RushDao {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public RushDao(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Rush getRushInfo() {
        List<Rush> list = mongoTemplate.findAll(Rush.class, "rush");
        return list.size() > 0 ? list.get(0) : null;
    }

    public Boolean hashRushed(String token) {
        Query query = new Query();
        query.addCriteria(Criteria.where("title").is("周杰伦上海演唱会"));
        List<Rush> rushList = mongoTemplate.find(query, Rush.class, "rush");
        if(!rushList.isEmpty()) {
            Rush rush = rushList.get(0);
            if(rush.getHasRushed().contains(token)) {
                System.out.println("有了额");
                return false;
            } else {
                return true;
            }
        } else{
            System.out.println("查抢购信息出问题");
            return false;
        }
    }

    public Boolean insertHasRushed(String token) {
        Query query = new Query();
        query.addCriteria(Criteria.where("title").is("周杰伦上海演唱会"));
        Update update = new Update();
        update.addToSet("hasRushed", token);
        UpdateResult updateResult = mongoTemplate.updateFirst(query, update, Rush.class, "rush");
        return updateResult.wasAcknowledged();
    }

    public Boolean go(Integer day, Integer place, Integer num) {
        Query query = new Query();
        query.addCriteria(Criteria.where("days."+day.toString()+".places."+place.toString()+".remain").gt(num-1));
        Update update = new Update();
        update.inc("days."+day.toString()+".places."+place.toString()+".remain", -num);
        FindAndModifyOptions options = new FindAndModifyOptions();
        options.returnNew(true);
        Rush rush = mongoTemplate.findAndModify(query, update, options, Rush.class, "rush");
        return true;

    }
}
