package com.solarshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SolarShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(SolarShopApplication.class, args);
    }
}