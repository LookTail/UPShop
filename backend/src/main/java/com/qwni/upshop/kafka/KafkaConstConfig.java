package com.qwni.upshop.kafka;

import com.alibaba.fastjson.parser.deserializer.JSONPDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;

public class KafkaConstConfig {

    // Kafka Props
    public static final String TOPIC = "test";
    public static final String LISTENER_GROUP = "testConsumer";

    // Consumer Props
    public static final String BOOTSTRAP_SERVERS_CONFIG = "localhost:9092";
    public static final Boolean ENABLE_AUTO_COMMIT_CONFIG = true;
    public static final Class KEY_DESERIALIZER_CLASS_CONFIG = StringDeserializer.class;
    public static final Class VALUE_DESERIALIZER_CLASS_CONFIG = StringDeserializer.class;
//    public static final Class KEY_DESERIALIZER_CLASS_CONFIG = JSONPDeserializer.class;
//    public static final Class VALUE_DESERIALIZER_CLASS_CONFIG = JSONPDeserializer.class;
    public static final String MAX_POLL_RECORDS_CONFIG = "10";

    // Container Factory Props
    public static final int CONTAINER_FACTORY_CONCURRENCY = 3;

}
