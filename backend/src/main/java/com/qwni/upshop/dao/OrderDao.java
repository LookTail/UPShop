package com.qwni.upshop.dao;

import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import com.qwni.upshop.common.entity.Order;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;

@Component
public class OrderDao {
    private final MongoTemplate mongoTemplate;
    private GoodsDao goodsDao;

    @Autowired
    public OrderDao(MongoTemplate mongoTemplate, GoodsDao goodsDao) {
        this.mongoTemplate = mongoTemplate;
        this.goodsDao = goodsDao;
    }

    public List<Order> getOrderAll() {
        return mongoTemplate.findAll(Order.class, "order");
    }

    public Boolean insertOrder(Order order) {
        order.setCreatedAt(Calendar.getInstance().getTime());
        Order result = mongoTemplate.insert(order, "order");
        return !result.getOrderId().isEmpty();
    }

    public Boolean deleteAllOrder() {
        Query query= new Query(new Criteria());
        DeleteResult deleteResult = mongoTemplate.remove(query, "order");
        return deleteResult.wasAcknowledged();
    }

    public Boolean deleteOrder(String orderId) {
        Query query= new Query(Criteria.where("orderId").is(orderId));
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
        update.unset("createdAt");
        UpdateResult updateResult = mongoTemplate.updateFirst(query, update, Order.class, "order");
        return updateResult.wasAcknowledged();
    }

    public Boolean deleteExpiredOrder() {
        Boolean flag = true;
        Calendar time = Calendar.getInstance();
        time.add(Calendar.MINUTE, -10);
        time.add(Calendar.SECOND, +1);
        Query query = new Query();
        query.addCriteria(Criteria.where("createdAt").lte(time.getTime()));
        List<Order> list = mongoTemplate.find(query, Order.class, "order");
//        System.out.println(list.get(0).getOrderId());
        Iterator<Order> it = list.iterator();
        while(it.hasNext()) {
            Order order = it.next();
            flag = goodsDao.recoverSales(order) && this.deleteOrder(order.getOrderId());
        }
        return flag;

    }
}
