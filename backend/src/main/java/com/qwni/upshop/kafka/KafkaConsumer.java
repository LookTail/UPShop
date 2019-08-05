package com.qwni.upshop.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;


@Component
public class KafkaConsumer {
    private static final String TOPIC = "order";
    private static final String GROUP = "orderConsumer";

//    @KafkaListener(id = "listener0", groupId = GROUP, topics = {TOPIC})
//    public void listenPartition0(@Payload List<String> records, @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int id) {
//        for(String s : records) {
//            System.out.println("Thread: " + Thread.currentThread().getId() + "partition:" + id + ":  " + s);
//        }
//
//    }

}
