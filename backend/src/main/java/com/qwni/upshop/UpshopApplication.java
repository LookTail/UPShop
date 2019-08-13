package com.qwni.upshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;

@SpringBootApplication
@EnableScheduling
public class UpshopApplication {

	public static void main(String[] args) {
		SpringApplication.run(UpshopApplication.class, args);
	}

}
