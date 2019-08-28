package com.qwni.upshop.dao;

import com.qwni.upshop.common.entity.Goods;
import com.qwni.upshop.common.entity.Order;
import com.qwni.upshop.common.entity.OrderItem;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.Iterator;
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

    public Boolean checkAndReduceSales(String id, int amount) {
        Query query = new Query(Criteria.where("id").is(id).and("sales").gt(amount-1));
        Update update = new Update();
        update.inc("sales", -amount);
        FindAndModifyOptions options = new FindAndModifyOptions();
        options.returnNew(true);
        Goods result = mongoTemplate.findAndModify(query, update, options, Goods.class, "goods");
        return result != null;
    }

    public Boolean recoverSales(Order order) {
        Boolean flag = true;
        Iterator<OrderItem> it = order.getItemList().iterator();
        while(it.hasNext()) {
            OrderItem orderItem = it.next();
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(orderItem.getId()));
            Update update = new Update();
            update.inc("sales", Integer.parseInt(orderItem.getAmount()));
            FindAndModifyOptions options = new FindAndModifyOptions();
            Goods result = mongoTemplate.findAndModify(query, update, options, Goods.class, "goods");
            if(result == null) flag = false;
        }
        return flag;
    }

}
