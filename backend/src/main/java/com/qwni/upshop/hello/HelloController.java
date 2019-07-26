package com.qwni.upshop.hello;

import com.qwni.upshop.kafka.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {
//    @Autowired
//    private KafkaTemplate kafkaTemplate;

    @RequestMapping("/")
    @CrossOrigin("http://localhost:3000")
    public String index() {
//        KafkaProducer kafka = new KafkaProducer(kafkaTemplate);
//        kafka.send("成功了哈哈哈");

        return "Greetings from Spring Boot!";
    }



}