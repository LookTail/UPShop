package com.qwni.upshop.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Component
public class KafkaProducer {

    private final KafkaTemplate kafkaTemplate;

    @Autowired
    public KafkaProducer(KafkaTemplate kafkaTemplate, KafkaSendResultHandler kafkaSendResultHandler) {
        this.kafkaTemplate = kafkaTemplate;
        this.kafkaTemplate.setProducerListener(kafkaSendResultHandler);
    }

    public void send(String msg) {
        kafkaTemplate.send("test", msg);
    }


}
