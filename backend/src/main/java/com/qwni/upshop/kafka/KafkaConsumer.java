package com.qwni.upshop.kafka;

import com.qwni.upshop.common.entity.Order;
import com.qwni.upshop.common.entity.OrderItem;
import com.qwni.upshop.dao.OrderDao;
import com.qwni.upshop.utils.OrderIdGenerator;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Component
public class KafkaConsumer {
    private static final Logger logger = Logger.getLogger(KafkaConsumer.class);

    private OrderDao orderDao;

    @Autowired
    public KafkaConsumer(OrderDao orderDao) {
        this.orderDao = orderDao;
    }

    private Map<String, Object> consumerProps() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConstConfig.BOOTSTRAP_SERVERS_CONFIG);
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, KafkaConstConfig.ENABLE_AUTO_COMMIT_CONFIG);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, KafkaConstConfig.KEY_DESERIALIZER_CLASS_CONFIG);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaConstConfig.VALUE_DESERIALIZER_CLASS_CONFIG);
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, KafkaConstConfig.MAX_POLL_RECORDS_CONFIG);
        return props;
    }

    @Bean("batchContainerFactory")
    public ConcurrentKafkaListenerContainerFactory batchListener() {
        ConcurrentKafkaListenerContainerFactory container = new ConcurrentKafkaListenerContainerFactory();
        container.setConsumerFactory(new DefaultKafkaConsumerFactory(consumerProps()));
        container.setConcurrency(KafkaConstConfig.CONTAINER_FACTORY_CONCURRENCY);
        container.setBatchListener(true);
        return container;
    }

    @KafkaListener(id = "testlistener", groupId = KafkaConstConfig.LISTENER_GROUP, topics = {KafkaConstConfig.TOPIC}, containerFactory = "batchContainerFactory")
    public void listen(@Payload List<String> records, @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int id) {
//        System.out.println("一次拉取数量"+records.size());
        for(String orderId : records) {
            logger.info("监听数据 Thread: " + Thread.currentThread().getId() + " partition:" + id + ":  " + orderId);
            OrderItem orderItem = new OrderItem();
            orderItem.setId("101");
            orderItem.setTitle("压测专用");
            orderItem.setAmount("101");
            orderItem.setPrice("101");

            Order order = new Order();
            List<OrderItem> orderList = new ArrayList<>();
            orderList.add(orderItem);
            order.setOrderId(orderId);
            order.setItemList(orderList);
            order.setTotalPrice("101");

            orderDao.insertOrder(order);
        }
        System.out.println("kafka监听器结束");
    }

}
