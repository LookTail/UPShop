package com.qwni.upshop.kafka;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Component
public class KafkaConsumer {
//    private static final String TOPIC = "order";
//    private static final String GROUP = "orderConsumer";

    private static final String TOPIC = "test";
    private static final String GROUP = "testConsumer";

    private Map<String, Object> consumerProps() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, "10");
        return props;
    }

    @Bean("batchContainerFactory")
    public ConcurrentKafkaListenerContainerFactory batchListener() {
        ConcurrentKafkaListenerContainerFactory container = new ConcurrentKafkaListenerContainerFactory();
        container.setConsumerFactory(new DefaultKafkaConsumerFactory(consumerProps()));
        container.setConcurrency(1);
        container.setBatchListener(true);
        return container;
    }

    @KafkaListener(id = "testlistener", groupId = GROUP, topics = {TOPIC}, containerFactory = "batchContainerFactory")
    public void listenPartition0(@Payload List<String> records, @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int id) {
        System.out.println("一次拉取数量"+records.size());
        for(String s : records) {
            System.out.println("监听数据 Thread: " + Thread.currentThread().getId() + "partition:" + id + ":  " + s);
        }
//        try {
//            Thread.sleep(1000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

    }

}
