package com.qwni.upshop.dao;

import com.mongodb.client.result.DeleteResult;
import com.qwni.upshop.common.entity.CartItem;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartDao {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public CartDao(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Boolean insert(CartItem item) {
        CartItem resultItem = mongoTemplate.insert(item, "cart");
        return !resultItem.getId().isEmpty();
    }

    public List<CartItem> getCart() {
        return mongoTemplate.findAll(CartItem.class, "cart");
    }

    public Boolean delete(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        DeleteResult deleteResult = mongoTemplate.remove(query, "cart");
        return deleteResult.wasAcknowledged();

    }
}
