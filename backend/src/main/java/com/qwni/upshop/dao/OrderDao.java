package com.qwni.upshop.dao;

import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import com.qwni.upshop.common.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderDao {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public OrderDao(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Order> getOrderAll() {
        return mongoTemplate.findAll(Order.class, "order");
    }

    public Boolean insertOrder(Order item) {
        Order resultItem = mongoTemplate.insert(item, "order");
        return !resultItem.getOrderId().isEmpty();
    }

    public Boolean deleteOrder() {
        Query query= new Query(new Criteria());
        DeleteResult deleteResult = mongoTemplate.remove(query, "order");
        return deleteResult.wasAcknowledged();
    }

    public Boolean hasOrder(String orderId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("orderId").is(orderId));
        List<Order> list = mongoTemplate.find(query, Order.class, "order");
        return (list.size() != 0);
    }

    public Boolean changePaymentStatus(String orderId) {
        Query query = new Query(Criteria.where("orderId").is(orderId));
        Update update = Update.update("status", "1");
        UpdateResult updateResult = mongoTemplate.updateFirst(query, update, Order.class, "order");
        return updateResult.wasAcknowledged();
    }
}
