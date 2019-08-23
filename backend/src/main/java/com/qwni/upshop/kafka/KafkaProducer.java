package com.qwni.upshop.kafka;

import com.alibaba.fastjson.JSON;
import com.qwni.upshop.common.entity.Order;
import com.qwni.upshop.common.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public class KafkaProducer {

    private final KafkaTemplate kafkaTemplate;

    @Autowired
    public KafkaProducer(KafkaTemplate kafkaTemplate, KafkaSendResultHandler kafkaSendResultHandler) {
        this.kafkaTemplate = kafkaTemplate;
        this.kafkaTemplate.setProducerListener(kafkaSendResultHandler);
    }

    public Boolean send(Order order) {
//        OrderItem orderItem = new OrderItem();
//        orderItem.setId("101");
//        orderItem.setTitle("压测专用");
//        orderItem.setAmount("101");
//        orderItem.setPrice("101");
//        Order order = new Order();
//        List<OrderItem> orderList = new ArrayList<>();
//        orderList.add(orderItem);
//        order.setOrderId("123456");
//        order.setItemList(orderList);
//        order.setTotalPrice("101");
        String jsonObj = JSON.toJSONString(order);
        kafkaTemplate.send(KafkaConstConfig.TOPIC, jsonObj);
        return true;
    }


}
